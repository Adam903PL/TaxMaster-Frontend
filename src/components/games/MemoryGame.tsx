'use client';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Main component for the animated particle system forming text
const MorphingParticleSystem = ({ matchedPairs, totalPairs, gameComplete }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const frameIdRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const targetPositionsRef = useRef(null);
  const initialPositionsRef = useRef(null);
  const wordRef = useRef(null);

  // Words that can be formed by particles
  const possibleWords = ["TechniSchools", "CodeCamp"];
  
  useEffect(() => {
    // Clean up existing renderer to prevent duplicates
    if (rendererRef.current && mountRef.current?.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }
    
    // Only select a random word on first render
    if (!wordRef.current) {
      wordRef.current = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    }
    
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    // Set up camera - increased field of view for larger text display
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    camera.position.z = 50; // Moved further back to see the larger text

    // Set up renderer with proper sizing
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 400); // Increased size
    rendererRef.current = renderer;
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create particles
    const particleCount = 800; // More particles for better text formation
    const particles = new THREE.Group();
    particlesRef.current = particles;
    
    // Create particle geometry
    const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    
    // Initialize arrays
    const initialPositions = [];
    const targetPositions = [];
    
    // Generate text points for the chosen word
    generateTextPoints(wordRef.current, targetPositions, particleCount);
    
    // Create particles with different colors
    for (let i = 0; i < particleCount; i++) {
      const hue = (i / particleCount) * 360;
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(`hsl(${hue}, 80%, 60%)`),
        transparent: true,
        opacity: 0.8
      });
      
      const particle = new THREE.Mesh(particleGeometry, material);
      
      // Initial position - in a sphere
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      const initialX = 15 * Math.cos(theta) * Math.sin(phi);
      const initialY = 15 * Math.sin(theta) * Math.sin(phi);
      const initialZ = 15 * Math.cos(phi);
      
      particle.position.set(initialX, initialY, initialZ);
      initialPositions.push(new THREE.Vector3(initialX, initialY, initialZ));
      
      // Save original position for animation
      particle.userData = {
        initialPosition: new THREE.Vector3(initialX, initialY, initialZ),
        targetPosition: targetPositions[i] || new THREE.Vector3(0, 0, 0),
        speed: Math.random() * 0.01 + 0.005,
        amplitude: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        transitionSpeed: Math.random() * 0.003 + 0.001
      };
      
      particles.add(particle);
    }
    
    initialPositionsRef.current = initialPositions;
    targetPositionsRef.current = targetPositions;
    scene.add(particles);

    // Animation
    const animate = () => {
      const progress = matchedPairs / totalPairs;
      const time = Date.now() * 0.001;
      
      // Rotate particle system gently
      particles.rotation.y += 0.01;
      
      // Animate each particle
      particles.children.forEach((particle, index) => {
        const { initialPosition, targetPosition, speed, amplitude, phase } = particle.userData;
        
        // Calculate morphing factor based on game progress
        // As more pairs are matched, particles move more toward their target positions
        let morphFactor = gameComplete ? 1 : Math.min(progress * 1.5, 0.95);
        
        // Add some oscillation to incomplete particles
        const pulseAmount = gameComplete ? 
          Math.sin(time * 2 + index) * 0.1 : 
          Math.sin(time * speed + phase) * amplitude * (1 - morphFactor);
        
        // Interpolate between initial and target position
        const newPosition = new THREE.Vector3();
        newPosition.lerpVectors(initialPosition, targetPosition, morphFactor);
        
        // Add some random oscillation for particles not yet in final position
        if (!gameComplete) {
          const randomOffset = new THREE.Vector3(
            Math.sin(time * speed + phase) * (1 - morphFactor) * 0.5,
            Math.cos(time * speed + phase * 2) * (1 - morphFactor) * 0.5,
            Math.sin(time * speed * 1.5 + phase * 3) * (1 - morphFactor) * 0.5
          );
          newPosition.add(randomOffset);
        }
        
        particle.position.copy(newPosition);
        
        // Make particles more vibrant with progress
        if (particle.material) {
          const hue = (index / particles.children.length) * 360;
          const saturation = 80 + (progress * 20);
          const lightness = 50 + (progress * 20);
          particle.material.color.set(new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`));
          
          // Make particles pulse brighter when game is complete
          if (gameComplete) {
            const pulseBrightness = Math.sin(time * 3 + index) * 0.3 + 0.7;
            particle.material.opacity = 0.7 + pulseBrightness * 0.3;
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
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [matchedPairs, totalPairs, gameComplete]);

  // Function to generate points arranged in the shape of text - larger text
  const generateTextPoints = (text, targetPositions, particleCount) => {
    // Create a canvas to draw text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = 1000; // Increased for larger text resolution
    const height = 300;  // Increased for larger text resolution
    canvas.width = width;
    canvas.height = height;
    
    // Draw text on canvas - much larger font
    context.fillStyle = 'white';
    context.font = 'bold 180px Arial'; // Much larger font
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, width / 2, height / 2);
    
    // Get image data
    const imageData = context.getImageData(0, 0, width, height).data;
    
    // Collect points where the text is drawn
    const textPoints = [];
    const sampleStep = 2; // Smaller step for more detailed sampling
    
    for (let i = 0; i < width; i += sampleStep) {
      for (let j = 0; j < height; j += sampleStep) {
        const pixelIndex = (j * width + i) * 4;
        // If pixel is not transparent (part of the text)
        if (imageData[pixelIndex + 3] > 0) {
          // Convert canvas coordinates to 3D space - increased scale
          const x = (i - width / 2) / 12; // Scale for larger text in 3D space
          const y = -(j - height / 2) / 14; // Flip Y as canvas Y increases downward
          textPoints.push(new THREE.Vector3(x, y, 0));
        }
      }
    }
    
    // If we have more particles than text points, duplicate some points
    while (textPoints.length < particleCount) {
      const randomIndex = Math.floor(Math.random() * textPoints.length);
      textPoints.push(textPoints[randomIndex].clone());
    }
    
    // If we have more text points than particles, select a subset
    if (textPoints.length > particleCount) {
      // Shuffle and take the first particleCount elements
      for (let i = textPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [textPoints[i], textPoints[j]] = [textPoints[j], textPoints[i]];
      }
      textPoints.length = particleCount;
    }
    
    // Add some random Z-depth to make it more 3D
    textPoints.forEach(point => {
      point.z = (Math.random() - 0.5) * 3; // Increased depth
      targetPositions.push(point);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={mountRef} className="mx-auto mb-2 rounded-lg overflow-hidden shadow-lg" style={{ zIndex: 1 }}></div>
      <div className="text-blue-300 text-2xl font-bold mt-2">
        Forming: {wordRef.current}
      </div>
      <div className="text-gray-400 text-lg">
        {gameComplete ? "Complete!" : `Progress: ${Math.round((matchedPairs / totalPairs) * 100)}%`}
      </div>
    </div>
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
  const [showAnimation, setShowAnimation] = useState(true); // Control visibility of animation
  const [gameStarted, setGameStarted] = useState(false);

  // Extended financial terms for more matching pairs
  const financialTerms = [
    { term: 'Compound Interest', definition: 'Interest earned on both the principal and accumulated interest' },
    { term: 'Dividend', definition: 'A portion of a company\'s profits paid to shareholders' },
    { term: 'ROI', definition: 'Return on Investment - measure of profitability' },
    { term: 'ETF', definition: 'Exchange Traded Fund - tracks an index or sector' },
    // { term: 'Bull Market', definition: 'Market trend characterized by rising prices' },
    // { term: 'Bear Market', definition: 'Market trend characterized by falling prices' },
    // { term: 'P/E Ratio', definition: 'Price-to-Earnings Ratio - company valuation metric' },
    // { term: 'Liquidity', definition: 'Ease of converting an asset to cash without affecting its price' },
  ];

  useEffect(() => {
    initializeGame();
    
    // Add necessary CSS for card flipping
    const style = document.createElement('style');
    style.innerHTML = `
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .transform-style-preserve-3d {
        transform-style: preserve-3d;
      }
      
      .backface-hidden {
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
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
    if (!gameStarted) setGameStarted(true);
    
    // Fix for clickable cards issue
    const card = cards.find(c => c.id === cardId);
    if (!card || isChecking || flippedCards.includes(cardId) || matchedPairs.includes(card.pairId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const firstCardId = newFlippedCards[0];
      const secondCardId = newFlippedCards[1];
      
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);
      
      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        const newMatchedPairs = [...matchedPairs, firstCard.pairId];
        setMatchedPairs(newMatchedPairs);
        setFlippedCards([]);
        setIsChecking(false);

        if (newMatchedPairs.length === financialTerms.length) {
          setGameComplete(true);
          setShowConfetti(true);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // Check if card is flipped
  const isCardFlipped = (cardId) => {
    return flippedCards.includes(cardId);
  };
  
  // Check if card is matched
  const isCardMatched = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    return card && matchedPairs.includes(card.pairId);
  };

  // Enhanced confetti effect
  const Confetti = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      if (!showConfetti || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const particles = [];
      const particleCount = 200;
      
      // Resize canvas to match parent
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Create different particle shapes
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 10 + 5;
        const type = Math.floor(Math.random() * 4); // 0: square, 1: circle, 2: triangle, 3: line
        
        particles.push({
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
        });
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
            ctx.lineWidth = p.size / 4;
            ctx.strokeStyle = p.color;
            ctx.beginPath();
            ctx.moveTo(-p.size, 0);
            ctx.lineTo(p.size, 0);
            ctx.stroke();
            break;
        }
        
        ctx.restore();
      };
      
      let animationId;
      
      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let particlesAlive = false;
        
        particles.forEach((p) => {
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.rotation += p.rotationSpeed;
          p.opacity -= p.fadeOut;
          
          if (p.y > canvas.height + p.size || p.opacity <= 0) {
            // Reset particle to top when it goes out of view
            if (Math.random() < 0.3 && showConfetti) {
              p.x = Math.random() * canvas.width;
              p.y = -p.size;
              p.opacity = Math.random() * 0.5 + 0.5;
              particlesAlive = true;
            }
          } else {
            particlesAlive = true;
            drawParticle(p);
          }
        });
        
        if (particlesAlive) {
          animationId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationId);
        }
      };
      
      animate();
      
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [showConfetti]);
    
    return (
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
    );
  };

  // Toggle animation visibility button
  const toggleAnimation = () => {
    setShowAnimation(!showAnimation);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Financial Terms Memory Game</h1>
      
      {/* Add toggle button for particle animation */}
      <div className="flex justify-center mb-4">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={toggleAnimation}
        >
          {showAnimation ? "Hide Particle Animation" : "Show Particle Animation"}
        </button>
        <button 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-4"
          onClick={initializeGame}
        >
          Restart Game
        </button>
      </div>
      
      {/* Game stats */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 px-6 py-3 rounded-lg shadow-lg">
          <p className="text-xl">Moves: {moves}</p>
          <p className="text-xl">Pairs: {matchedPairs.length} / {financialTerms.length}</p>
        </div>
      </div>
      
      {/* Only show animation when enabled */}
      {showAnimation && (
        <div className="mb-8">
          <MorphingParticleSystem 
            matchedPairs={matchedPairs.length} 
            totalPairs={financialTerms.length} 
            gameComplete={gameComplete} 
          />
        </div>
      )}
      
      {/* Memory card grid - Completely redesigned card display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {cards.map((card) => {
          // Determine if the card is flipped or matched
          const isFlipped = isCardFlipped(card.id);
          const isMatched = isCardMatched(card.id);
          const isRevealed = isFlipped || isMatched;
          
          return (
            <div 
              key={card.id}
              className="h-40 perspective-1000"
              onClick={() => handleCardClick(card.id)}
            >
              <div className={`
                relative w-full h-full transition-transform duration-500 ease-in-out
                transform-style-preserve-3d ${isRevealed ? 'rotate-y-180' : ''}
              `}>
                {/* Card front - question mark side */}
                <div className={`
                  absolute w-full h-full rounded-lg 
                  bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700
                  flex items-center justify-center
                  shadow-lg cursor-pointer backface-hidden
                `}>
                  <span className="text-4xl font-bold text-white">?</span>
                </div>
                
                {/* Card back - content side */}
                <div className={`
                  absolute w-full h-full rounded-lg p-4
                  ${isMatched ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'}
                  flex items-center justify-center
                  shadow-lg cursor-pointer backface-hidden rotate-y-180
                `}>
                  <p className="font-medium text-white text-center">
                    {card.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showConfetti && <Confetti />}
      
      {gameComplete && (
        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-green-400">Congratulations!</h2>
          <p className="text-xl mt-2">You completed the game in {moves} moves!</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedMemoryGame;