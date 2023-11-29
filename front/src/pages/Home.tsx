import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const HomePage = () => {
  const [markdownContent, setMarkdownContent] = useState('')

  useEffect(() => {
    fetch('/wbc/quickstarts/govbr-ds-wbc-quickstart-react/README.md')
      .then((response) => response.text())
      .then((data) => setMarkdownContent(data))
      .catch((error) => console.error('Erro ao carregar o arquivo Markdown:', error))
  }, [])

  return (
    <div>
      <br-message state="info" show-icon>
        Leia com atenção as informações abaixo
      </br-message>
      <ReactMarkdown children={markdownContent} />
    </div>
  )
}

export default HomePage
