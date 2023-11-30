import { useState } from 'react'
import Input from '../components/Input/Input'

type data = {
  name: string | ''
  email: string
  mobile: string
  password: string
  rg: string
  cpf: string
  birthDate: string
  address: string
  cep: string
}

const usuario: data = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  rg: '',
  cpf: '',
  birthDate: '',
  address: '',
  cep: '',
}

const error: data = usuario

const FormPage = () => {
  const [values, setValues] = useState<data>(usuario)
  const [errors, setErrors] = useState<data>(error)
  const [submittedUsers, setSubmittedUsers] = useState<data[]>([])
  const [message, setMessage] = useState({ message: '', state: '', show: false })
  const newErrors = errors
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleChange = (name: string, detail: string) => {
    setValues({ ...values, [name]: detail })
    validateFields(values, name)
    if (Object.keys(errors).length > 0) {
      setErrors(newErrors)
    } else {
      setErrors(usuario)
    }
  }

  const handleBlur = (name: string, detail: string) => {
    if (Object.keys(errors).length > 0) {
      setErrors(newErrors)
    } else {
      setErrors(usuario)
    }
  }
  const validateFields = (values: data, field: string) => {
    if (field === 'name') {
      if (!values.name) {
        errors.name = 'Nome é obrigatório'
      } else {
        errors.name = ''
      }
    }

    if (field === 'mobile') {
      if (!values.mobile) {
        errors.mobile = 'Telefone é obrigatório'
      } else {
        errors.mobile = ''
      }
    }

    if (field === 'email') {
      if (!values.email) {
        errors.email = 'Email é obrigatório'
      } else {
        errors.email = ''
      }
    }

    if (field === 'password') {
      if (!values.password) {
        errors.password = 'Senha é obrigatório'
      } else {
        errors.password = ''
      }
    }

    if (field === 'rg') {
      if (!values.rg) {
        errors.rg = 'RG é obrigatório'
      } else {
        errors.rg = ''
      }
    }

    if (field === 'cpf') {
      if (!values.cpf) {
        errors.cpf = 'CPF é obrigatório'
      } else {
        errors.cpf = ''
      }
    }

    if (field === 'birthDate') {
      if (!values.birthDate) {
        errors.birthDate = 'Data de nascimento é obrigatório'
      } else {
        errors.birthDate = ''
      }
    }
  }

  const validateFieldsForm = (values: data) => {
    const errors: any = {}
    if (!values.name) errors.name = 'Nome é obrigatório'

    if (!values.email) errors.email = 'Email é obrigatório'

    if (!values.mobile) errors.mobile = 'Telefone é obrigatório'

    if (!values.password) errors.password = 'Senha é obrigatório'

    if (!values.rg) errors.rg = 'RG é obrigatório'

    if (!values.cpf) errors.cpf = 'CPF é obrigatório'

    if (!values.birthDate) errors.birthDate = 'Data de nascimento é obrigatório'

    return errors
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const errors = validateFieldsForm(values)

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
    } else {
      setErrors(usuario)

      setSubmittedUsers([...submittedUsers, values])

      setSubmitted(true)
      setMessage({ message: ' Formulário enviado com sucesso!', state: 'success', show: true })
      setTimeout(() => {
        setSubmitted(false)
        setMessage({ message: '', state: '', show: false })
      }, 10000)
    }
  }

  const renderErrors = (detalheErro: string) => (
    <br-message feedback state="danger" show-icon="true">
      {detalheErro}
    </br-message>
  )

  const hasSubmittedUsers = submittedUsers.length > 0

  const removeUser = (cpf: string) => {
    const updatedUsers = submittedUsers.filter((user) => user.cpf !== cpf)
    setSubmittedUsers(updatedUsers)
  }

  return (
    <>
      {message.show && (
        <br-message state={message.state} closable>
          {message.message}
        </br-message>
      )}
      <h1>Usuários</h1>
      <h2>Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Input
            type="text"
            id="name"
            placeholder="Nome"
            label="Nome:"
            value={values.name || ''}
            state={errors.name ? 'danger' : 'default'}
            onChange={(detail: any) => handleChange('name', detail)}
            onBlur={(detail: any) => handleBlur('name', detail)}
          />
          {errors.name && renderErrors(errors.name)}
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col">
              <Input
                id="email"
                type="text"
                placeholder="Email"
                label="Email:"
                value={values.email || ''}
                state={errors.email ? 'danger' : 'default'}
                onChange={(detail: any) => handleChange('email', detail)}
                onBlur={(detail: any) => handleBlur('email', detail)}
              />
              {errors.email && renderErrors(errors.email)}
            </div>
            <div className="col">
              <Input
                type="text"
                id="mobile"
                placeholder="Telefone ex: (99) 99999-9999"
                label="Telefone Celular:"
                mask="(##) #####-####"
                value={values.mobile || ''}
                state={errors.mobile ? 'danger' : 'default'}
                onChange={(detail: any) => handleChange('mobile', detail)}
                onBlur={(detail: any) => handleBlur('mobile', detail)}
              />
              {errors.mobile && renderErrors(errors.mobile)}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col">
              <Input
                type="password"
                id="password"
                placeholder="Senha"
                label="Senha:"
                ispassword
                value={values.password || ''}
                state={errors.password ? 'danger' : 'default'}
                onChange={(detail: any) => handleChange('password', detail)}
                onBlur={(detail: any) => handleBlur('password', detail)}
              />
              {errors.password && renderErrors(errors.password)}
            </div>
            <div className="col">
              <Input
                type="text"
                id="rg"
                placeholder="RG"
                label="RG:"
                value={values.rg || ''}
                state={errors.rg ? 'danger' : 'default'}
                onBlur={(detail: any) => handleBlur('rg', detail)}
                onChange={(detail: any) => handleChange('rg', detail)}
              />
              {errors.rg && renderErrors(errors.rg)}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col">
              <Input
                type="text"
                id="cpf"
                placeholder="Ex: 999.999.999-99"
                label="CPF:"
                mask="###.###.###-##"
                value={values.cpf || ''}
                state={errors.cpf ? 'danger' : 'default'}
                onBlur={(detail: any) => handleBlur('cpf', detail)}
                onChange={(detail: any) => handleChange('cpf', detail)}
              />
              {errors.cpf && renderErrors(errors.cpf)}
            </div>
            <div className="col">
              <Input
                type="text"
                id="birthDate"
                placeholder="Ex: DD/MM/AAAA"
                mask="##/##/####"
                label="Data de nascimento:"
                value={values.birthDate || ''}
                state={errors.birthDate ? 'danger' : 'default'}
                onBlur={(detail: any) => handleBlur('birthDate', detail)}
                onChange={(detail: any) => handleChange('birthDate', detail)}
              />
              {errors.birthDate && renderErrors(errors.birthDate)}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="col">
              <Input
                type="text"
                id="address"
                placeholder="Endereço"
                label="Endereço: (Opcional)"
                value={values.address || ''}
                state={errors.address ? 'danger' : 'default'}
                onChange={(detail: any) => handleChange('address', detail)}
              />
              {errors.address && renderErrors(errors.address)}
            </div>
            <div className="col">
              <Input
                type="text"
                id="cep"
                placeholder="Ex: 99999-999"
                label="CEP: (Opcional)"
                mask="#####-###"
                value={values.cep || ''}
                state={errors.cep ? 'danger' : 'default'}
                onChange={(detail: any) => handleChange('cep', detail)}
              />
              {errors.cep && renderErrors(errors.cep)}
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-md-end">
          <br-button
            className="mr-1"
            label="Enviar Formulário"
            id="enviar"
            type="primary"
            onClick={handleSubmit}
          ></br-button>
        </div>
      </form>
      {hasSubmittedUsers && (
        <>
          <h2>Usuários Cadastrados</h2>
          <br-list title="Usuário" id="submited-users" data-toggle="true">
            {submittedUsers.map((user, index) => (
              <br-item title={user.name} hover key={user.cpf}>
                <br-list>
                  <br-item hover>
                    <div className="row align-items-center">
                      <div className="col-11">
                        <p>E-mail: {user.email}</p>
                        <p>Telefone Celular: {user.mobile}</p>
                        <p>Senha: ************</p>
                        <p>RG: {user.rg}</p>
                        <p>CPF: {user.cpf}</p>
                        <p>Data de Nascimento: {user.birthDate}</p>
                        {user.address && <p>Endereço: {user.address}</p>}
                        {user.cep && <p>CEP: {user.cep}</p>}
                      </div>
                      <div className="col">
                        <br-button
                          circle="true"
                          icon="trash"
                          type="primary"
                          onClick={() => removeUser(user.cpf)}
                          aria-labelledby="Remover Usuário"
                        ></br-button>
                      </div>
                    </div>
                  </br-item>
                </br-list>
              </br-item>
            ))}
          </br-list>
        </>
      )}
    </>
  )
}

export default FormPage
