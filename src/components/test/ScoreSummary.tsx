import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/navigation'

interface ScoreSummaryProps {
  totalScore: number;
  maxScore: number;
  feedbacks: Array<{ score: number; description: string; } | null>;
  questions: string[];
  answers: string[];
  testTitle: string;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ 
  totalScore, 
  maxScore, 
  feedbacks, 
  questions, 
  answers,
  testTitle
}) => {
  const router = useRouter()
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  // Get color based on percentage
  const getPercentageColor = (percent: number) => {
    if (percent >= 80) return 'text-green-500';
    if (percent >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  }

  // Get achievement message based on percentage
  const getAchievementMessage = (percent: number) => {
    if (percent >= 80) return 'Outstanding! You\'ve mastered this topic.';
    if (percent >= 60) return 'Good job! You have a solid understanding.';
    return 'Keep practicing! You\'re on your way to mastery.';
  }

  return (
    <div className="container mx-auto p-6 mt-16 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">{testTitle} - Results</h1>
          <div className="mt-6 flex flex-col items-center">
            <div className="text-5xl font-bold mb-2 flex items-center">
              <span className={getPercentageColor(percentage)}>{percentage}%</span>
            </div>
            <div className="text-xl text-gray-300">
              <span className="font-bold">{totalScore}</span> out of <span>{maxScore}</span> points
            </div>
            <p className={`mt-4 text-lg ${getPercentageColor(percentage)}`}>
              {getAchievementMessage(percentage)}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-xl font-bold text-white mb-4">Question Summary</h2>
          
          {questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-6 bg-gray-700/30 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-white font-medium">Question {index + 1}</h3>
                {feedbacks[index] && (
                  <span className={`font-bold ${getScoreColor(feedbacks[index]?.score || 0)}`}>
                    {feedbacks[index]?.score}/10
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 mt-2 mb-3">{question}</p>
              
              <div className="bg-gray-800/50 p-3 rounded border border-gray-600 mb-3">
                <h4 className="text-sm text-gray-400 mb-1">Your Answer:</h4>
                <p className="text-gray-200 text-sm whitespace-pre-wrap">{answers[index] || "(No answer provided)"}</p>
              </div>
              
              {feedbacks[index] && (
                <div className="bg-gray-800/50 p-3 rounded border border-gray-600">
                  <h4 className="text-sm text-gray-400 mb-1">Feedback:</h4>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{feedbacks[index]?.description || ""}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button 
            onClick={() => router.push('/tests')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Back to Tests
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            View Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ScoreSummary