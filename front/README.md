# Web Components GovBR-DS - Quickstart React

## Descrição

Projeto exemplificar o uso da [biblioteca de Web Components do GovBR-DS](https://gov.br/ds/webcomponents 'Biblioteca de Web Components do GovBR-DS') em projetos [React](https://reactjs.org/ 'React').

[Visualização ao vivo](https://govbr-ds.gitlab.io/wbc/quickstarts/govbr-ds-wbc-quickstart-react/main/).

## O que é um quickstart?

Um projeto Quickstart é um guia simplificado que mostra como criar um programa ou uma aplicação básica.

## Considerações sobre segurança, qualidade e boas práticas

É importante entender que um projeto Quickstart em software não deve ser usado diretamente em um ambiente de produção. Isso porque esses projetos são simplificados e podem não lidar com todos os desafios do mundo real.

O código do projeto Quickstart pode não lidar com questões avançadas, como segurança, escalabilidade ou gerenciamento de erros. Portanto, antes de implantar o código em um ambiente de produção real, **é crucial revisar**, testar e personalizar o código para atender às necessidades específicas do projeto e garantir que seja robusto e seguro.

Além disso, em projetos Quickstart de software, às vezes são tomadas liberdades na forma como o código é escrito para torná-lo mais fácil de entender. Isso pode significar que algumas boas práticas de programação não são seguidas ou que o código não está otimizado para desempenho máximo. Portanto, é responsabilidade do desenvolvedor adaptar o projeto Quickstart para atender às necessidades e padrões de produção adequados.

Em resumo, um projeto Quickstart em software é **um ponto de partida** útil, mas não deve ser implantado diretamente em um ambiente de produção sem revisão e ajustes adequados. Os desenvolvedores devem lembrar que a simplicidade é frequentemente priorizada em projetos Quickstart em detrimento da complexidade do mundo real e devem personalizar o código para atender às necessidades específicas de seu projeto.

## Tecnologias

Esse projeto foi desenvolvido usando:

1. [Biblioteca de Web Components do GovBR-DS](https://gov.br/ds/webcomponents 'Biblioteca de Web Components do GovBR-DS')
1. [React](https://reactjs.org/ 'React').

Para saber mais detalhes sobre Web Components sugerimos que consulte o [MDN](https://developer.mozilla.org/pt-BR/docs/Web/Web_Components 'Web Components | MDN').

## Dependências

As principais dependências do projeto são:

1. [GovBR-DS](https://www.gov.br/ds/ 'GovBR-DS')

1. [Web Components](https://gov.br/ds/webcomponents/ 'Web Components GovBR-DS')

1. [Font Awesome](https://fontawesome.com/ 'Font Awesome')

1. [Fonte Rawline](https://www.cdnfonts.com/rawline.font/ 'Fonte Rawline')

> O fontawesome e a fonte rawline podem ser importadas de um CDN. Consulte a documentação no site do GovBR-DS para mais detalhes

## Como executar o projeto?

```sh
git clone git@gitlab.com:govbr-ds/wbc/quickstarts/govbr-ds-wbc-quickstart-react.git

npm install

npm run start
```

Após isso acesso ao o projeto vai estar disponível no endereço `http://localhost:3000/`.

OBS: Para contribuir com o projeto o clone pode não ser a maneira correta. Por favor consulte nossos guias sobre como contribuir na nossa [wiki](https://gov.br/ds/wiki/ 'Wiki').

### Explicando

Para usar os Web Components GovBR-DS com o React é preciso seguir os seguintes passos:

#### declarations.d.ts

Na pasta *src* do seu projeto adicione o arquivo `declarations.d.ts` e o código abaixo, importante observar que todos os componentes que foram utilizados em seu projeto devem possuir uma referencia neste arquivo:

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    'br-footer': any
    'br-header': any
    'br-menu': any
  }
}
```

O React vai renderizar os webcomponents como um elemento HTML personalizado. Com isso alguns eventos precisam ser incluidos diretamento aos componente, por meio da função "addEventListener", com o objetivo de facilitar o trabalho sugerimos o uso do hook, useChangeComponents, que vai recuperar a referencia de DOM (ref) e assim pode ser associado a um componente React.

```typescript
import { useChangeComponents } from "hooks/useChangeComponents"
const inputRef = useChangeComponents(onChange);
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
  );
```

Esse passo registra os Web Components para o React. Registre os componentes necessários de acordo com a documentação da [biblioteca de Web Components do GovBR-DS](https://gov.br/ds/webcomponents 'Biblioteca de Web Components do GovBR-DS').

Alguns componentes são divididos em subcomponentes, como por exemplo o *Header* e o *Footer*. Nesses casos é necessário ter um arquivo de *declarations.d.ts* definindo os elementos para cada componente. Por favor consulte nosso código de exemplo para esses componentes para entender como fazer.

#### App.js

Inclua essas duas importações no arquivo *App.js*.

```javascript
import '@govbr-ds/core/dist/core.min.css'
import '@govbr-ds/webcomponents/dist/webcomponents.common'
```

## Rotas com os web componentes e Frameworks

O atributo isSpaLinkBehavior foi criado para adicionar suporte a um comportamento específico nos links do componente br-menu em aplicativos de página única (SPA). O objetivo principal é permitir que os links dentro do menu se comportem de forma diferente quando o aplicativo está em execução como SPA, em comparação com um comportamento tradicional de reload de página.

Em aplicações SPA, onde as páginas são carregadas dinamicamente sem a necessidade de recarregar a página inteira, o comportamento padrão dos links é executar uma ação interna dentro da aplicação, navegando para a nova rota sem atualizar toda a página. No entanto, quando se trata de um link tradicional, ao clicar nele, a página é recarregada do zero, o que pode causar uma experiência mais lenta e indesejada para o usuário.

Em resumo, o atributo isSpaLinkBehavior foi criado para o componente br-menu com o objetivo de oferecer suporte a aplicativos de página única (SPA). Quando definido como true para um item do menu, o link associado a esse item se comporta como um link interno do SPA, evitando o reload da página ao ser clicado. Isso proporciona uma navegação mais suave e eficiente para os usuários, melhorando a experiência geral do aplicativo. O atributo é particularmente útil em cenários com várias rotas no SPA, onde a necessidade de navegação interna é frequente. Recomenda-se usar o isSpaLinkBehavior sempre que houver links internos em um SPA, garantindo uma experiência de usuário mais agradável.

Menu.tsx:

```javascript
import React from 'react'

function Menu({ menuItems, onNavigate }) {
  const handleClick = (menuItem, event) => {
    event.preventDefault()

    if (menuItem.isSpaLinkBehavior && menuItem.url) {
      onNavigate(menuItem.url)
    } else if (menuItem.url) {
      window.location.href = menuItem.url
    }
  }

  return (
    <nav>
      <ul>
        {menuItems.map((menuItem) => (
          <li key={menuItem.id}>
            <a href="javascript:void(0)" onClick={(event) => handleClick(menuItem, event)}>
              {menuItem.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
```

menu.component.html:

```html
<nav>
  <ul>
    <li *ngFor="let menuItem of menuItems">
      <a href="javascript:void(0)" (click)="handleClick(menuItem, $event)"> {{ menuItem.name }} </a>
    </li>
  </ul>
</nav>
```

App.tsx (exemplo de utilização):

```javascript
import React from 'react'
import Menu from './Menu'

function App() {
  const menuItems = [
    { id: 1, name: 'Home', url: '/' },
    { id: 2, name: 'Sobre', url: '/about' },
    { id: 3, name: 'Serviços', url: '/services', isSpaLinkBehavior: true },
    { id: 4, name: 'Contato', url: '/contact', isSpaLinkBehavior: true },
    { id: 5, name: 'Link Externo', url: 'https://www.google.com', isSpaLinkBehavior: false },
  ]

  const handleNavigate = (url) => {
    console.log('Navegando para:', url)
    // Lógica de navegação no SPA
  }

  return (
    <div>
      <h1>Exemplo de uso do Menu</h1>
      <Menu menuItems={menuItems} onNavigate={handleNavigate} />
    </div>
  )
}

export default App
```

Neste exemplo, temos um componente React chamado Menu com uma propriedade chamada menuItems, que é uma lista de objetos que representam os itens do menu. Cada item do menu pode ter a propriedade isSpaLinkBehavior definida como true para indicar que o link deve ser tratado como um link interno do SPA. No método handleClick, verificamos se o isSpaLinkBehavior está definido para lidar com a navegação de acordo com a necessidade.

Lembre-se de que este é apenas um exemplo básico de como implementar o uso do atributo isSpaLinkBehavior em um componente React. Em um projeto real, você pode estender e personalizar esse exemplo de acordo com as necessidades específicas do seu aplicativo.

## Precisa de ajuda?

> Por favor **não** crie issues para fazer perguntas...

Use nossos canais abaixo para obter tirar suas dúvidas:

-   Site do GovBR-DS [http://gov.br/ds](http://gov.br/ds)

-   Web Components [https://gov.br/ds/webcomponents/](https://gov.br/ds/webcomponents/)

-   Pelo nosso email [govbr-ds@serpro.gov.br](mailto:govbr-ds@serpro.gov.br)

-   Usando nosso canal no discord [https://discord.gg/U5GwPfqhUP](https://discord.gg/U5GwPfqhUP)

## Como contribuir?

Antes de abrir um Merge Request tenha em mente algumas informações:

-   Esse é um projeto opensource e contribuições são bem-vindas.
-   Para facilitar a aprovação da sua contribuição, escolha um título curto, simples e explicativo para o MR, e siga os padrões da nossa [wiki](https://gov.br/ds/wiki/ 'Wiki').
-   Quer contribuir com o projeto? Confira o nosso guia [como contribuir](./CONTRIBUTING.md 'Como contribuir?').

### Commits

Nesse projeto usamos um padrão para branches e commits. Por favor observe a documentação na nossa [wiki](https://gov.br/ds/wiki/ 'Wiki') para aprender sobre os nossos padrões.

## Créditos

Os Web Components do GovBR-DS são criados pelo [SERPRO](https://www.serpro.gov.br/ 'SERPRO | Serviço Federal de Processamento de Dados') e [Dataprev](https://www.dataprev.gov.br/ 'Dataprev | Empresa de Tecnologia e Informações da Previdência') juntamente com a participação da comunidade.

## Licença

Nesse projeto usamos a licença MIT.
