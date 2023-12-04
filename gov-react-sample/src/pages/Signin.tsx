import { useState } from 'react'

const SignInPage = () => {
  const [isLogged, setIsLogged] = useState(false)
  const [userMenuVisible, setUserMenuVisible] = useState(false)

  const toggleSignIn = () => {
    setIsLogged(!isLogged)
    setUserMenuVisible(false)
  }

  const toggleFunctionality = (event: any) => {
    // Lógica para alternar a funcionalidade
    console.log('Funcionalidade clicada:', event.target.textContent)
  }

  const avatarButtonStyle = {
    padding: 'var(--spacing-scale-base)',
    height: 'auto',
  }

  return (
    <>
      <p>
        Usuário <b>{isLogged ? 'autenticado' : 'não autenticado'}</b>
      </p>

      <br-message state="info" show-icon="true">
        Clique no componentes abaixo para simular um evento de <strong>login/logout</strong> e observe o console do
        browser para mais informações.
      </br-message>

      <div className="dropdown">
        {!isLogged ? (
          <br-sign-in type="primary" label="Entrar com" entity="gov.br" onClick={toggleSignIn}></br-sign-in>
        ) : (
          <button
            className="br-sign-in"
            type="button"
            id="avatar-dropdown-trigger"
            aria-label="Abrir menu do usuário"
            onClick={() => setUserMenuVisible(!userMenuVisible)}
            data-toggle="dropdown"
            style={{
              ...avatarButtonStyle,
            }}
            data-target="user-menu"
            aria-controls="user-menu"
            data-visible={isLogged}
            aria-expanded={isLogged}
          >
            <br-avatar name="Usuário Logado" image="https://picsum.photos/id/823/400"></br-avatar>
            {userMenuVisible ? <i className="fas fa-caret-up" aria-hidden="true"></i> : null}
            {!userMenuVisible ? <i className="fas fa-caret-down" aria-hidden="true"></i> : null}
          </button>
        )}

        {userMenuVisible && (
          <br-list id="user-menu">
            <br-item hover onClick={toggleFunctionality}>
              Funcionalidade 01
            </br-item>
            <br-item hover onClick={toggleFunctionality}>
              Funcionalidade 02
            </br-item>
            <br-item hover onClick={toggleFunctionality}>
              Funcionalidade 03
            </br-item>
            <br-item hover onClick={toggleSignIn}>
              Fazer logout
            </br-item>
          </br-list>
        )}
      </div>
    </>
  )
}

export default SignInPage
