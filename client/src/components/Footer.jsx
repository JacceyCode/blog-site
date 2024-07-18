import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li>
          <NavLink to="/posts/categories/Agriculture">Agriculture</NavLink>
        </li>
        <li>
          <NavLink to="/posts/categories/Business">Business</NavLink>
        </li>
        <li>
          <NavLink to="/posts/categories/Education">Education</NavLink>
        </li>
        <li>
          <NavLink to="/posts/categories/Entertainment">Entertainment</NavLink>
        </li>
        <li>
          <NavLink to="/posts/categories/Art">Art</NavLink>
        </li>
        <li>
          <NavLink to="/posts/categories/Investment">Investment</NavLink>
        </li>
        <li>
          <NavLink to="/posts/categories/Uncategorized">Uncategorized</NavLink>
        </li>
        <li>
          <NavLink to="/posts/categories/Weather">Weather</NavLink>
        </li>
      </ul>

      <div className="footer__copyright">
        <small>
          &copy; {new Date().getFullYear()} All Rights Reserved - JacceyCode
        </small>
      </div>
    </footer>
  );
};

export default Footer;
