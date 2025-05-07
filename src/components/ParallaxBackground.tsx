'use client';

import React, { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <>
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 opacity-80"></div>

        <div 
          className="absolute w-96 h-96 rounded-full bg-purple-700/20 blur-3xl"
          style={{ 
            top: `calc(30% + ${mousePosition.y * -30}px)`, 
            left: `calc(20% + ${mousePosition.x * -30}px)`,
            transform: `scale(${1 + scrollPosition * 0.0005})` 
          }}
        ></div>

        <div 
          className="absolute w-96 h-96 rounded-full bg-blue-700/20 blur-3xl"
          style={{ 
            top: `calc(60% + ${mousePosition.y * 40}px)`, 
            right: `calc(20% + ${mousePosition.x * 40}px)`,
            transform: `scale(${1 + scrollPosition * 0.0003})` 
          }}
        ></div>

        <div 
          className="absolute w-96 h-96 rounded-full bg-indigo-700/20 blur-3xl"
          style={{ 
            bottom: `calc(10% + ${mousePosition.y * -20}px)`, 
            left: `calc(30% + ${mousePosition.x * 20}px)`,
            transform: `scale(${1 + scrollPosition * 0.0007})` 
          }}
        ></div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
        ></div>

        <div className="stars absolute inset-0"></div>
      </div>

      <style jsx>{`
        @keyframes twinkling {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        .stars {
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 90px 40px, #ddd, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 230px 180px, #eee, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 320px 250px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 400px 300px, #ddd, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 480px 120px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 570px 210px, #eee, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 650px 300px, #ddd, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 720px 190px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 850px 280px, #eee, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 1000px 1000px;
          animation: twinkling 8s infinite;
        }
      `}</style>
    </>
  );
}
