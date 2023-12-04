/**
 * DashboardHeader component
 * @param {Object} props - Props
 * @param {Function} props.onMenuClick - Callback function that is called when the menu icon is clicked
 * @returns {React.Component} A dashboard header component
 */
export const DashboardHeader = ({ onMenuClick }) => {
  return (
    <header className="br-header compact">
      <div className="container-lg">
        <div className="header-top">
          <div className="header-logo">
            <img src="/assets/logos/loopi-logo.png" alt="logo" />
          </div>
        </div>
        <div className="header-bottom">
          <div className="header-menu">
            <div className="header-menu-trigger">
              <button
                className="br-button small circle"
                type="button"
                aria-label="Menu"
                data-toggle="menu"
                data-target="#main-navigation"
                id="menu-compact"
                onClick={onMenuClick}
              >
                <i className="fas fa-bars" aria-hidden="true"></i>
              </button>
            </div>
            <div className="header-info">
              <div className="header-title">TPFchain</div>
              <div className="header-subtitle">Tesouro direto pro mundo</div>
            </div>
          </div>
          <div className="header-search">
            <div className="br-input has-icon">
              <label htmlFor="searchbox-86987">Texto da pesquisa</label>
              <input id="searchbox-86987" type="text" placeholder="O que você procura?" />
              <button className="br-button circle small" type="button" aria-label="Pesquisar">
                <i className="fas fa-search" aria-hidden="true"></i>
              </button>
            </div>
            <button
              className="br-button circle search-close ml-1"
              type="button"
              aria-label="Fechar Busca"
              data-dismiss="search"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
