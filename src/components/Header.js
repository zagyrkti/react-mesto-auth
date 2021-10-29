import {Link, useLocation} from "react-router-dom";
import hamburger from "../images/hamburger.svg"

function Header() {
  const location = useLocation();

  return (
      <header className="header">
        <div className="header__content">
          <a className="header__logo link link_type_normal" href="https://github.com/zagyrkti/mesto-react"
             target="_self"
             rel="noopener">{''}</a>
          <nav className="header__menu">
            {location.pathname === "/sign-in" &&
            <Link type="button" className="header__nav-link link link_type_normal">Регистрация</Link>
            }
            {location.pathname === "/sign-up" &&
            <Link type="button" className="header__nav-link link link_type_normal">Войти</Link>
            }
            <Link type="button" className="header__nav-link link link_type_normal">email@mail.com</Link>
            <button type="button" className="header__nav-button link link_type_normal">Выйти</button>
          </nav>
          <button type="button" className="header__nav-hamburger link link_type_normal">
            <img src={hamburger} alt="hamburger"/>
          </button>
        </div>
      </header>
  )
}

export default Header