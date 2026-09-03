import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand">
          <img src={logo} alt="AMT AutoMatch" className="brand__logo" />
          <span className="brand__wordmark">
            AutoMatch<span className="brand__wordmark-dot">.</span>
          </span>
        </Link>
        <nav className="site-nav">
          <Link to="/" className="site-nav__link">
            Inventario
          </Link>
        </nav>
      </div>
    </header>
  );
}
