"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faCrown } from '@fortawesome/free-solid-svg-icons';
import { getLeaderboard } from '@/lib/leaderboard/action';

const DEFAULT_AVATAR = "https://media.licdn.com/dms/image/v2/D4D03AQERRpmdQVLRWg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704193940099?e=2147483647&v=beta&t=eHEewiQ1fPqvUONSeaa9u9p1CEaPvuzQb4j8oA6Zwqg";

interface LeaderboardEntry {
  user_id: string;
  first_name: string;
  last_name: string;
  total_points: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speed: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  size: number;
  particles: number;
  color: string;
}

// Confetti component
const Confetti = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
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
    let frame: number;
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
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  
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
          {Array.from({ length: explosion.particles }).map((_, i) => (
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
          ))}
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

// Enhanced LeaderboardPage component
const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard();
        // Sort by points in descending order
        const sortedData = data.sort((a, b) => b.total_points - a.total_points);
        setLeaderboardData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getRankIcon = (index: number) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-4xl">
        <div className="w-full p-5 sm:p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-600">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Leaderboard</h2>
            <p className="mt-2 text-sm text-gray-400">Top performers this month</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.user_id}
                  className={`relative flex items-center justify-between p-4 rounded-lg border ${
                    index === 0 
                      ? 'border-transparent bg-gradient-to-r from-indigo-900/50 to-purple-900/50 z-10' 
                      : 'bg-gray-700/50 border-gray-600 hover:border-indigo-500'
                  } transition-all duration-300`}
                >
                  {index === 0 && <NeonBorder />}
                  {index === 0 && <Confetti />}
                  {index === 0 && <Fireworks />}
                  
                  <div className="flex items-center space-x-4 z-10">
                    <div className="relative">
                      <img
                        src={DEFAULT_AVATAR}
                        alt={`${entry.first_name} ${entry.last_name}`}
                        className={`w-12 h-12 rounded-full border-2 ${
                          index === 0 ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-indigo-500'
                        }`}
                      />
                      {getRankIcon(index) && (
                        <div className="absolute -top-2 -right-2 text-xl">
                          {getRankIcon(index)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100">{`${entry.first_name} ${entry.last_name}`}</h3>
                      <p className={`text-sm ${index === 0 ? 'text-yellow-300' : 'text-gray-400'}`}>
                        Rank #{index + 1}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 z-10">
                    <FontAwesomeIcon icon={faTrophy} className={index === 0 ? 'text-yellow-300 text-lg' : 'text-yellow-400'} />
                    <span className={`font-bold ${index === 0 ? 'text-yellow-300 text-lg' : 'text-gray-100'}`}>
                      {entry.total_points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;