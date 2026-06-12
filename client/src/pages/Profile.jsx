import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, MapPin, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Edit details states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');

  // Shipping addresses states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [regionState, setRegionState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      setOrdersLoading(true);
      try {
        const { data } = await axios.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchMyOrders();

    // Populate addresses if present
    if (user?.addresses && user.addresses.length > 0) {
      const addr = user.addresses[0];
      setStreet(addr.street);
      setCity(addr.city);
      setRegionState(addr.state);
      setPostalCode(addr.postalCode);
      setCountry(addr.country);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateSuccess('');
    setUpdateError('');

    try {
      const payload = {
        name,
        email,
        phone,
        addresses: street ? [{ street, city, state: regionState, postalCode, country }] : []
      };

      if (password) {
        payload.password = password;
      }

      await updateProfile(payload);
      setUpdateSuccess('Profile details saved successfully!');
      setPassword('');
    } catch (err) {
      console.error(err);
      setUpdateError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="dashboard-layout" id="profile-page-container">
      <header className="dashboard-header">
        <h1>My Account</h1>
        <p>Manage your account settings, addresses, and track order history.</p>
      </header>

      {/* Tab Nav */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          id="profile-tab-orders"
        >
          <ClipboardList size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Order History
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          id="profile-tab-details"
        >
          <User size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Account Settings
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'orders' ? (
        <div className="card" id="orders-history-panel">
          <h3>Order Logs</h3>
          {ordersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner"></div>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center' }}>
              No orders placed yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items Count</th>
                    <th>Total Price</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const itemCount = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
                    return (
                      <tr key={order._id} id={`profile-order-row-${order._id}`}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                            {order._id}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{itemCount}</td>
                        <td><strong>₹{order.totalPrice.toFixed(2)}</strong></td>
                        <td>
                          {order.isPaid || order.orderStatus === 'Delivered' ? (
                            <span style={{ color: 'var(--success-color)', fontSize: '13px', fontWeight: '600' }}>
                              Paid ✓
                            </span>
                          ) : (
                            <span style={{ color: 'var(--danger-color)', fontSize: '13px', fontWeight: '600' }}>
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor:
                                order.orderStatus === 'Delivered'
                                  ? 'rgba(16, 185, 129, 0.1)'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'rgba(239, 68, 68, 0.1)'
                                  : 'rgba(245, 158, 11, 0.1)',
                              color:
                                order.orderStatus === 'Delivered'
                                  ? 'var(--success-color)'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'var(--danger-color)'
                                  : 'var(--warning-color)',
                            }}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid-2">
          {/* User Details */}
          <div className="card">
            <h3>Personal Information</h3>
            {updateSuccess && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                {updateSuccess}
              </div>
            )}
            {updateError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="auth-form">
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="profile-name-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="profile-email-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Phone Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  id="profile-phone-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Change Password (leave blank to keep current)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="profile-password-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} id="profile-submit-btn">
                Save Changes
              </button>
            </form>
          </div>

          {/* Shipping Addresses */}
          <div className="card">
            <h3><MapPin size={18} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} /> Default Shipping Address</h3>
            <form onSubmit={handleUpdateProfile} className="auth-form" style={{ marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Street Address</label>
                <input
                  type="text"
                  placeholder="123 Main St"
                  className="input-field"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  id="profile-street"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>City</label>
                <input
                  type="text"
                  placeholder="New York"
                  className="input-field"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  id="profile-city"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>State / Region</label>
                  <input
                    type="text"
                    placeholder="NY"
                    className="input-field"
                    value={regionState}
                    onChange={(e) => setRegionState(e.target.value)}
                    id="profile-state"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Postal Code</label>
                  <input
                    type="text"
                    placeholder="10001"
                    className="input-field"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    id="profile-zip"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Country</label>
                <input
                  type="text"
                  placeholder="United States"
                  className="input-field"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  id="profile-country"
                />
              </div>

              <button type="submit" className="btn btn-secondary" style={{ marginTop: '10px' }} id="profile-address-submit-btn">
                Update Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
