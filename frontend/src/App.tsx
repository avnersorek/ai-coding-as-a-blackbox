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
            <button type="submit">Continue</button>
          </div>
        </form>
        <p className="terms">By logging in, you agree to Cyera's Terms of Service</p>
      </div>
    </div>
  );
}

export default App;