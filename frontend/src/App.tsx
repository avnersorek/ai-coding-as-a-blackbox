import './App.css';

function App() {
  return (
    <div className="container">
      <div className="logo"></div>
      <div className="login-form">
        <h2>Sign-in</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
          </div>
          <div className="form-group">
            <button type="submit">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;