import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Admin sub-view tab: 'dashboard' | 'users' | 'orders' | 'products' | 'new-product'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Database stats
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating/editing product
  const [editingProduct, setEditingProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImg, setMainImg] = useState('');
  const [carouselImg1, setCarouselImg1] = useState('');
  const [carouselImg2, setCarouselImg2] = useState('');
  const [carouselImg3, setCarouselImg3] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('100');
  const [category, setCategory] = useState('Electronics');
  const [gender, setGender] = useState('Unisex');
  const [selectedSizes, setSelectedSizes] = useState(['M']);

  // Banner state
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState(false);

  // Filters for All Products view
  const [sortBy, setSortBy] = useState('Popularity');
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterGenders, setFilterGenders] = useState([]);

  // Local order status update values
  const [selectedStatus, setSelectedStatus] = useState({});

  const categoriesList = ['mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries'];
  const sizesList = ['S', 'M', 'L', 'XL'];
  const gendersList = ['Men', 'Women', 'Unisex'];
  const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Cache to avoid re-fetching on every tab change
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadAllData = async (force = false) => {
    if (!force && dataLoaded) return;
    setLoading(true);
    try {
      const [prodRes, ordRes, userRes] = await Promise.all([
        axios.get('/products?limit=100'),
        axios.get('/orders'),
        axios.get('/users'),
      ]);
      // Handle paginated product response
      const prodData = prodRes.data;
      setProducts(Array.isArray(prodData) ? prodData : (prodData.products || []));
      setOrders(ordRes.data);
      setUsers(userRes.data);
      setDataLoaded(true);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenAddMode = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setMainImg('');
    setCarouselImg1('');
    setCarouselImg2('');
    setCarouselImg3('');
    setPrice('');
    setDiscount('');
    setStock('100');
    setCategory('Electronics');
    setGender('Unisex');
    setSelectedSizes(['M']);
    setActiveTab('new-product');
  };

  const handleOpenEditMode = (product) => {
    setEditingProduct(product);
    setTitle(product.title || product.name);
    setDescription(product.description || '');
    setMainImg(product.mainImg || product.images?.[0] || '');
    setCarouselImg1(product.carousel?.[0] || '');
    setCarouselImg2(product.carousel?.[1] || '');
    setCarouselImg3(product.carousel?.[2] || '');
    setPrice(product.price || '');
    setDiscount(product.discount || '0');
    setStock(product.stock !== undefined ? String(product.stock) : '100');
    setCategory(product.category || 'Electronics');
    setGender(product.gender || 'Unisex');
    setSelectedSizes(product.sizes || []);
    setActiveTab('new-product');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const carousel = [carouselImg1, carouselImg2, carouselImg3].filter(Boolean);
      const payload = {
        name: title,
        title,
        description,
        price: Number(price),
        discount: Number(discount || 0),
        category,
        gender,
        sizes: selectedSizes,
        mainImg,
        images: [mainImg, ...carousel].filter(Boolean),
        carousel,
        stock: Number(stock || 100),
      };

      if (editingProduct) {
        await axios.put(`/products/${editingProduct._id}`, payload);
      } else {
        await axios.post('/products', payload);
      }
      // Force reload product data after change
      await loadAllData(true);
      setActiveTab('products');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    const status = selectedStatus[orderId];
    if (!status) return;
    try {
      await axios.put(`/orders/${orderId}`, { orderStatus: status });
      await loadAllData(true);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.put(`/orders/${orderId}`, { orderStatus: 'Cancelled' });
        await loadAllData(true);
      } catch (err) {
        console.error(err);
        alert('Failed to cancel order');
      }
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
      try {
        await axios.delete(`/products/${productId}`);
        await loadAllData(true);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFilterCategoryChange = (cat) => {
    setFilterCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFilterGenderChange = (gen) => {
    setFilterGenders((prev) =>
      prev.includes(gen) ? prev.filter((g) => g !== gen) : [...prev, gen]
    );
  };

  // Filter and sort products for All Products view
  const getFilteredProducts = () => {
    let list = [...products];

    // Category filter
    if (filterCategories.length > 0) {
      list = list.filter((p) => filterCategories.includes(p.category));
    }

    // Gender filter
    if (filterGenders.length > 0) {
      list = list.filter((p) => filterGenders.includes(p.gender || 'Unisex'));
    }

    // Sorting
    if (sortBy === 'Price (low to high)') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price (high to low)') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Discount') {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    return list;
  };

  const handleUpdateBanner = (e) => {
    e.preventDefault();
    if (!bannerUrl) return;
    // Banner feature placeholder — wire to backend in a future update
    alert('Banner feature coming soon!');
  };

  return (
    <div className="admin-page-theme" style={{ backgroundColor: '#161a22', minHeight: '100vh', color: '#ffffff' }}>
      
      {/* Horizontal Nav Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 5%', backgroundColor: '#1f2937', borderBottom: '1px solid #374151' }}>
        <div 
          onClick={() => setActiveTab('dashboard')} 
          style={{ fontSize: '22px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ShopEZ <span style={{ fontSize: '14px', color: '#ff7a00', border: '1px solid #ff7a00', padding: '2px 6px', borderRadius: '4px' }}>(admin)</span>
        </div>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ fontWeight: '500', color: '#d1d5db', cursor: 'pointer' }}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            style={{ fontWeight: '500', color: activeTab === 'users' ? '#ff7a00' : '#d1d5db', cursor: 'pointer' }}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            style={{ fontWeight: '500', color: activeTab === 'orders' ? '#ff7a00' : '#d1d5db', cursor: 'pointer' }}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            style={{ fontWeight: '500', color: activeTab === 'products' ? '#ff7a00' : '#d1d5db', cursor: 'pointer' }}
          >
            Products
          </button>
          <button 
            onClick={handleOpenAddMode} 
            style={{ fontWeight: '500', color: activeTab === 'new-product' && !editingProduct ? '#ff7a00' : '#d1d5db', cursor: 'pointer' }}
          >
            New Product
          </button>
          <button 
            onClick={logout} 
            style={{ fontWeight: '500', color: '#ef4444', cursor: 'pointer' }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Body */}
      <main style={{ padding: '40px 5%' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* View 1: Main Admin Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* 4 Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                  
                  {/* Card: Total Users */}
                  <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '30px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#9ca3af', fontWeight: '500' }}>Total users</div>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff' }}>{users.length}</div>
                    <button 
                      onClick={() => setActiveTab('users')} 
                      style={{ border: '1px solid #ff7a00', color: '#ff7a00', borderRadius: '6px', padding: '6px 16px', fontWeight: '500', alignSelf: 'center', background: 'transparent', cursor: 'pointer' }}
                    >
                      View all
                    </button>
                  </div>

                  {/* Card: All Products */}
                  <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '30px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#9ca3af', fontWeight: '500' }}>All Products</div>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff' }}>{products.length}</div>
                    <button 
                      onClick={() => setActiveTab('products')} 
                      style={{ border: '1px solid #ff7a00', color: '#ff7a00', borderRadius: '6px', padding: '6px 16px', fontWeight: '500', alignSelf: 'center', background: 'transparent', cursor: 'pointer' }}
                    >
                      View all
                    </button>
                  </div>

                  {/* Card: All Orders */}
                  <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '30px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#9ca3af', fontWeight: '500' }}>All Orders</div>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff' }}>{orders.length}</div>
                    <button 
                      onClick={() => setActiveTab('orders')} 
                      style={{ border: '1px solid #ff7a00', color: '#ff7a00', borderRadius: '6px', padding: '6px 16px', fontWeight: '500', alignSelf: 'center', background: 'transparent', cursor: 'pointer' }}
                    >
                      View all
                    </button>
                  </div>

                  {/* Card: Add Product */}
                  <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '30px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#9ca3af', fontWeight: '500' }}>Add Product</div>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff' }}>new</div>
                    <button 
                      onClick={handleOpenAddMode} 
                      style={{ border: '1px solid #ff7a00', color: '#ff7a00', borderRadius: '6px', padding: '6px 16px', fontWeight: '500', alignSelf: 'center', background: 'transparent', cursor: 'pointer' }}
                    >
                      Add now
                    </button>
                  </div>

                </div>

                {/* Banner Card Row */}
                <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '30px', maxWidth: '450px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ffffff' }}>Update banner</h3>
                  <form onSubmit={handleUpdateBanner} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input 
                      type="text" 
                      placeholder="Banner url" 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      style={{ border: '1px solid #ff7a00', color: '#ff7a00', borderRadius: '6px', padding: '10px 20px', fontWeight: '500', background: 'transparent', width: 'fit-content', cursor: 'pointer' }}
                    >
                      Update
                    </button>
                  </form>
                  {bannerSuccess && (
                    <div style={{ color: '#10b981', marginTop: '12px', fontSize: '14px', fontWeight: '500' }}>
                      Store promotion banner updated successfully!
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* View 2: Users List */}
            {activeTab === 'users' && (
              <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>Registered Users</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #374151' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#9ca3af' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#9ca3af' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#9ca3af' }}>Phone</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#9ca3af' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((usr) => (
                        <tr key={usr._id} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '12px' }}><strong>{usr.name}</strong></td>
                          <td style={{ padding: '12px' }}>{usr.email}</td>
                          <td style={{ padding: '12px' }}>{usr.phone || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', backgroundColor: usr.role === 'admin' ? 'rgba(245,158,11,0.2)' : 'rgba(170,59,255,0.2)', color: usr.role === 'admin' ? '#f59e0b' : '#c084fc' }}>
                              {usr.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View 3: Orders List */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#00d2ff', marginBottom: '10px' }}>Orders</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map((order) => {
                    const firstItem = order.orderItems[0] || {};
                    return (
                      <div 
                        key={order._id} 
                        style={{ display: 'flex', gap: '24px', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '24px' }}
                      >
                        {/* Left: Thumbnail & carousel preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '150px' }}>
                          <img 
                            src={firstItem.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150'} 
                            alt="" 
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #374151' }}
                          />
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {order.orderItems.map((item, idx) => (
                              <img 
                                key={idx}
                                src={item.image} 
                                alt="" 
                                style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #374151' }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Right: Detailed text fields */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          
                          {/* Product link */}
                          <div style={{ fontSize: '18px', fontWeight: '600', color: '#00d2ff' }}>
                            {firstItem.name}
                          </div>

                          {/* Params row */}
                          <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                            Size: <strong>{firstItem.size || 'M'}</strong> | Quantity: <strong>{firstItem.quantity}</strong> | Price: <strong>₹ {firstItem.price}</strong> | Payment method: <strong>{order.paymentMethod || 'netbanking'}</strong>
                          </div>

                          {/* User data */}
                          <div style={{ fontSize: '13px', color: '#9ca3af', backgroundColor: '#1f2937', padding: '8px 12px', borderRadius: '6px', margin: '4px 0' }}>
                            <div>UserId: <span style={{ fontFamily: 'monospace' }}>{order.user?._id || order.user}</span></div>
                            <div>Name: {order.user?.name || 'Simon'} | Email: {order.user?.email || 'simon@gmail.com'} | Mobile: {order.user?.phone || '8798790898'}</div>
                          </div>

                          {/* Dates row */}
                          <div style={{ fontSize: '13px', color: '#d1d5db' }}>
                            Ordered on: <strong>{new Date(order.createdAt).toISOString().split('T')[0]}</strong> | Address: <strong>{order.shippingAddress.city}</strong> | Pincode: <strong>{order.shippingAddress.postalCode}</strong>
                          </div>

                          {/* Status and Action Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                              Order status: <span style={{ color: order.orderStatus === 'Delivered' ? '#10b981' : order.orderStatus === 'Cancelled' ? '#ef4444' : '#f59e0b', fontWeight: '600' }}>{order.orderStatus}</span>
                            </div>
                            
                            {/* Update Status Dropdown */}
                            <select 
                              className="sort-select"
                              style={{ backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #374151', padding: '6px 12px', borderRadius: '6px' }}
                              value={selectedStatus[order._id] || order.orderStatus}
                              onChange={(e) => setSelectedStatus({ ...selectedStatus, [order._id]: e.target.value })}
                            >
                              {orderStatuses.map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>

                            <button 
                              onClick={() => handleUpdateOrderStatus(order._id)}
                              style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '6px 16px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                            >
                              Update
                            </button>

                            <button 
                              onClick={() => handleCancelOrder(order._id)}
                              style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '6px 16px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View 4: Products Grid (Catalog) */}
            {activeTab === 'products' && (
              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px' }}>
                
                {/* Left Panel Sidebar Filters */}
                <aside style={{ backgroundColor: '#111827', border: '1px solid #374151', padding: '20px', borderRadius: '12px', alignSelf: 'start' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>Filters</h3>
                  
                  {/* Sort By */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>Sort By</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Popularity', 'Price (low to high)', 'Price (high to low)', 'Discount'].map((s) => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                          <input 
                            type="radio" 
                            name="sortBy" 
                            checked={sortBy === s}
                            onChange={() => setSortBy(s)}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>Categories</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {categoriesList.map((cat) => (
                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                          <input 
                            type="checkbox" 
                            checked={filterCategories.includes(cat)}
                            onChange={() => handleFilterCategoryChange(cat)}
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>Gender</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {gendersList.map((gen) => (
                        <label key={gen} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                          <input 
                            type="checkbox" 
                            checked={filterGenders.includes(gen)}
                            onChange={() => handleFilterGenderChange(gen)}
                          />
                          {gen}
                        </label>
                      ))}
                    </div>
                  </div>

                </aside>

                {/* Right Panel Grid */}
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#ffffff' }}>All Products</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                    {getFilteredProducts().map((prod) => {
                      const discountPercentage = prod.discount || 0;
                      const originalPrice = prod.price || 0;
                      const discountedPrice = Math.round(originalPrice * (1 - discountPercentage / 100));

                      return (
                        <div 
                          key={prod._id} 
                          style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}
                        >
                          {/* Image Box */}
                          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', aspectRatio: '1' }}>
                            <img 
                              src={prod.mainImg || prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'} 
                              alt="" 
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          </div>

                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {prod.title || prod.name}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px', height: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {prod.description}
                          </p>

                          {/* Price metrics */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#ff4b4b' }}>
                              ₹ {discountedPrice}
                            </span>
                            {discountPercentage > 0 && (
                              <>
                                <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#9ca3af' }}>
                                  {originalPrice}
                                </span>
                                <span style={{ fontSize: '12px', color: '#ff7a00', fontWeight: '600' }}>
                                  ({discountPercentage}% off)
                                </span>
                              </>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button 
                              onClick={() => handleOpenEditMode(prod)}
                              style={{ border: '1px solid #ff7a00', color: '#ff7a00', background: 'transparent', padding: '8px', borderRadius: '8px', fontWeight: '500', flex: 1, cursor: 'pointer' }}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(prod._id, prod.title || prod.name)}
                              style={{ border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', padding: '8px', borderRadius: '8px', fontWeight: '500', flex: 1, cursor: 'pointer' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', textAlign: 'center' }}>
                            Stock: <strong style={{ color: prod.stock > 10 ? '#10b981' : prod.stock > 0 ? '#f59e0b' : '#ef4444' }}>{prod.stock !== undefined ? prod.stock : 'N/A'}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* View 5: New Product / Edit Product */}
            {activeTab === 'new-product' && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '30px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '24px', color: '#ffffff' }}>
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  
                  <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Product name" 
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <textarea 
                        placeholder="Product Description" 
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff', minHeight: '80px', resize: 'vertical' }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div>
                      <input 
                        type="url" 
                        placeholder="Thumbnail img url" 
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                        value={mainImg}
                        onChange={(e) => setMainImg(e.target.value)}
                      />
                    </div>

                    {/* Inline row for carousel image links */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <input 
                        type="url" 
                        placeholder="Add on img1 url" 
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff', fontSize: '12px' }}
                        value={carouselImg1}
                        onChange={(e) => setCarouselImg1(e.target.value)}
                      />
                      <input 
                        type="url" 
                        placeholder="Add on img2 url" 
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff', fontSize: '12px' }}
                        value={carouselImg2}
                        onChange={(e) => setCarouselImg2(e.target.value)}
                      />
                      <input 
                        type="url" 
                        placeholder="Add on img3 url" 
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff', fontSize: '12px' }}
                        value={carouselImg3}
                        onChange={(e) => setCarouselImg3(e.target.value)}
                      />
                    </div>

                    {/* Price, Discount, Stock inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Price (₹) *</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 1999" 
                          required
                          min="0"
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Discount (%)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 15"
                          min="0"
                          max="100"
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Stock Units *</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 100"
                          required
                          min="0"
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Category</label>
                        <select
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {categoriesList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Gender</label>
                        <select
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#ffffff' }}
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          {gendersList.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Available sizes checkboxes */}
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', color: '#ffffff', marginBottom: '8px', fontWeight: '500' }}>Available Size</label>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {sizesList.map((size) => (
                          <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
                            <input 
                              type="checkbox" 
                              checked={selectedSizes.includes(size)}
                              onChange={() => handleSizeChange(size)}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      style={{ width: '100%', padding: '14px', backgroundColor: '#00d2ff', color: '#111827', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}
                    >
                      {editingProduct ? 'Save Product Changes' : 'Add product'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
