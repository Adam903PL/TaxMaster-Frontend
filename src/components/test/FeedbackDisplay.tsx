import React from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface FeedbackProps {
  feedback: {
    score: number;
    description: string;
  }
}

const FeedbackDisplay: React.FC<FeedbackProps> = ({ feedback }) => {
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  }

  // Get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-500/10 border-green-500/30';
    if (score >= 5) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  }

  // Get motivational message based on score
  const getMotivationalMessage = (score: number) => {
    if (score >= 8) return 'Excellent work! You\'ve shown great understanding of the topic.';
    if (score >= 5) return 'Good effort! Review the feedback to improve your understanding.';
    return 'Keep practicing! Review the concepts and try again.';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-6 border rounded-lg p-5 shadow-lg ${getScoreBgColor(feedback.score)}`}
    >
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-600">
        <h3 className="text-white font-medium text-lg">Feedback</h3>
        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
          <span className="mr-2 text-gray-300">Score:</span>
          <span className={`font-bold text-xl ${getScoreColor(feedback.score)}`}>
            {feedback.score}/10
          </span>
        </div>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>
          {feedback.description || "No feedback provided."}
        </ReactMarkdown>
      </div>
      
      {/* Motivational message based on score */}
      <div className="mt-4 pt-3 border-t border-gray-600 text-sm">
        <p className={getScoreColor(feedback.score)}>
          {getMotivationalMessage(feedback.score)}
        </p>
      </div>
    </motion.div>
  )
}

export default FeedbackDisplay