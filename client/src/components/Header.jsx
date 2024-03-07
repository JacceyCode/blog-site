import { Link, NavLink } from "react-router-dom";
import Logo from "../images/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [showNav, setShowNav] = useState(
    window.innerWidth > 800 ? true : false
  );

  const { currentUser } = useContext(UserContext);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>

        {currentUser?.id && showNav && (
          <ul className="nav__menu">
            <li>
              <NavLink
                to={`/profile/${currentUser.id}`}
                onClick={closeNavHandler}
              >
                {currentUser?.name}
              </NavLink>
            </li>
            <li>
              <NavLink to="/create" onClick={closeNavHandler}>
                Create Post
              </NavLink>
            </li>
            <li>
              <NavLink to="/authors" onClick={closeNavHandler}>
                Authors
              </NavLink>
            </li>
            <li>
              <NavLink to="/logout" onClick={closeNavHandler}>
                Logout
              </NavLink>
            </li>
          </ul>
        )}
        {!currentUser?.id && showNav && (
          <ul className="nav__menu">
            <li>
              <NavLink to="/authors" onClick={closeNavHandler}>
                Authors
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" onClick={closeNavHandler}>
                Login
              </NavLink>
            </li>
          </ul>
        )}
        <button
          className="nav__toggle-btn"
          onClick={() => setShowNav((prev) => !prev)}
        >
          {!showNav ? <FaBars /> : <AiOutlineClose />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
