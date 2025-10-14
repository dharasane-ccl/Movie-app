import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User } from './types'; 
interface LoginPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User) => void;
}
type FormErrors = {
  email?: string;
  password?: string;
  apiError?: string;
};
const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated, setUser }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const validate = () => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@') || !email.includes('.com')) {
      newErrors.email = 'Enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const response = await axios.get('/users.json');
      const users: User[] = response.data as User[];
      const loggedInUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (!loggedInUser) {
        setErrors({ apiError: 'Invalid credentials' });
        toast.error('Invalid credentials', {
          position: 'top-right',
          className: 'bg-danger text-white',
        });
        return;
      }
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setIsAuthenticated(true);
      setUser(loggedInUser);
      if ((loggedInUser as any).id === 1) {
        navigate('/admin');
      } else {
        navigate('/movie');
      }
      toast.success(`Login successful, ${loggedInUser.username}!`, {
        position: 'top-right',
        className: 'bg-success text-white',
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Failed to load users.json', {
        position: 'top-right',
        className: 'bg-danger text-white',
      });
      setErrors({ apiError: 'Failed to load users.json' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-5" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="d-flex " style={{ marginLeft: '100px', padding: '10px', marginTop: '10px' }}>
          <img src="assets/logo.png" className="me-2" alt="Just Watch Logo" />
          <span className="fw-bold fs-4">Just Watch</span>
        </div>
        <h2 className="text-center mb-4 fs-5 text-secondary fw-bold mt-3">Welocome To The Just Watch</h2>
        <h6 className='text-secondary text-center'>Please sign in to your account</h6>
        <form onSubmit={handleSubmit} noValidate>
          <div className='mb-3 mt-3 mx-5 text-start'>
            <label htmlFor='emailInput'>Email <span className="text-danger">*</span></label>
            <div style={{ maxWidth: '400px' }}>
              <input
                className={`form-control w-100 ${errors.email ? 'is-invalid' : ''}`}
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>
          <div className='mb-3 mt-3 mx-5 text-start'>
            <label htmlFor='passwordInput'>Password <span className="text-danger">*</span></label>
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <input
                className={`form-control ${errors.password || errors.apiError ? 'is-invalid' : ''}`}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleTogglePassword}
              >
                <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              {!errors.password && errors.apiError && <div className="invalid-feedback">{errors.apiError}</div>}
            </div>
          </div>
          <div className='text-center'>
            <button type="submit" className="btn btn-primary w-40 mt-3" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;