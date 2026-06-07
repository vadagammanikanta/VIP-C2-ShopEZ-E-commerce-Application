const Footer = () => {
  return (
    <footer className="footer" id="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Shop<span>EZ</span></h3>
          <p>Effortless shopping at your fingertips. Discover curated products at unmatched value.</p>
        </div>
        <div className="footer-links">
          <h4>Customer Care</h4>
          <ul>
            <li>Support Helpdesk</li>
            <li>Shipping Details</li>
            <li>Returns Policy</li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Privacy Policies</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
