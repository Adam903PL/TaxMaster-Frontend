'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import QuizGame from '@/components/games/QuizGame';
import MemoryGame from '@/components/games/MemoryGame';
import TradingSimulator from '@/components/games/TradingSimulator';
import DailyChallenge from '@/components/games/DailyChallenge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faTrophy, faChartLine, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: IconDefinition;
  component: React.ReactNode;
}

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const sampleQuestions = [
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

  const games: Game[] = [
    {
      id: 'quiz',
      title: 'Financial Quiz',
      description: 'Test your knowledge with interactive questions',
      icon: faGraduationCap,
      component: <QuizGame questions={sampleQuestions} onGameComplete={(score) => console.log(`Game completed with score: ${score}`)} />
    },
    {
      id: 'memory',
      title: 'Memory Cards',
      description: 'Match financial terms with their definitions',
      icon: faGamepad,
      component: <MemoryGame onGameComplete={(moves) => console.log(`Game completed in ${moves} moves`)} />
    },
    {
      id: 'trading',
      title: 'Trading Simulator',
      description: 'Practice trading in a risk-free environment',
      icon: faChartLine,
      component: <TradingSimulator />
    },
    {
      id: 'challenge',
      title: 'Daily Challenge',
      description: 'Complete daily financial challenges',
      icon: faTrophy,
      component: <DailyChallenge />
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-5 sm:p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-600"
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Learning Games</h2>
            <p className="mt-2 text-sm text-gray-400">Choose a game to enhance your financial knowledge</p>
          </motion.div>

          {!selectedGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition-all duration-300"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={game.icon} className="text-xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">{game.title}</h3>
                      <p className="text-sm text-gray-400">{game.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              <motion.button
                onClick={() => setSelectedGame(null)}
                className="mb-4 text-gray-400 hover:text-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Games
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGame}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {games.find(game => game.id === selectedGame)?.component}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GamesPage;