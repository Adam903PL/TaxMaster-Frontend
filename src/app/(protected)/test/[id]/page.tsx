"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { tests } from '@/data/questions'
import { motion } from 'framer-motion'

// Define interfaces for test data
interface Test {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  questionsCount: number;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  questions?: any[];
}

const Page = () => {
  const params = useParams()
  const testId = params.id as string
  
  const [currentTest, setCurrentTest] = useState<Test | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  useEffect(() => {
    // Find the test with the matching ID
    const foundTest = tests.find(test => test.id === testId)
    
    if (foundTest) {
      setCurrentTest(foundTest)
      setTimeRemaining(foundTest.estimatedTime * 60) // Convert minutes to seconds
    }
    
    setLoading(false)
  }, [testId])

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [timeRemaining])

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleNextQuestion = () => {
    if (currentTest?.questions && currentQuestionIndex < currentTest.questions[0].length - 1) {
      // Check if this is the second-to-last question
      if (currentQuestionIndex === currentTest.questions[0].length - 2) {
        // Log all questions and answers when moving to the last question
        console.log('All test questions and answers:', {
          testId: currentTest.id,
          testTitle: currentTest.title,
          questions: currentTest.questions[0].map((question: string, index: number) => ({
            questionNumber: index + 1,
            questionText: question,
            userAnswer: userAnswers[index] || '(No answer provided)'
          }))
        })
      }
      
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = e.target.value
    setUserAnswers(newAnswers)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 mt-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  if (!currentTest) {
    return (
      <div className="container mx-auto p-6 mt-16">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h1 className="text-2xl font-bold text-red-500">Test not found</h1>
          <p className="text-gray-300 mt-2">The test with ID {testId} could not be found.</p>
        </div>
      </div>
    )
  }

  const currentQuestion = currentTest.questions && currentTest.questions[0] ? 
    currentTest.questions[0][currentQuestionIndex] : null

  return (
    <div className="container mx-auto p-6 mt-16 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl"
      >
        {/* Test header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-white">{currentTest.title}</h1>
            <p className="text-gray-400 mt-1">{currentTest.description}</p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-bold ${timeRemaining < 300 ? 'text-red-500' : 'text-indigo-400'}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {currentTest.questions?.[0]?.length || 0}
            </div>
          </div>
        </div>

        {/* Question content */}
        {currentQuestion ? (
          <div className="mb-6">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 mb-4">
              <h2 className="text-lg font-medium text-white mb-1">Question {currentQuestionIndex + 1}</h2>
              <p className="text-gray-300">{currentQuestion}</p>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-300 mb-2">Your Answer:</label>
              <textarea
                value={userAnswers[currentQuestionIndex] || ''}
                onChange={handleAnswerChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your answer here..."
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-400">No questions available for this test.</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg ${
              currentQuestionIndex === 0 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNextQuestion}
            disabled={!currentTest.questions || currentQuestionIndex >= currentTest.questions[0].length - 1}
            className={`px-4 py-2 rounded-lg ${
              !currentTest.questions || currentQuestionIndex >= currentTest.questions[0].length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Page
