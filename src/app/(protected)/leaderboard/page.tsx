'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faCrown } from '@fortawesome/free-solid-svg-icons';

interface LeaderboardEntry {
  id: number;
  name: string;
  points: number;
  rank: number;
  avatar: string;
}

const LeaderboardPage = () => {
  // Mock data - replace with real data later
  const leaderboardData: LeaderboardEntry[] = [
    { id: 1, name: "John Doe", points: 2500, rank: 1, avatar: "/api/placeholder/32/32" },
    { id: 2, name: "Jane Smith", points: 2300, rank: 2, avatar: "/api/placeholder/32/32" },
    { id: 3, name: "Mike Johnson", points: 2100, rank: 3, avatar: "/api/placeholder/32/32" },
    { id: 4, name: "Sarah Wilson", points: 1900, rank: 4, avatar: "/api/placeholder/32/32" },
    { id: 5, name: "Alex Brown", points: 1700, rank: 5, avatar: "/api/placeholder/32/32" },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FontAwesomeIcon icon={faCrown} className="text-yellow-400" />;
      case 2:
        return <FontAwesomeIcon icon={faMedal} className="text-gray-300" />;
      case 3:
        return <FontAwesomeIcon icon={faMedal} className="text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-4xl">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Leaderboard</h2>
            <p className="mt-2 text-sm text-gray-400">Top performers this month</p>
          </motion.div>

          <div className="space-y-4">
            {leaderboardData.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-500"
                    />
                    {getRankIcon(entry.rank) && (
                      <div className="absolute -top-2 -right-2 text-xl">
                        {getRankIcon(entry.rank)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100">{entry.name}</h3>
                    <p className="text-sm text-gray-400">Rank #{entry.rank}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                  <span className="font-bold text-gray-100">{entry.points} pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 