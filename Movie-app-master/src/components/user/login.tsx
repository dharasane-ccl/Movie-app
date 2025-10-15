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
  apiError?: string;
};

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated, setUser }) => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Enter a valid email";
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
  
      const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users", {
        params: { email: email }
      });
      
      const loggedInUser = response.data[0];

      if (!loggedInUser) {
        setErrors({ apiError: 'Invalid EmailId' });
        toast.error('Invalid EmailId', {
          position: 'top-right',
          className: 'bg-danger text-white',
        });
        return;
      }
      
      localStorage.removeItem('User');
      localStorage.removeItem('isLoggedIn');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('User', JSON.stringify(loggedInUser));

      setIsAuthenticated(true);
      setUser(loggedInUser);

      if (loggedInUser.id === 1) {
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
      toast.error('Failed to load user data.', {
        position: 'top-right',
        className: 'bg-danger text-white',
      });
      setErrors({ apiError: 'Failed to load user data.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-5" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="d-flex" style={{ marginLeft: '100px', padding: '10px', marginTop: '10px' }}>
          <img src="assets/logo.png" className="me-2" alt="Just Watch Logo" />
          <span className="fw-bold fs-4">Just Watch</span>
        </div>
        <h2 className="text-center mb-4 fs-5 text-secondary fw-bold mt-3">Welcome To The Just Watch</h2>
        <h6 className='text-secondary text-center'>Please sign in to your account</h6>
        <form onSubmit={handleSubmit} noValidate>
          <div className='mb-3 mt-3 mx-5 text-start'>
            <label htmlFor='emailinput'>Email id <span className="text-danger">*</span></label>
            <div style={{ maxWidth: '400px' }}>
              <input
                className={`form-control w-100 ${errors.email ? 'is-invalid' : ''}`}
                type="text"
                value={email}
                onChange={handleEmailChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              {errors.apiError && <div className="invalid-feedback">{errors.apiError}</div>}
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