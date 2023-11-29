import { useState } from 'react'
const Header = () => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const title = 'Web Components GovBR-DS - Quickstart React'
  const signature = 'Padrão Digital de Governo'
  const image = {
    src: '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/logo-react.png',
    alt: 'Logo de exemplo',
  }

  const links = [
    {
      name: 'Web Components',
      href: 'https://www.gov.br/ds/webcomponents',
      title: 'Web Components',
      target: '_blank',
    },
    {
      name: 'Padrão Digital de Governo',
      href: 'https://gov.br/ds',
      title: 'Padrão Digital de Governo',
      target: '_blank',
    },
  ]

  const functions = [
    {
      icon: 'code',
      name: 'Repositórios de Web Components',
      url: 'https://gitlab.com/govbr-ds/wbc',
      tooltipText: 'Contribua com os projetos de Web Components',
      tooltipPlace: 'bottom',
    },
    {
      icon: 'discord',
      iconFamily: 'fab',
      name: 'Discord',
      url: 'https://discord.gg/U5GwPfqhUP',
      tooltipText: 'Faça parte da nossa comunidade no discord',
      tooltipPlace: 'bottom',
    },
    {
      icon: 'book',
      name: 'Wiki',
      url: 'https://gov.br/ds/wiki/',
      tooltipText: 'Conheça nossa Wiki',
      tooltipPlace: 'bottom',
    },
  ]

  return (
    <br-header
      alt={image.alt}
      container-fluid="true"
      has-menu
      has-title-link="true"
      id="header"
      image={image.src}
      signature={signature}
      title-link-url="/wbc/quickstarts/govbr-ds-wbc-quickstart-react/"
      title={title}
    >
      <div slot="headerMenu">
        <br-button
          role="option"
          circle
          density="small"
          aria-label="Menu"
          icon={isOpen ? 'times' : 'bars'}
          data-toggle="menu"
          data-target="#main-navigation"
          onClick={toggleMenu}
        ></br-button>
      </div>
      <br-header-action
        slot="headerAction"
        title-links="Bibliotecas de componentes"
        list-links={JSON.stringify(links)}
        title-functions="Links relacionados"
        list-functions={JSON.stringify(functions)}
      ></br-header-action>
    </br-header>
  )
}

export default Header
