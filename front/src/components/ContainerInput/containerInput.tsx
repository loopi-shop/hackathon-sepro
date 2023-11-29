import React, { ReactNode } from 'react'

interface ContainerInputProps {
  children: ReactNode
}

const ContainerInput: React.FC<ContainerInputProps> = ({ children }) => {
  return <div className="col-sm">{children}</div>
}

export default ContainerInput
