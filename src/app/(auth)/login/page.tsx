'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginFunction } from '@/lib/auth/login/action';
import { useRouter } from 'next/navigation';

const DarkLoginForm = () => {

  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear any login error when user starts typing again
    if (loginError) setLoginError(false);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: ""
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      setLoginError(false);
      
      try { 
        console.log(formData)
        const resp = await LoginFunction(formData);

        if (resp) {
          setSubmitted(true);
          setTimeout(() => {
            router.push('/dashboard'); 
          }, 500);
        } else {
          setLoginError(true);
        }
      } catch (error) {
        console.log(error,"error handle submit DarkLoginForm")
        setLoginError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const successVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      }
    }
  };

  const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-5 sm:p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-600"
      >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-100">Login</h2>
          <p className="mt-2 text-sm text-gray-400">Enter your credentials</p>
        </motion.div>
        
        {submitted ? (
          <motion.div 
            className="mt-8 text-center"
            variants={successVariants}
            initial="initial"
            animate="animate"
          >
            <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-6 rounded-lg">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mb-3"
              >
                <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <p className="font-medium text-lg">Login successful!</p>
              <p className="text-sm mt-2">Welcome back, {formData.email}</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSubmitted(false)}
              className="mt-6 px-4 py-2 bg-indigo-600 text-gray-100 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Back to form
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="mt-6 space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {loginError && (
                <motion.div
                  variants={errorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Login failed</p>
                      <p className="text-xs mt-1">Invalid email or password. Please try again.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
              
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mt-4"
            >
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                  Forgot your password?
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-100 ${isLoading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-all duration-200`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="text-center mt-5"
            >
              <p className="text-sm text-gray-400">
                {`Don't`} have an account?{" "}
                <a href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                  Sign up
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DarkLoginForm;