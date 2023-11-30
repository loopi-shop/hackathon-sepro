import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Menu = () => {
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const menuItems = [
    {
      id: 1,
      icon: 'home',
      name: 'Página Inicial',
      url: '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/',
      isSpaLinkBehavior: true,
    },
    {
      id: 2,
      icon: 'users-cog',
      name: 'Formulários',
      url: '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/formularios',
      isSpaLinkBehavior: true,
    },
    {
      id: 3,
      icon: 'sign-in-alt',
      name: 'Sign-In',
      url: '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/sign-in',
      isSpaLinkBehavior: true,
    },
    {
      id: 4,
      icon: 'cookie',
      name: 'Cookiebar',
      url: '/wbc/quickstarts/govbr-ds-wbc-quickstart-react/cookiebar',
      isSpaLinkBehavior: true,
    },
  ]

  const navigateRouter = (route: any) => {
    const { detail: routerPath } = route
    navigate(routerPath[0], { replace: true })
  }

  useEffect(() => {
    const menuOnScreen = document.getElementById('main-navigation')
    menuOnScreen?.addEventListener('navigate', navigateRouter)
  }, [])

  return (
    <br-menu
      ref={menuRef}
      id="main-navigation"
      is-push
      show-menu
      list={JSON.stringify(menuItems)}
      data-breakpoints="col-sm-4 col-lg-3"
    ></br-menu>
  )
}

export default Menu
