import { ChangeEventHandler, InputHTMLAttributes } from 'react'
import { useChangeComponents } from '../../hooks/useChangeComponents'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelinlined?: string
  state?: string
  density?: string
  iconSign?: string
  icon?: string
  ispassword?: boolean
  isHighlight?: boolean
  mask?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onBlur?: ChangeEventHandler<HTMLInputElement>
}

const Input: React.FC<Props> = ({
  label,
  labelinlined,
  state,
  density,
  iconSign,
  icon,
  ispassword,
  isHighlight,
  mask,
  onChange,
  onBlur,
  ...rest
}) => {
  const inputRef = useChangeComponents(onChange)

  return (
    <br-input
      label={label}
      labelinlined={labelinlined}
      state={state}
      density={density}
      iconSign={iconSign}
      icon={icon}
      ispassword={ispassword}
      isHighlight={isHighlight}
      ref={inputRef}
      mask={mask}
      onChange={onChange}
      onBlur={onBlur}
      {...rest}
    ></br-input>
  )
}

export default Input
