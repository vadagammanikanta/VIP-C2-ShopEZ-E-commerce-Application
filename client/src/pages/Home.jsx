import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState(['All', 'mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries']);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  // Extract query keyword from URL
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const keyword = searchParams.get('keyword') || '';

  // Load categories dynamically from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/products/categories');
        if (data && data.length > 0) {
          setCategories(['All', ...data.filter(Boolean).sort()]);
        }
      } catch (err) {
        // Use static fallback if API fails
        console.warn('Could not load categories from API, using fallback list');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        let url = `/products?page=${currentPage}&limit=12`;
        if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
        if (selectedCategory && selectedCategory !== 'All') {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (sort) url += `&sort=${sort}`;

        const { data } = await axios.get(url);
        // Handle both paginated ({ products, page, pages, total }) and legacy ([]) responses
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalProducts(data.length);
          setTotalPages(1);
        } else {
          setProducts(data.products || []);
          setTotalProducts(data.total || 0);
          setTotalPages(data.pages || 1);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, selectedCategory, minPrice, maxPrice, sort, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, selectedCategory, minPrice, maxPrice, sort]);

  return (
    <div className="home-container" id="home-page-container">
      <header className="hero-banner" id="hero-banner">
        <h1>Welcome to ShopEZ</h1>
        <p>Your one-stop destination for effortless online shopping. Explore premium deals today.</p>
      </header>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar" id="filter-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-item ${selectedCategory === cat || (cat === 'All' && !selectedCategory) ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                  id={`category-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range (₹)</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="input-field"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                id="min-price-input"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="input-field"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                id="max-price-input"
                min="0"
              />
            </div>
          </div>

          {(selectedCategory || minPrice || maxPrice || sort || keyword) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setMinPrice('');
                setMaxPrice('');
                setSort('');
              }}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid var(--danger-color)',
                color: 'var(--danger-color)',
                borderRadius: '8px',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                marginTop: '8px'
              }}
              id="clear-filters-btn"
            >
              ✕ Clear Filters
            </button>
          )}
        </aside>

        {/* Catalog Listings */}
        <main className="catalog-content">
          <div className="catalog-header">
            <h2>
              {keyword
                ? `Results for "${keyword}"`
                : selectedCategory
                ? selectedCategory
                : 'Discover Products'}{' '}
              {!loading && <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-color)' }}>({totalProducts} items)</span>}
            </h2>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              id="sort-selector"
            >
              <option value="">Sort by: Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div style={{
              color: 'var(--danger-color)',
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-color)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
              <p>No products found matching your criteria.</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="products-grid" id="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px' }}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`btn ${p === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 14px', minWidth: '40px' }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
