import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-100 bg-success shadow-sm fixed-top">
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light bg-success">
        <div className="collapse navbar-collapse justify-content-start" id="navbarContent">
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex flex-row gap-4">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                <i className="bi bi-people-fill"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                <i className="bi bi-search"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                <i className="bi bi-person-add"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                <i className="bi bi-question-circle"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                <i className="bi bi-bar-chart-fill"></i>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
  
  );
}