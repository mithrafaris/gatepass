import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 

function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/user/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);
      toast('Successfully created your account', {
        icon: '👏',
      });
      navigate('/login');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Sign-up failed.');
      } else {
        toast.error('Something went wrong');
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-600 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-xl p-10 rounded-md sm:p-10 dark:bg-gray-50 dark:text-gray-800">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign up</h1>
          <p className="text-sm dark:text-gray-600">Create a new account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Username</label>
              <input
                type="text"
                onChange={handleChange}
                id="username"
                placeholder="Your username"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Email address</label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Password</label>
              <input
                type="password"
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
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md dark:bg-orange-950 dark:text-gray-50"
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
            <p className="px-6 text-sm text-center dark:text-gray-600">
              Already have an account?
              <Link to="/login">
                <span className="text-red-900"> Sign In</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
