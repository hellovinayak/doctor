import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_API_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hospitalUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hospitalUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('hospitalUser');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${USERS_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...data.user, token: data.token });
        return { success: true, role: data.user.role };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role, specialization, phone) => {
    try {
      const res = await fetch(`${USERS_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, specialization, phone })
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...data.user, token: data.token });
        return { success: true, role: data.user.role };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err) {
      return { success: false, error: 'Could not connect to server' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
