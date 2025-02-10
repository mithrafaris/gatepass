import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await axios.post('/user/signin', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        toast.success('Login successful', {
          icon: '👏',
        });
        navigate('/dashboard');
      } else {
        dispatch(signInFailure(res.data.message));
        toast.error(res.data.message || 'Sign-in failed.');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      dispatch(signInFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-600 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-md p-10 rounded-md sm:p-10 dark:bg-gray-50 dark:text-gray-800">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign in</h1>
          <p className="text-sm dark:text-gray-600">Sign in to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                placeholder="leroy@jenkins.com"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm">Password</label>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                placeholder="*****"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <button
                type="submit" // Corrected type
                className="w-full px-8 py-3 font-semibold rounded-md dark:bg-orange-950 dark:text-gray-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            <p className="px-6 text-sm text-center dark:text-gray-600">
              Don't have an account yet?{' '}
              <Link to="/register">
                <span className="text-red-900">Sign up</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
