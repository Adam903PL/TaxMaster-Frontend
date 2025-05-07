'use client';
import React, { useState, useRef, useEffect } from 'react';
import GameCharacter from '../../../components/GameCharacter';
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

const GamesPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coinPosition, setCoinPosition] = useState({ x: 40, y: 100 });
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const sampleQuestions: Question[] = [
    {
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      text: "Which planet is closest to the Sun?",
      options: ["Venus", "Mars", "Mercury", "Earth"],
      correctAnswer: 2
    }
  ];

  useEffect(() => {
    // Reset references to options when question changes
    optionRefs.current = optionRefs.current.slice(0, sampleQuestions[currentQuestion].options.length);
    // Reset coin position when question changes
    setCoinPosition({ x: 40, y: 100 });
  }, [currentQuestion]);

  // Update coin position when an option is selected
  useEffect(() => {
    if (selectedAnswer !== null && optionRefs.current[selectedAnswer]) {
      const option = optionRefs.current[selectedAnswer];
      const container = gameContainerRef.current;

      if (option && container) {
        const optionRect = option.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate the center position of the option relative to the container
        const centerX = optionRect.left - containerRect.left + (optionRect.width / 2);
        const centerY = optionRect.top - containerRect.top + (optionRect.height / 2);

        // Adjust for the coin's size (16px radius) and add some offset to account for the character
        setCoinPosition({
          x: centerX - 400,
          y: centerY - 100
        });
      }
    }
  }, [selectedAnswer]);

  const handleOptionClick = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswered) return;

    setIsAnswered(true);

    if (selectedAnswer === sampleQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }, 1500);
  };

  const getOptionClassName = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index ? "bg-blue-600 border-2 border-yellow-500" : "bg-gray-700";
    }
    if (index === sampleQuestions[currentQuestion].correctAnswer) return "bg-green-600";
    if (index === selectedAnswer) return "bg-red-600";
    return "bg-gray-700";
  };

  return (
      <div className="min-h-screen bg-gray-900 p-8 ">
        <div className="max-w-4xl mx-auto">
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
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-100">Quiz Game</h2>
                <p className="mt-2 text-sm text-gray-400">Choose a test to evaluate your skills</p>
              </motion.div>

              <div className="relative bg-gray-800 rounded-lg p-6  shadow-xl text-white" ref={gameContainerRef}>
                <div className="flex items-center justify-center mb-8 relative">
                  <GameCharacter />

                  {/* Coin with simplified animation */}
                  <motion.div
                      className="absolute z-10"
                      initial={{ x: 40, y: 100, opacity: 1 }}
                      animate={{
                        x: coinPosition.x,
                        y: coinPosition.y,
                        opacity: 1
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        mass: 0.5
                      }}
                  >
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-600">
                      <span className="text-yellow-900 font-bold text-xs">$</span>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center mb-8"
                    >
                      <h2 className="text-2xl font-semibold mb-6">
                        {sampleQuestions[currentQuestion].text}
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {sampleQuestions[currentQuestion].options.map((option, index) => (
                            <motion.button
                                ref={(el) => {
                                    optionRefs.current[index] = el;
                                }}
                                id={`option-${index}`}
                                key={index}
                                className={`p-4 pb-12 rounded-lg ${getOptionClassName(index)} hover:opacity-90 transition-colors`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOptionClick(index)}
                                disabled={isAnswered}
                            >
                              {option}
                            </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="text-center text-xl">
                    Score: {score}/{sampleQuestions.length}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-lg font-semibold text-white shadow-lg ${
                            selectedAnswer !== null && !isAnswered
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-600 cursor-not-allowed'
                        }`}
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswer === null || isAnswered}
                    >
                      Submit Answer
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
};

export default GamesPage;