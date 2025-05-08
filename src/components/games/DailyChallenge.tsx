'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faCheck, faLock, faStar, faCalendarAlt, faCoins } from '@fortawesome/free-solid-svg-icons';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  locked: boolean;
  type: 'quiz' | 'calculation' | 'research' | 'practice';
}

interface DailyProgress {
  totalPoints: number;
  completedChallenges: number;
  streak: number;
}

const DailyChallenge: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Basic Investment Quiz',
      description: 'Complete a 5-question quiz about basic investment concepts',
      points: 50,
      difficulty: 'easy',
      completed: false,
      locked: false,
      type: 'quiz'
    },
    {
      id: '2',
      title: 'Compound Interest Calculator',
      description: 'Calculate compound interest for a given investment scenario',
      points: 75,
      difficulty: 'medium',
      completed: false,
      locked: false,
      type: 'calculation'
    },
    {
      id: '3',
      title: 'Market Research',
      description: 'Research and analyze a trending stock or cryptocurrency',
      points: 100,
      difficulty: 'hard',
      completed: false,
      locked: false,
      type: 'research'
    },
    {
      id: '4',
      title: 'Trading Practice',
      description: 'Make 3 successful trades in the trading simulator',
      points: 150,
      difficulty: 'medium',
      completed: false,
      locked: true,
      type: 'practice'
    },
    {
      id: '5',
      title: 'Portfolio Analysis',
      description: 'Analyze and optimize your current portfolio',
      points: 200,
      difficulty: 'hard',
      completed: false,
      locked: true,
      type: 'research'
    }
  ]);

  const [progress, setProgress] = useState<DailyProgress>({
    totalPoints: 0,
    completedChallenges: 0,
    streak: 0
  });

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleChallengeClick = (challenge: Challenge) => {
    if (challenge.locked) {
      alert('Complete previous challenges to unlock this one!');
      return;
    }
    setSelectedChallenge(challenge);
  };

  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          return { ...challenge, completed: true };
        }
        return challenge;
      })
    );

    setProgress(prev => ({
      totalPoints: prev.totalPoints + challenges.find(c => c.id === challengeId)?.points || 0,
      completedChallenges: prev.completedChallenges + 1,
      streak: prev.streak + 1
    }));

    // Unlock next challenge if available
    const currentIndex = challenges.findIndex(c => c.id === challengeId);
    if (currentIndex < challenges.length - 1) {
      setChallenges(prevChallenges => 
        prevChallenges.map((challenge, index) => {
          if (index === currentIndex + 1) {
            return { ...challenge, locked: false };
          }
          return challenge;
        })
      );
    }

    setSelectedChallenge(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Summary */}
        <div className="lg:col-span-3 bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Daily Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span>Total Points</span>
              </div>
              <p className="text-2xl font-bold mt-2">{progress.totalPoints}</p>
            </div>
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCheck} className="text-green-400" />
                <span>Completed</span>
              </div>
              <p className="text-2xl font-bold mt-2">{progress.completedChallenges}/5</p>
            </div>
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                <span>Day Streak</span>
              </div>
              <p className="text-2xl font-bold mt-2">{progress.streak}</p>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Today's Challenges</h2>
          <div className="space-y-4">
            {challenges.map(challenge => (
              <motion.div
                key={challenge.id}
                className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all ${
                  challenge.locked ? 'opacity-50' : ''
                } ${selectedChallenge?.id === challenge.id ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => handleChallengeClick(challenge)}
                whileHover={{ scale: challenge.locked ? 1 : 1.02 }}
                whileTap={{ scale: challenge.locked ? 1 : 0.98 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{challenge.title}</h3>
                      {challenge.locked && (
                        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                      )}
                      {challenge.completed && (
                        <FontAwesomeIcon icon={faCheck} className="text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{challenge.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`text-sm ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </span>
                      <span className="text-sm text-yellow-400 flex items-center">
                        <FontAwesomeIcon icon={faCoins} className="mr-1" />
                        {challenge.points} points
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Challenge Details */}
        <div className="lg:col-span-1">
          <div className="bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Challenge Details</h2>
            {selectedChallenge ? (
              <div className="space-y-4">
                <div className="bg-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold">{selectedChallenge.title}</h3>
                  <p className="text-sm text-gray-400 mt-2">{selectedChallenge.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className={getDifficultyColor(selectedChallenge.difficulty)}>
                        {selectedChallenge.difficulty.charAt(0).toUpperCase() + selectedChallenge.difficulty.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Points:</span>
                      <span className="text-yellow-400">{selectedChallenge.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-indigo-400">
                        {selectedChallenge.type.charAt(0).toUpperCase() + selectedChallenge.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {!selectedChallenge.completed && !selectedChallenge.locked && (
                  <button
                    onClick={() => handleCompleteChallenge(selectedChallenge.id)}
                    className="w-full bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 font-semibold transition-colors"
                  >
                    Complete Challenge
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-400">Select a challenge to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge; 