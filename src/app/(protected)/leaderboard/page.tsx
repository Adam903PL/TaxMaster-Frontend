"use client"
import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faCrown, faStar, faGem } from '@fortawesome/free-solid-svg-icons';
import { getLeaderboard } from '@/lib/leaderboard/action';

const DEFAULT_AVATAR = "https://media.licdn.com/dms/image/v2/D4D03AQERRpmdQVLRWg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704193940099?e=2147483647&v=beta&t=eHEewiQ1fPqvUONSeaa9u9p1CEaPvuzQb4j8oA6Zwqg";

// Confetti component
const Confetti = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Create 100 confetti particles
    const newParticles = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 40,
      size: 5 + Math.random() * 10,
      color: ['#FF4136', '#2ECC40', '#0074D9', '#FFDC00', '#FF851B', '#F012BE'][
        Math.floor(Math.random() * 6)
      ],
      rotation: Math.random() * 360,
      speed: 1 + Math.random() * 3
    }));
    
    setParticles(newParticles);
    
    // Animation loop
    let frame;
    let count = 0;
    
    const animate = () => {
      count++;
      
      if (count < 200) { // Run animation for about 6-7 seconds
        setParticles(prev => prev.map(p => ({
          ...p,
          y: p.y + p.speed,
          rotation: p.rotation + 2,
          x: p.x + Math.sin(count / 20) * 0.5
        })));
        
        frame = requestAnimationFrame(animate);
      }
    };
    
    frame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            opacity: Math.min(1, (200 - p.y) / 100)
          }}
        />
      ))}
    </div>
  );
};

// Fireworks component
const Fireworks = () => {
  const [explosions, setExplosions] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newExplosion = {
        id: Math.random(),
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        size: 5 + Math.random() * 20,
        particles: 20,
        color: ['#FF4136', '#2ECC40', '#0074D9', '#FFDC00', '#FF851B', '#F012BE'][
          Math.floor(Math.random() * 6)
        ]
      };
      
      setExplosions(prev => [...prev, newExplosion]);
      
      // Remove explosion after animation
      setTimeout(() => {
        setExplosions(prev => prev.filter(e => e.id !== newExplosion.id));
      }, 1000);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {explosions.map(explosion => (
        <div key={explosion.id} className="absolute" style={{ left: `${explosion.x}%`, top: `${explosion.y}%` }}>
          {Array.from({ length: explosion.particles }).map((_, i) => {
            const angle = (i / explosion.particles) * Math.PI * 2;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${explosion.size / 2}px`,
                  height: `${explosion.size / 2}px`,
                  backgroundColor: explosion.color,
                  transform: `translate(-50%, -50%)`,
                  animation: `firework 1s ease-out forwards`,
                  left: 0,
                  top: 0,
                  transformOrigin: 'center',
                  animationDelay: `${i * 0.01}s`
                }}
              />
            );
          })}
        </div>
      ))}
      <style jsx>{`
        @keyframes firework {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translate(
              ${Math.cos(Math.random() * Math.PI * 2) * 50}px,
              ${Math.sin(Math.random() * Math.PI * 2) * 50}px
            ) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) translate(
              ${Math.cos(Math.random() * Math.PI * 2) * 100}px,
              ${Math.sin(Math.random() * Math.PI * 2) * 100}px
            ) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Neon glow effect for top player
const NeonBorder = () => {
  const [gradientPos, setGradientPos] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPos(pos => (pos + 1) % 200);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="absolute inset-0 -m-1 rounded-lg overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(${gradientPos}deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)`,
          animation: 'neonPulse 2s infinite'
        }}
      />
      <style jsx>{`
        @keyframes neonPulse {
          0%, 100% {
            opacity: 1;
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(131,58,180,0.8));
          }
          50% {
            opacity: 0.8;
            filter: brightness(1) drop-shadow(0 0 15px rgba(253,29,29,0.8));
          }
        }
      `}</style>
    </div>
  );
};

// 3D Trophy Component
const Trophy3D = () => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      rotateY: 360,
      transition: { 
        duration: 20, 
        repeat: Infinity, 
        ease: "linear" 
      }
    });
  }, [controls]);
  
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 z-10 hidden md:block">
      <motion.div
        className="w-24 h-24 relative"
        animate={controls}
        style={{ transformStyle: "preserve-3d", perspective: 800 }}
      >
        <div className="trophy-3d">
          {/* Cup */}
          <div className="absolute w-16 h-16 bg-yellow-400 rounded-t-full top-0 left-1/2 transform -translate-x-1/2" 
               style={{ 
                 boxShadow: "inset 0 0 10px #fbbf24, 0 0 15px rgba(251, 191, 36, 0.8)",
                 background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)"
               }} />
          
          {/* Handle left */}
          <div className="absolute w-4 h-12 bg-yellow-500 rounded-full top-2 left-0" 
               style={{ 
                 boxShadow: "inset 0 0 5px #f59e0b, 0 0 10px rgba(245, 158, 11, 0.6)",
                 background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)"
               }} />
          
          {/* Handle right */}
          <div className="absolute w-4 h-12 bg-yellow-500 rounded-full top-2 right-0" 
               style={{ 
                 boxShadow: "inset 0 0 5px #f59e0b, 0 0 10px rgba(245, 158, 11, 0.6)",
                 background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)"
               }} />
          
          {/* Base */}
          <div className="absolute w-10 h-3 bg-yellow-600 bottom-0 left-1/2 transform -translate-x-1/2 rounded"
               style={{ 
                 boxShadow: "0 0 10px rgba(217, 119, 6, 0.8)",
                 background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)" 
               }} />
          
          {/* Stem */}
          <div className="absolute w-4 h-8 bg-yellow-500 bottom-3 left-1/2 transform -translate-x-1/2"
               style={{ 
                 boxShadow: "0 0 8px rgba(245, 158, 11, 0.7)",
                 background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)"
               }} />
          
          {/* Middle plate */}
          <div className="absolute w-12 h-2 bg-yellow-600 bottom-10 left-1/2 transform -translate-x-1/2 rounded"
               style={{ 
                 boxShadow: "0 0 8px rgba(217, 119, 6, 0.8)",
                 background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)" 
               }} />
          
          {/* Sparkles */}
          <motion.div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FontAwesomeIcon icon={faStar} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// 3D Diamond Component
