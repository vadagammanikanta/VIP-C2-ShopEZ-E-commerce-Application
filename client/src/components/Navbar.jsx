import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar" id="app-navbar">
      <Link to="/" className="nav-brand" id="nav-brand">
        Shop<span>EZ</span>
      </Link>

      <form onSubmit={handleSearchSubmit} className="nav-search" id="nav-search-form">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search products..."
          className="input-field"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          id="nav-search-input"
        />
      </form>

      <div className="nav-links" id="nav-links-container">
        <Link to="/cart" className="nav-link" id="nav-cart-link">
          <ShoppingBag size={20} />
          <span>Cart</span>
          {getCartCount() > 0 && (
            <span className="cart-badge" id="nav-cart-badge">
              {getCartCount()}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="nav-link" id="nav-profile-link">
              <User size={20} />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link" id="nav-admin-link">
                <ShieldAlert size={20} />
                <span>Admin</span>
              </Link>
            )}
            <button onClick={logout} className="nav-link" id="nav-logout-btn">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link" id="nav-login-link">
            <User size={20} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
