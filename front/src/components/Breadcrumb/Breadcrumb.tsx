import { useLocation } from 'react-router-dom'
const Breadcrumb = () => {
  const location = useLocation()

  let isHome = false
  let label
  let links: any[] = [
    {
      label: 'Página Inicial',
      url: '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/',
      home: true,
    },
  ]

  if (location.pathname === '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/formularios') label = 'Formulários'
  if (location.pathname === '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/sign-in') label = 'Sign-In'
  if (location.pathname === '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/cookiebar') label = 'Cookiebar'

  links.push({
    label: label,
    url: location.pathname,
    active: true,
  })

  if (location.pathname === '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/') isHome = true

  return !isHome ? <br-breadcrumb label="Breadcrumb" links={JSON.stringify(links)}></br-breadcrumb> : null
}

export default Breadcrumb