const Diamond3D = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  
  return (
    <motion.div 
      className="absolute left-0 top-1/2 -translate-y-1/2 -ml-12 z-10 hidden md:block"
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: "preserve-3d",
        perspective: 800,
        rotateX,
        rotateY
      }}
      whileHover={{ scale: 1.1 }}
    >
      <div className="diamond-3d w-20 h-20 relative">
        {/* Main Diamond */}
        <div className="absolute w-12 h-12 transform rotate-45 top-4 left-4"
             style={{ 
               background: "linear-gradient(135deg, rgba(147,197,253,0.8) 0%, rgba(59,130,246,0.8) 50%, rgba(29,78,216,0.8) 100%)",
               boxShadow: "0 0 20px rgba(59,130,246,0.8)"
             }}
        />
        
        {/* Reflections */}
        <div className="absolute w-6 h-2 bg-white opacity-70 top-8 left-6 transform rotate-45 rounded-full" />
        <div className="absolute w-2 h-6 bg-white opacity-70 top-6 left-8 transform rotate-45 rounded-full" />
        
        {/* Sparkles */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 text-blue-200 text-sm"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        >
          <FontAwesomeIcon icon={faStar} />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-0 right-0 text-blue-200 text-sm"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7
          }}
        >
          <FontAwesomeIcon icon={faStar} />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-0 left-0 text-blue-200 text-sm"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
        >
          <FontAwesomeIcon icon={faStar} />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced LeaderboardPage component
