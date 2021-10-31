import {Link, useLocation} from "react-router-dom";
import hamburgerIcon from "../images/hamburger.svg";
import hamburgerCloseIcon from "../images/hamburger-close.svg";
import {useEffect, useState} from "react";

function Header(props) {
  const location = useLocation();
  const loggedIn = props.loggedIn;
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isHamburgerVisible, setIsHamburgerVisible] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const hamburger = isHamburgerOpen ? hamburgerCloseIcon : hamburgerIcon

  function handleHamburgerClick() {
    setIsHamburgerOpen(!isHamburgerOpen)
    setIsMenuVisible(!isMenuVisible)
  }

  /*с гамбургером по итогу какая то лютая жесть получилась, делал что мог, более менее работает ))*/

  function handleResize() {
    const windowsWidth = window.innerWidth
    windowsWidth <= 550 ? setIsMenuVisible(false) : setIsMenuVisible(true)
    windowsWidth <= 550 ? setIsHamburgerVisible(true) : setIsHamburgerVisible(false)
    windowsWidth <= 550 && setIsHamburgerOpen(false)
  }
  /*хз почему но window.addEventListener('resize', handleResize) не работает, долго сидел думал но ни до чего не додумался*/
  /*сделал по итогу через window.onresize оно почему-то работает*/
 window.onresize = handleResize;

 useEffect(() => {
   const windowsWidth = window.innerWidth
   windowsWidth <= 550 && setIsHamburgerOpen(false)
   windowsWidth <= 550 ? setIsHamburgerVisible(true) : setIsHamburgerVisible(false)
   windowsWidth <= 550 ? setIsMenuVisible(false) : setIsMenuVisible(true)
 },[])

 return (
     <header className="header">
       <div className="header__content">
          <Link className="header__logo link link_type_normal" to="/" />
          {location.pathname === "/sign-in" &&
          <Link to="/sign-up" className="header__nav-link link link_type_normal">Регистрация</Link>
          }
          {location.pathname === "/sign-up" &&
          <Link to="/sign-in" className="header__nav-link link link_type_normal">Войти</Link>
          }

          {location.pathname === "/" && loggedIn && isMenuVisible &&
          <nav className="header__user-menu">
            <button type="button" className="header__nav-button link link_type_normal">{props.email ? props.email : "email@mail.com"}</button>
            <button type="button" className="header__nav-button header__nav-button_type_secondary link link_type_normal"
            onClick={props.onLogOut}>Выйти</button>
          </nav>
          }
          {location.pathname === "/" && loggedIn && isHamburgerVisible &&
          <button type="button" className="header__nav-hamburger link link_type_normal">
            <img src={hamburger} alt="hamburger" onClick={handleHamburgerClick}/>
          </button>
          }
        </div>
      </header>
  )
}

export default Header