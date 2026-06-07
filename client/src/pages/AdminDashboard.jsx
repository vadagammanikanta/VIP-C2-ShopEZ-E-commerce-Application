import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Clipboard, Package, Check, X } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states for creating/editing product
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  // Dropdown options
  const categoriesList = ['Electronics', 'Clothing', 'Shoes', 'Home & Kitchen', 'Books'];
  const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const { data } = await axios.get('/products');
        setProducts(data);
      } else {
        const { data } = await axios.get('/orders');
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(0);
    setCategory('Electronics');
    setStock(10);
    setImageUrl('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setImageUrl(product.images?.[0] || '');
    setModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        images: imageUrl ? [imageUrl] : []
      };

      if (editingProduct) {
        // Edit product
        await axios.put(`/products/${editingProduct._id}`, payload);
      } else {
        // Add new product
        await axios.post('/products', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}`, { orderStatus: status });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="dashboard-layout" id="admin-dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Console</h1>
        <p>Manage store catalogs inventory, review sales logs, and track order fulfillment.</p>
      </header>

      {/* Tab Nav */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          id="admin-tab-products"
        >
          <Package size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Products Catalog
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          id="admin-tab-orders"
        >
          <Clipboard size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Order Management
        </button>
      </div>

      {/* Toolbar / Actions */}
      <div className="admin-toolbar">
        <h2>{activeTab === 'products' ? 'Catalog Inventory' : 'Processing Orders'}</h2>
        {activeTab === 'products' && (
          <button onClick={handleOpenAddModal} className="btn btn-primary" id="admin-add-product-btn">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <div className="spinner"></div>
        </div>
      ) : activeTab === 'products' ? (
        <div className="card" id="admin-products-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} id={`admin-product-row-${prod._id}`}>
                  <td>
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                      alt=""
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td><strong>{prod.name}</strong></td>
                  <td>{prod.category}</td>
                  <td>${prod.price.toFixed(2)}</td>
                  <td>{prod.stock} items</td>
                  <td>
                    <div className="action-row">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="btn btn-secondary"
                        style={{ padding: '6px' }}
                        id={`admin-edit-product-${prod._id}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="btn btn-danger"
                        style={{ padding: '6px' }}
                        id={`admin-delete-product-${prod._id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" id="admin-orders-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Fulfillment Address</th>
                <th>Total Cost</th>
                <th>Tracking Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id} id={`admin-order-row-${ord._id}`}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{ord._id}</span>
                  </td>
                  <td>
                    <strong>{ord.user?.name || 'Guest User'}</strong>
                    <div style={{ fontSize: '12px' }}>{ord.user?.email || 'N/A'}</div>
                  </td>
                  <td>
                    {ord.shippingAddress
                      ? `${ord.shippingAddress.street}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state}`
                      : 'N/A'}
                  </td>
                  <td><strong>${ord.totalPrice.toFixed(2)}</strong></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          ord.orderStatus === 'Delivered'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : ord.orderStatus === 'Cancelled'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        color:
                          ord.orderStatus === 'Delivered'
                            ? 'var(--success-color)'
                            : ord.orderStatus === 'Cancelled'
                            ? 'var(--danger-color)'
                            : 'var(--warning-color)',
                      }}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      className="sort-select"
                      style={{ padding: '4px 8px' }}
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                      id={`admin-order-status-select-${ord._id}`}
                    >
                      {orderStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal overlay for creating/editing product */}
      {modalOpen && (
        <div className="modal-overlay" id="admin-product-modal">
          <div className="modal-content">
            <h3>{editingProduct ? 'Modify Product Details' : 'Create New Catalog Item'}</h3>
            <form onSubmit={handleProductSubmit} className="auth-form">
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Headset"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="modal-product-name"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Category</label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id="modal-product-category"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    placeholder="29.99"
                    className="input-field"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    id="modal-product-price"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Inventory Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="15"
                    className="input-field"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    id="modal-product-stock"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  id="modal-product-image"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Description</label>
                <textarea
                  placeholder="Provide product details..."
                  className="input-field"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="modal-product-desc"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  id="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="modal-submit-btn">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
