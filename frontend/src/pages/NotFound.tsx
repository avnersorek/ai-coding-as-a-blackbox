function NotFound() {
  return (
    <div className="container">
      <div className="not-found-content error-404 not-found" data-testid="404">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default NotFound;