'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

interface Question {
  question_id: number;
  content: string;
}

interface Test {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  questions_count: number;
  category: string;
  is_new: boolean;
  questions: Question[];
}

interface UserPoints {
  user_id: string;
  test_id: string;
  points: number;
  is_done: boolean;
}

interface TestsResponse {
  tests: Test[];
}

interface PointsResponse {
  points: UserPoints[];
}

const DarkTestSelection: React.FC = () => {
  const router = useRouter();
  const [testsData, setTestsData] = useState<Test[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsResponse, pointsResponse] = await Promise.all([
          fetch('/api/tests-list'),
          fetch('/api/user-points')
        ]);

        if (!testsResponse.ok || !pointsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const testsData: TestsResponse = await testsResponse.json();
        const pointsData: PointsResponse = await pointsResponse.json();

        setTestsData(testsData.tests || []);
        setUserPoints(pointsData.points || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load tests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get user points for a specific test
  const getUserPoints = (testId: string) => {
    const userPoint = userPoints.find(point => point.test_id === testId);
    return userPoint ? userPoint.points : 0;
  };

  // Check if test is completed
  const isTestCompleted = (testId: string) => {
    const userPoint = userPoints.find(point => point.test_id === testId);
    return userPoint ? userPoint.is_done : false;
  };

  // Get unique categories from testsData
  const categories = Array.from(new Set(testsData.map(test => test.category)));

  // Filter testsData based on selected filters
  const filteredTests = testsData.filter(test => {
    const matchesCategory = selectedCategory ? test.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? test.difficulty === selectedDifficulty : true;
    const matchesSearch = searchTerm.trim() === '' ? true : 
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // Function to start a test
  const startTest = (test: Test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
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

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Get the appropriate color for difficulty badge
  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'bg-green-900/50 border-green-700 text-green-300';
      case 'medium': return 'bg-yellow-900/50 border-yellow-700 text-yellow-300';
      case 'hard': return 'bg-red-900/50 border-red-700 text-red-300';
    }
  };

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-6 mt-16">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p className="text-gray-300 mt-2">{error}</p>
            <button 
              onClick={() => router.push('/tests')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen p-4 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl p-5 sm:p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-600"
        >
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-100">Test Selection</h2>
            <p className="mt-2 text-sm text-gray-400">Choose a test to evaluate your skills</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
                Search tests
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by title or description..."
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
                Filter by Difficulty
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedDifficulty(value ? value as 'easy' | 'medium' | 'hard' : null);
                }}
                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedDifficulty(null);
                  setSearchTerm('');
                }}
                className="w-full py-2 px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Tests List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 space-y-4"
          >
            <h3 className="text-xl font-medium text-gray-200 mb-4">Available Tests ({filteredTests.length})</h3>
            
            {filteredTests.length === 0 ? (
              <motion.div 
                variants={itemVariants}
                className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 text-center"
              >
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-400">No tests match your criteria. Try adjusting your filters.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTests.map((test) => (
                  <motion.div
                    key={test.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg overflow-hidden hover:border-indigo-500 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-semibold text-gray-100">{test.title}</h4>
                        <div className="flex space-x-2">
                          {test.is_new && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 border border-blue-700 text-blue-300">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{test.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                          <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                        </span>
                        
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
                          <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {test.estimated_time} min
                        </span>
                        
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
                          <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          {test.questions_count} questions
                        </span>
                        
                        {isTestCompleted(test.id) && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-900/50 border border-green-700 text-green-300">
                            <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        )}
                        
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-900/50 border border-indigo-700 text-indigo-300">
                          Points: {getUserPoints(test.id)}
                        </span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => startTest(test)}
                        className="w-full flex justify-center items-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-gray-100 font-medium transition-colors duration-200"
                      >
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Start Test
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Test Start Modal */}
        <AnimatePresence>
          {isModalOpen && selectedTest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
              >
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-900/60 border border-indigo-700 mb-4">
                    <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">{selectedTest.title}</h3>
                  <p className="text-gray-400 mt-2">{selectedTest.description}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <span className="text-gray-300">Difficulty</span>
                    <span className={`font-medium ${selectedTest.difficulty === 'easy' ? 'text-green-400' : selectedTest.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {selectedTest.difficulty.charAt(0).toUpperCase() + selectedTest.difficulty.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <span className="text-gray-300">Estimated Time</span>
                    <span className="font-medium text-gray-200">{selectedTest.estimated_time} minutes</span>
                  </div>
                  
                  <div className="flex justify-between bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <span className="text-gray-300">Questions</span>
                    <span className="font-medium text-gray-200">{selectedTest.questions_count} questions</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      router.push(`/test/${selectedTest.id}`);
                      setIsModalOpen(false);
                    }}
                    className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-gray-100 font-medium transition-colors duration-200"
                  >
                    Begin Test
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DarkTestSelection;