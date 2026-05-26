import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { accountLinks, asset, navigation } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

function NavDropdown({ item, onNavigate, isExpanded, onToggle }) {
  if (item.path) {
    return (
      <NavLink className="main-nav-link" to={item.path} onClick={onNavigate}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <div className={`main-nav-item ${item.columns ? 'has-mega' : ''}${isExpanded ? ' is-expanded' : ''}`}>
      <button
        aria-expanded={isExpanded}
        className="main-nav-link"
        type="button"
        onClick={onToggle}
      >
        <span>{item.label}</span>
        <MaterialIcon name={isExpanded ? 'expand_less' : 'expand_more'} />
      </button>
      <div className={`nav-dropdown ${item.columns ? 'mega-menu' : ''}`}>
        {item.columns
          ? item.columns.map((column) => (
              <div className="dropdown-group" key={column.label}>
                <Link className="dropdown-heading" to={column.path} onClick={onNavigate}>
                  {column.label}
                </Link>
                {column.items.map((child) => (
                  <Link className="dropdown-link" key={child.path} to={child.path} onClick={onNavigate}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ))
          : item.items.map((child) => (
              <Link className="dropdown-link" key={child.path} to={child.path} onClick={onNavigate}>
                {child.label}
              </Link>
            ))}
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [expandedNavItem, setExpandedNavItem] = useState(null);

  const closeMenus = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
    setExpandedNavItem(null);
  };

  const toggleNavItem = (label) => {
    setExpandedNavItem((current) => (current === label ? null : label));
  };

  return (
    <header className="site-header">
      <section className="top-bar">
        <div className="container header-grid">
          <Link className="brand-link" to="/" onClick={closeMenus}>
            <picture>
              <source media="(max-width: 767px)" srcSet={asset('logo-estafeta-e.svg')} />
              <img src={asset('logo-estafeta.svg')} alt="Estafeta" />
            </picture>
          </Link>

          <div className="top-actions">
            <button className="icon-text-button" type="button" onClick={() => setSearchOpen((value) => !value)}>
              <MaterialIcon name="search" title="Buscar" />
            </button>
            <Link className="icon-text-button branch-link" to="/buscar-sucursal" onClick={closeMenus}>
              <MaterialIcon name="distance" />
              <span>Buscar una sucursal</span>
            </Link>
            <button className="language-button" type="button">
              <MaterialIcon name="language" />
              <span>Español</span>
              <MaterialIcon name="expand_more" />
            </button>
          </div>

          <button
            aria-expanded={menuOpen}
            aria-label="Abrir menu"
            className="mobile-menu-button"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MaterialIcon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </section>

      {searchOpen ? (
        <div className="search-strip">
          <div className="container">
            <form className="search-form">
              <MaterialIcon name="search" />
              <input aria-label="Buscar en Estafeta" placeholder="Buscar" type="search" />
            </form>
          </div>
        </div>
      ) : null}

      <section className={`nav-bar ${menuOpen ? 'is-open' : ''}`}>
        <div className="container nav-grid">
          <nav aria-label="Principal" className="main-nav">
            {navigation.map((item) => (
              <NavDropdown
                item={item}
                key={item.label}
                onNavigate={closeMenus}
                isExpanded={expandedNavItem === item.label}
                onToggle={() => toggleNavItem(item.label)}
              />
            ))}
          </nav>

          <div className="nav-utility">
            <a className="utility-icon" href="https://tienda.estafeta.com" target="_blank" rel="noreferrer">
              <MaterialIcon name="store" title="Tienda Estafeta" />
              <span>Tienda Estafeta</span>
            </a>
            <div className="account-menu">
              <button
                className="utility-icon"
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
              >
                <MaterialIcon name="account_circle" title="Cuenta" />
              </button>
              {accountOpen ? (
                <div className="account-dropdown">
                  {accountLinks.map((link) => (
                    <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}
