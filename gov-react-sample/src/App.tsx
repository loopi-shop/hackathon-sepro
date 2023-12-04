import '@govbr-ds/core/dist/core.min.css'
import '@govbr-ds/webcomponents/dist/webcomponents.umd.min.js'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Menu from 'components/Menu/Menu'
import CookiebarPage from 'pages/Cookiebar'
import FormPage from 'pages/Form'
import HomePage from 'pages/Home'
import SignInPage from 'pages/Signin'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <>
      <div className="template-base">
        <Header />
        <main className="d-flex flex-fill mb-5" id="main">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-4 col-lg-3">
                <Menu />
              </div>
              <div className="col mb-5">
                <Breadcrumb />
                <div className="main-content pl-sm-3 mt-4" id="main-content">
                  <Routes>
                    <Route path="wbc/quickstarts/govbr-ds-wbc-quickstart-react/" element={<HomePage />} />
                    <Route path="wbc/quickstarts/govbr-ds-wbc-quickstart-react/formularios" element={<FormPage />} />
                    <Route path="wbc/quickstarts/govbr-ds-wbc-quickstart-react/sign-in" element={<SignInPage />} />
                    <Route path="wbc/quickstarts/govbr-ds-wbc-quickstart-react/cookiebar" element={<CookiebarPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
