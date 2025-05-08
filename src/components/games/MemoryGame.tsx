'use client';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Component for the 3D floating particles animation
const ParticleSystem = ({ matchedPairs, totalPairs, gameComplete }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const frameIdRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 20;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 200);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particleCount = 100;
    const particles = new THREE.Group();
    particlesRef.current = particles;
    
    // Create particle geometry
    const particleGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    
    // Create particles with different colors
    for (let i = 0; i < particleCount; i++) {
      const hue = (i / particleCount) * 360;
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(`hsl(${hue}, 80%, 60%)`),
        transparent: true,
        opacity: 0.8
      });
      
      const particle = new THREE.Mesh(particleGeometry, material);
      
      // Position particles in a sphere
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      particle.position.x = 5 * Math.cos(theta) * Math.sin(phi);
      particle.position.y = 5 * Math.sin(theta) * Math.sin(phi);
      particle.position.z = 5 * Math.cos(phi);
      
      // Store original position for animation
      particle.userData = {
        originalPosition: particle.position.clone(),
        speed: Math.random() * 0.01 + 0.005,
        amplitude: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2
      };
      
      particles.add(particle);
    }
    
    scene.add(particles);

    // Animation
    const animate = () => {
      const progress = matchedPairs / totalPairs;
      const time = Date.now() * 0.001;
      
      // Rotate particle system
      particles.rotation.y += 0.003 + (progress * 0.003);
      
      // Animate each particle
      particles.children.forEach((particle, index) => {
        const { originalPosition, speed, amplitude, phase } = particle.userData;
        
        // Pulse particles outward based on progress
        const expansionFactor = 1 + (progress * 0.5);
        const pulseAmount = gameComplete ? 
          Math.sin(time * 2 + index) * 0.3 + 0.7 : 
          Math.sin(time * speed + phase) * amplitude;
        
        particle.position.copy(originalPosition);
        particle.position.multiplyScalar(expansionFactor + pulseAmount);
        
        // Make particles more vibrant with progress
        if (particle.material) {
          const hue = (index / particles.children.length) * 360;
          const saturation = 80 + (progress * 20);
          const lightness = 50 + (progress * 20);
          particle.material.color.set(new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`));
          
          // Make particles pulse brighter when game is complete
          if (gameComplete) {
            const pulseBrightness = Math.sin(time * 3 + index) * 0.3 + 0.7;
            particle.material.opacity = 0.5 + pulseBrightness * 0.5;
            particle.scale.setScalar(0.8 + pulseBrightness * 0.5);
          }
        }
      });
      
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      mountRef.current && mountRef.current.removeChild(renderer.domElement);
    };
  }, [matchedPairs, totalPairs, gameComplete]);

  return (
    <div ref={mountRef} className="mx-auto mb-4 rounded-lg overflow-hidden shadow-lg"></div>
  );
};

// Main memory game component
const EnhancedMemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const financialTerms = [
    { term: 'Compound Interest', definition: 'Interest earned on both the principal and accumulated interest' },
    { term: 'Dividend', definition: 'A portion of a company\'s profits paid to shareholders' },
    { term: 'ROI', definition: 'Return on Investment - measure of profitability' },
    { term: 'ETF', definition: 'Exchange Traded Fund - tracks an index or sector' },
    { term: 'Bull Market', definition: 'Market trend characterized by rising prices' },
    { term: 'Bear Market', definition: 'Market trend characterized by falling prices' },
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newCards = [];
    financialTerms.forEach((item, index) => {
      newCards.push(
        { id: index * 2, type: 'term', content: item.term, pairId: index },
        { id: index * 2 + 1, type: 'definition', content: item.definition, pairId: index }
      );
    });
    setCards(shuffleArray(newCards));
    setMatchedPairs([]);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
    setShowConfetti(false);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (cardId) => {
    if (isChecking || flippedCards.includes(cardId) || matchedPairs.includes(cards[cardId].pairId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [firstCard, secondCard] = newFlippedCards.map(id => cards.find(card => card.id === id));
      
      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairs([...matchedPairs, firstCard.pairId]);
        setFlippedCards([]);
        setIsChecking(false);

        if (matchedPairs.length + 1 === financialTerms.length) {
          setGameComplete(true);
          setShowConfetti(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    return flippedCards.includes(cardId) || (card && matchedPairs.includes(card.pairId));
  };

  const getCardStatus = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    if (card && matchedPairs.includes(card.pairId)) {
      return 'matched';
    }
    if (flippedCards.includes(cardId)) {
      return 'flipped';
    }
    return 'hidden';
  };

  // Enhanced confetti effect
  const Confetti = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      if (!showConfetti) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const particles = [];
      const particleCount = 200;
      
      // Resize canvas to match parent
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Create different particle shapes
      const createParticle = () => {
        const size = Math.random() * 10 + 5;
        const type = Math.floor(Math.random() * 4); // 0: square, 1: circle, 2: triangle, 3: line
        
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: size,
          type: type,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: Math.random() * 0.1 - 0.05,
          color: `hsl(${Math.random() * 360}, 90%, 65%)`,
          velocity: {
            x: Math.random() * 6 - 3,
            y: Math.random() * 4 + 2
          },
          opacity: Math.random() * 0.5 + 0.5,
          fadeOut: 0.005 + Math.random() * 0.01
        };
      };
      
      // Generate initial particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
      
      // Draw particle based on type
      const drawParticle = (p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        
        switch(p.type) {
          case 0: // Square
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            break;
          case 1: // Circle
            ctx.beginPath();
            ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 2: // Triangle
            ctx.beginPath();
            ctx.moveTo(0, -p.size/2);
            ctx.lineTo(p.size/2, p.size/2);
            ctx.lineTo(-p.size/2, p.size/2);
            ctx.closePath();
            ctx.fill();
            break;
          case 3: // Line
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size / 3;
            ctx.beginPath();
            ctx.moveTo(-p.size, 0);
            ctx.lineTo(p.size, 0);
            ctx.stroke();
            break;
        }
        
        ctx.restore();
      };
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.rotation += p.rotationSpeed;
          p.opacity -= p.fadeOut;
          
          // Reset particle if it goes off screen or fades out
          if (p.y > canvas.height || p.opacity <= 0) {
            particles[index] = createParticle();
          }
          
          drawParticle(p);
        });
        
        requestAnimationFrame(animate);
      };
      
      const animationId = requestAnimationFrame(animate);
      
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [showConfetti]);
    
    return (
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    );
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6 shadow-xl text-white">
      {showConfetti && <Confetti />}
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Elegant Memory</h2>
        <p className="text-gray-400">Match financial terms with their definitions</p>
        <div className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-full shadow-lg">
          <span className="text-gray-300 font-medium">Moves: {moves}</span>
        </div>
        
        <div className="flex justify-center mt-4">
          <ParticleSystem 
            matchedPairs={matchedPairs.length} 
            totalPairs={financialTerms.length}
            gameComplete={gameComplete}
          />
        </div>
        
        {gameComplete && (
          <div className="my-6 p-6 bg-gradient-to-r from-indigo-800 to-purple-900 rounded-lg shadow-lg border border-indigo-500 border-opacity-50">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Congratulations!
            </h3>
            <p className="mt-2 text-lg text-gray-300">You completed the game in {moves} moves</p>
            <button 
              onClick={initializeGame}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 font-medium"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative aspect-video cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              isCardFlipped(card.id) ? 'rotate-y-180' : ''
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-3d-container w-full h-full relative preserve-3d">
              {/* Front of card */}
              <div className={`absolute w-full h-full rounded-lg backface-hidden 
              ${getCardStatus(card.id) === 'matched' ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-gradient-to-br from-indigo-500 to-purple-700'}
              ${isCardFlipped(card.id) ? 'opacity-0' : 'opacity-100'} 
              flex items-center justify-center shadow-lg border border-opacity-30 ${getCardStatus(card.id) === 'matched' ? 'border-emerald-300' : 'border-indigo-300'}`}>
                <div className="text-center">
                  <div className="text-3xl mb-2 font-bold">
                    {getCardStatus(card.id) === 'matched' ? '✓' : '?'}
                  </div>
                  <p className="text-sm font-medium">
                    {getCardStatus(card.id) === 'matched' ? 'Matched!' : 'Click to flip'}
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div className={`absolute w-full h-full rounded-lg backface-hidden bg-gradient-to-br from-gray-700 to-gray-900 
              ${isCardFlipped(card.id) ? 'opacity-100' : 'opacity-0'} 
              shadow-lg border border-gray-600 border-opacity-30`}>
                <div className="h-full flex flex-col p-4">
                  <div className="text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
                    {card.type === 'term' ? 'Term' : 'Definition'}
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className={`${card.type === 'term' ? 'text-lg font-semibold text-white' : 'text-sm text-gray-200'}`}>
                      {card.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .card-3d-container {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 .card-3d-container {
          transform: rotateY(180deg);
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(138, 75, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(138, 75, 255, 0.8); }
          100% { box-shadow: 0 0 5px rgba(138, 75, 255, 0.5); }
        }
        
        .animate-glow {
          animation: glow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default EnhancedMemoryGame;