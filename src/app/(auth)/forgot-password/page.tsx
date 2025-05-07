'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail } from '@/lib/forgot-password/send-email/action';

// Mock password reset functions - replace with real implementations
// const sendPasswordResetEadmail = async (email) => {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   // For demo, email containing "error" will fail
//   if (email.includes('error')) {
//     return { success: false, message: 'Email not found' };
//   }
//   return { success: true, message: 'Reset email sent' };
// };

const verifyResetCode = async (code) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (code !== '123456') {
    return { success: false, message: 'Invalid code' };
  }
  return { success: true, message: 'Code verified' };
};

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: Code verification
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setStatusMessage({ type: '', message: '' });
  };

  const handleCodeChange = (e) => {
    setResetCode(e.target.value);
    setStatusMessage({ type: '', message: '' });
  };

  const handleSubmitEmail = async () => {
    if (!email) {
      setStatusMessage({ type: 'error', message: 'Please enter your email address' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatusMessage({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: '', message: '' });
    
    try {
      const response = await sendPasswordResetEmail(email);
      
      if (response.success) {
        setStatusMessage({ type: 'success', message: 'Reset instructions sent to your email' });
        // Move to the next step after a brief delay
        setTimeout(() => {
          setStep(2);
        }, 1500);
      } else {
        setStatusMessage({ type: 'error', message: response.message || 'Email not found' });
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!resetCode) {
      setStatusMessage({ type: 'error', message: 'Please enter the verification code' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: '', message: '' });
    
    try {
      const response = await verifyResetCode(resetCode);
      
      if (response.success) {
        setStatusMessage({ type: 'success', message: 'Code verified. You can now reset your password.' });
      } else {
        setStatusMessage({ type: 'error', message: response.message || 'Invalid code' });
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-100">
            {step === 1 ? 'Forgot Password' : 'Verify Code'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {step === 1 
              ? 'Enter your email to receive a reset link' 
              : 'Enter the verification code sent to your email'}
          </p>
        </motion.div>
        
        <AnimatePresence>
          {statusMessage.type && (
            <motion.div
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`${
                statusMessage.type === 'success' 
                  ? 'bg-green-900/50 border-green-700 text-green-200' 
                  : 'bg-red-900/50 border-red-700 text-red-200'
              } border px-4 py-3 rounded-lg`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {statusMessage.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {statusMessage.type === 'success' ? 'Success!' : 'Error'}
                  </p>
                  <p className="text-xs mt-1">{statusMessage.message}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-6 space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {step === 1 ? (
            <>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitEmail}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-100 ${isLoading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-all duration-200`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Reset Link'}
                </motion.button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <label htmlFor="reset-code" className="block text-sm font-medium text-gray-300">
                  Verification Code
                </label>
                <input
                  id="reset-code"
                  name="reset-code"
                  type="text"
                  value={resetCode}
                  onChange={handleCodeChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter 6-digit code"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitCode}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-100 ${isLoading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-all duration-200`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : 'Verify Code'}
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button 
                  onClick={() => {
                    setStep(1);
                    setStatusMessage({ type: '', message: '' });
                  }}
                  className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Try with a different email
                </button>
              </motion.div>
            </>
          )}
            
          <motion.div 
            variants={itemVariants}
            className="text-center mt-5"
          >
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
              <a href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;