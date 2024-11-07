import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h1>Athletic Hub</h1>
      <ul className="nav-links">
        <li>
          <Link to="/">Participants</Link>
        </li>
        <li>
          <Link to="/results">Results</Link>
        </li>
        <li>
          <Link to="/disciplines">Disciplines</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
