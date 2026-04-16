import React, { useEffect, useRef, useState } from 'react';

const Login = ({ onLogin }) => { // Accept onLogin prop from parent
  const signinRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check initial login status from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        if (onLogin) onLogin(parsedUser); // Notify parent if already logged in
      } catch (parseErr) {
        console.error('Error parsing stored user:', parseErr);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [onLogin]);

  // Initialize GIS when component mounts
  useEffect(() => {
    if (loading || isLoggedIn) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: '369842549051-7644ikbkan8o2qdrr57g1bg6lria5pd6.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_prompt: false,
        });

        if (signinRef.current) {
          window.google.accounts.id.renderButton(signinRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
          });
        }

        // Optional: One Tap prompt
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Handle as needed
          }
        });

        setLoading(false);
      } else {
        // Retry if script not loaded yet (async defer)
        const timer = setTimeout(initGoogle, 100);
        return () => clearTimeout(timer);
      }
    };

    initGoogle();
  }, [isLoggedIn, loading, onLogin]);

  const handleCredentialResponse = async (response) => {
    setError(null);
    console.log('Encoded JWT ID token:', response.credential);
    
    try {
      const res = await fetch('http://localhost:5000/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential }),
      });
      const userData = await res.json();
      if (res.ok) {
        console.log('User info:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('google_user_id', userData.user_id); // Use backend's user_id (sub)
        setUser(userData);
        setIsLoggedIn(true);
        if (onLogin) onLogin(userData); // Notify parent to update state
        // Removed alert to keep it clean—handle welcome in App if needed
      } else {
        throw new Error(userData.error || 'Verification failed');
      }
    } catch (err) {
      console.error('Error sending token:', err);
      setError(err.message);
    }
  };

  const signOut = () => {
    const userId = localStorage.getItem('google_user_id');
    if (userId && window.google?.accounts?.id) {
      window.google.accounts.id.revoke(userId, () => {
        console.log('User signed out and access revoked');
        localStorage.removeItem('user');
        localStorage.removeItem('google_user_id');
        setUser(null);
        setIsLoggedIn(false);
        if (onLogin) onLogin(null); // Notify parent
        // Optionally reload or redirect
        window.location.reload(); // Simple refresh to reset app
      });
    } else {
      // Fallback if Google not available
      localStorage.removeItem('user');
      localStorage.removeItem('google_user_id');
      setUser(null);
      setIsLoggedIn(false);
      if (onLogin) onLogin(null);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="login-overlay">
        <div className="login-box">
          <div className="login-content">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="login-overlay">
        <div className="login-box">
          <div className="login-content">
            <h2>Welcome, {user?.name}!</h2>
            {user?.picture && (
              <img 
                src={user.picture} 
                alt="Profile" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%',
                  display: 'block',
                  margin: '0 auto 10px'
                }} 
              />
            )}
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
              {user?.email}
            </p>
            <button 
              className="signout-btn" 
              onClick={signOut}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-overlay">
      <div className="login-box">
        <div className="login-content">
          <h2>Sign In to Continue</h2>
          {error && (
            <p style={{ color: '#e74c3c', fontSize: '14px', margin: '10px 0' }}>
              {error}
            </p>
          )}
          <div 
            ref={signinRef} 
            style={{ 
              minHeight: '50px',
              display: 'flex',
              justifyContent: 'center',
              margin: '20px 0'
            }}
          />
          <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', margin: 0 }}>
            Use your Google account to sign in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;