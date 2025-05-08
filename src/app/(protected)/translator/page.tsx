'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faSpinner, faCopy, faVolumeUp, faRedo } from '@fortawesome/free-solid-svg-icons';

const TranslatorPage = () => {
    const [term, setTerm] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!term.trim()) return;

        setIsLoading(true);
        setError('');
        
        try {
            // API call to get the explanation
            const response = await fetch('/api/ask-ai-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: term }),
            });

            if (!response.ok) {
                throw new Error('Failed to get explanation');
            }

            const data = await response.json();
            setExplanation(data.response);
        } catch (error) {
            setError('Failed to get explanation. Please try again.');
            setExplanation('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(explanation);
    };

    const handleSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(explanation);
        window.speechSynthesis.speak(utterance);
    };

    const handleReset = () => {
        setTerm('');
        setExplanation('');
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl"
            >
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-100">Financial Term Translator</h1>
                    <p className="text-gray-400 mt-1">Enter any financial term to get a simple explanation</p>
                </div>

                <motion.div
                    className="bg-gray-800 border border-gray-600 rounded-xl shadow-xl"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        {/* Input Section */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder="Enter a financial term (e.g., VAT, Compound Interest, Stock Options)..."
                                    className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-gray-400">
                                        {term.length} characters
                                    </div>
                                    <div className="flex space-x-2">
                                        {explanation && (
                                            <motion.button
                                                type="button"
                                                onClick={handleReset}
                                                className="px-4 py-2 rounded-lg text-gray-100 font-medium bg-gray-600 hover:bg-gray-700 transition-all duration-200"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FontAwesomeIcon icon={faRedo} className="mr-2" />
                                                Reset
                                            </motion.button>
                                        )}
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading || !term.trim()}
                                            className={`px-4 py-2 rounded-lg text-gray-100 font-medium transition-all duration-200 ${
                                                isLoading || !term.trim()
                                                    ? 'bg-gray-600 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                            whileHover={!isLoading && term.trim() ? { scale: 1.02 } : {}}
                                            whileTap={!isLoading && term.trim() ? { scale: 0.98 } : {}}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                                    Translating...
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                                                    Translate
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Output Section */}
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="h-32 relative">
                                {explanation ? (
                                    <div className="h-full overflow-y-auto">
                                        <p className="text-gray-300 leading-relaxed">{explanation}</p>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400">
                                        Simplified explanation will appear here
                                    </div>
                                )}
                            </div>
                            {explanation && (
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        <FontAwesomeIcon icon={faCopy} />
                                    </button>
                                    <button
                                        onClick={handleSpeak}
                                        className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                                        title="Listen to explanation"
                                    >
                                        <FontAwesomeIcon icon={faVolumeUp} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mx-4 mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default TranslatorPage;