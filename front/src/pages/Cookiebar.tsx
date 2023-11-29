import Cookiebar from '../components/Cookiebar/Cookiebar'

const CookiebarPage = () => {
  return (
    <>
      <br-message state="info" show-icon="true">
        O componente <strong>{'<br-cookiebar></br-cookiebar>'}</strong> foi configurado para aparecer apenas nessa
        página para demonstrar seu funcionamento.
        <br />
        Na maioria dos casos ele será configurado para aparecer em todas as páginas.
      </br-message>

      <Cookiebar></Cookiebar>
    </>
  )
}

export default CookiebarPage
