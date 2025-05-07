'use client';
import React from 'react';
import { motion } from 'framer-motion';

const GameCharacter = () => {
    return (
        <div className="w-48 h-48 relative">
            <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                    ease: "easeInOut"
                }}
            >
                {/* Head */}
                <circle cx="100" cy="70" r="40" fill="#4B5563" />

                {/* Eyes */}
                <circle cx="85" cy="60" r="5" fill="white" />
                <circle cx="115" cy="60" r="5" fill="white" />

                {/* Smile */}
                <path
                    d="M80 80 Q100 95 120 80"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                />

                {/* Body */}
                <path
                    d="M100 110 L100 160 M70 130 L130 130 M100 160 L80 190 M100 160 L120 190"
                    stroke="#4B5563"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                {/* Coin in hand (domyślna pozycja) */}
                <circle cx="80" cy="120" r="10" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
                <text x="80" y="124" textAnchor="middle" fill="#78350F" fontWeight="bold" fontSize="12">$</text>
            </motion.svg>

            {/* Dymek myślowy */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -top-12 -right-8 bg-white text-gray-800 p-2 rounded-lg w-40 text-center text-xs"
            >
                <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white transform rotate-45"></div>
                Wybierz odpowiedź i zatwierdź przyciskiem!
            </motion.div>
        </div>
    );
};

export default GameCharacter;