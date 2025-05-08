"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { evaluateAnswer } from '@/lib/test/action'
import FeedbackDisplay from '@/components/test/FeedbackDisplay'
import ScoreSummary from '@/components/test/ScoreSummary'
import NavBar from '@/components/NavBar'

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

interface TestsResponse {
  tests: Test[];
}

interface Feedback {
  score: number;
  description: string;
}

const Page = () => {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string
  
  const [currentTest, setCurrentTest] = useState<Test | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false)
  const [isTestCompleted, setIsTestCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch('/api/tests-list')
        if (!response.ok) {
          throw new Error('Failed to fetch tests')
        }
        const data: TestsResponse = await response.json()
        const test = data.tests.find(t => t.id === testId)
        
        if (!test) {
          throw new Error('Test not found')
        }

        setCurrentTest(test)
        setTimeRemaining(test.estimated_time * 60) // Convert minutes to seconds
        
        // Initialize empty answers and feedbacks arrays based on question count
        if (test.questions) {
          setUserAnswers(new Array(test.questions.length).fill(''))
          setFeedbacks(new Array(test.questions.length).fill(null))
        }
      } catch (err) {
        setError('Failed to load test. Please try again later.')
        console.error('Error fetching test:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [testId])

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0 && !isTestCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, isTestCompleted])

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleNextQuestion = async () => {
    if (!currentTest?.questions) return

    // If this answer has already been evaluated, just navigate
    if (feedbacks[currentQuestionIndex]) {
      navigateToNextQuestion()
      return
    }

    // Submit current answer for evaluation
    await submitAnswer()
  }
  
  const navigateToNextQuestion = () => {
    if (!currentTest?.questions) return
    
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // If this is the last question, mark the test as completed
      setIsTestCompleted(true)
      // Here you would typically submit the final results to the API
      submitTestResults()
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

  const submitAnswer = async () => {
    if (!currentTest?.questions) return
    
    const currentQuestion = currentTest.questions[currentQuestionIndex]
    const currentAnswer = userAnswers[currentQuestionIndex] || ''
    
    setIsFetchingFeedback(true)
    
    try {
      const result = await evaluateAnswer({
        question: currentQuestion.content,
        answer: currentAnswer
      })
      
      const newFeedbacks = [...feedbacks]
      newFeedbacks[currentQuestionIndex] = result
      setFeedbacks(newFeedbacks)
    } catch (error) {
      console.error("Error evaluating answer:", error)
      setError('Failed to evaluate answer. Please try again.')
    } finally {
      setIsFetchingFeedback(false)
    }
  }

  const submitTestResults = async () => {
    try {
      const totalScore = getTotalScore()
      console.log('Submitting test results:', {
        test_id: testId,
        points: totalScore,
        is_done: true
      });

      const response = await fetch('/api/user-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_id: testId,
          points: totalScore,
          is_done: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to submit test results: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Test results submitted successfully:', result);

      // After successful submission, navigate to the score summary
      setIsTestCompleted(true)
    } catch (error) {
      console.error('Error submitting test results:', error)
      setError(error instanceof Error ? error.message : 'Failed to save test results. Please try again.')
    }
  }

  const getTotalScore = () => {
    return feedbacks.reduce((sum, feedback) => sum + (feedback?.score || 0), 0)
  }

  const getMaxPossibleScore = () => {
    return feedbacks.length * 10 // Each question has a max score of 10
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-6 mt-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </>
    )
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
    )
  }

  if (!currentTest) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-6 mt-16">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h1 className="text-2xl font-bold text-red-500">Test not found</h1>
            <p className="text-gray-300 mt-2">The test with ID {testId} could not be found.</p>
            <button 
              onClick={() => router.push('/tests')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </>
    )
  }

  // Display summary when test is completed
  if (isTestCompleted) {
    return (
      <>
        <NavBar />
        <ScoreSummary 
          totalScore={getTotalScore()}
          maxScore={getMaxPossibleScore()}
          feedbacks={feedbacks}
          questions={currentTest.questions.map(q => q.content)}
          answers={userAnswers}
          testTitle={currentTest.title}
        />
      </>
    )
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex]
  const currentFeedback = feedbacks[currentQuestionIndex]

  return (
    <>
      <NavBar />
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
                Question {currentQuestionIndex + 1} of {currentTest.questions.length}
              </div>
            </div>
          </div>

          {/* Question content */}
          {currentQuestion ? (
            <div className="mb-6">
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 mb-4">
                <h2 className="text-lg font-medium text-white mb-1">Question {currentQuestionIndex + 1}</h2>
                <p className="text-gray-300">{currentQuestion.content}</p>
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

              {/* Feedback display */}
              {currentFeedback && (
                <FeedbackDisplay feedback={currentFeedback} />
              )}
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
              disabled={currentQuestionIndex === 0 || isFetchingFeedback}
              className={`px-4 py-2 rounded-lg ${
                currentQuestionIndex === 0 || isFetchingFeedback
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={isFetchingFeedback}
              className={`px-4 py-2 rounded-lg ${
                isFetchingFeedback
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isFetchingFeedback ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Evaluating...
                </span>
              ) : (
                currentQuestionIndex >= currentTest.questions.length - 1 ? 'Finish Test' : 'Next'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Page