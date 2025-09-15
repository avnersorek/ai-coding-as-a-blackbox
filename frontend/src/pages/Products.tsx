import { useEffect } from 'react';

function Products() {
  useEffect(() => {
    document.title = 'AI Coding - Products';
  }, []);

  return (
    <div className="container">
      <div className="products-content">
        <h1>Products</h1>
        <p>Welcome to our products page.</p>
      </div>
    </div>
  );
}

export default Products;