const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const topPlayerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call with mock data for demonstration
        const mockData = await getLeaderboard()
        
        // Sort by points in descending order
        const sortedData = mockData.sort((a, b) => b.total_points - a.total_points);
        setLeaderboardData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FontAwesomeIcon icon={faCrown} className="text-yellow-400" />;
      case 1:
        return <FontAwesomeIcon icon={faMedal} className="text-gray-300" />;
      case 2:
        return <FontAwesomeIcon icon={faMedal} className="text-amber-600" />;
      default:
        return null;
    }
  };

  // Custom 3D tilt effect for top player card
  const handleMouseMove = (e) => {
    if (!topPlayerRef.current) return;
    
    const card = topPlayerRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const handleMouseLeave = () => {
    if (!topPlayerRef.current) return;
    topPlayerRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 ">
      <div className="w-full max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full p-5 sm:p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-600"
        >
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Leaderboard</h2>
            <p className="mt-2 text-sm text-gray-400">Top performers this month</p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full"
              ></motion.div>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {leaderboardData.map((entry, index) => (
                  <motion.div
                    key={entry.user_id}
                    ref={index === 0 ? topPlayerRef : null}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    onMouseMove={index === 0 ? handleMouseMove : undefined}
                    onMouseLeave={index === 0 ? handleMouseLeave : undefined}
                    className={`relative flex items-center justify-between p-4 rounded-lg border ${
                      index === 0 
                        ? 'h-28 sm:h-32 border-transparent bg-gradient-to-r from-indigo-900/50 to-purple-900/50 z-10 overflow-visible transition-transform duration-300' 
                        : 'bg-gray-700/50 border-gray-600 hover:border-indigo-500 transition-all duration-300'
                    }`}
                    style={index === 0 ? { transformStyle: 'preserve-3d' } : {}}
                    whileHover={index !== 0 ? { scale: 1.02 } : {}}
                  >
                    {index === 0 && <NeonBorder />}
                    {index === 0 && <Confetti />}
                    {index === 0 && <Fireworks />}
                    {index === 0 && <Trophy3D />}
                    {index === 0 && <Diamond3D />}
                    
                    <div className="flex items-center space-x-4 z-10" style={index === 0 ? { transform: 'translateZ(20px)' } : {}}>
                      <div className="relative">
                        <motion.div
                          whileHover={index === 0 ? { scale: 1.1, rotate: [0, -5, 5, 0] } : {}}
                        >
                          <img
                            src={DEFAULT_AVATAR}
                            alt={`${entry.first_name} ${entry.last_name}`}
                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 ${
                              index === 0 ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'border-indigo-500'
                            }`}
                          />
                        </motion.div>
                        {getRankIcon(index) && (
                          <motion.div 
                            className="absolute -top-2 -right-2 text-xl"
                            animate={index === 0 ? { 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            } : {}}
                            transition={index === 0 ? {
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "mirror"
                            } : {}}
                          >
                            {getRankIcon(index)}
                          </motion.div>
                        )}
                      </div>
                      <div>
                        <motion.h3 
                          className={`font-semibold ${index === 0 ? 'text-xl text-yellow-300' : 'text-gray-100'}`}
                          animate={index === 0 ? {
                            textShadow: ["0 0 8px rgba(250,204,21,0.5)", "0 0 16px rgba(250,204,21,0.8)", "0 0 8px rgba(250,204,21,0.5)"]
                          } : {}}
                          transition={index === 0 ? { duration: 2, repeat: Infinity } : {}}
                        >
                          {`${entry.first_name} ${entry.last_name}`}
                        </motion.h3>
                        <p className={`text-sm ${index === 0 ? 'text-yellow-300' : 'text-gray-400'}`}>
                          Rank #{index + 1}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 z-10" style={index === 0 ? { transform: 'translateZ(20px)' } : {}}>
                      {index === 0 ? (
                        <motion.div
                          className="flex items-center space-x-2"
                          animate={{ 
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <FontAwesomeIcon icon={faGem} className="text-yellow-300 text-xl" />
                          <span className="font-bold text-yellow-300 text-xl">
                            {entry.total_points} pts
                          </span>
                        </motion.div>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                          <span className="font-bold text-gray-100">
                            {entry.total_points} pts
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;