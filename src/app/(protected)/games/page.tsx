'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import QuizGame from '@/components/games/QuizGame';
import MemoryGame from '@/components/games/MemoryGame';
import TradingSimulator from '@/components/games/TradingSimulator';
import DailyChallenge from '@/components/games/DailyChallenge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faTrophy, faChartLine, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as THREE from 'three';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: IconDefinition;
  component: React.ReactNode;
}

// Component for the 3D background animation
const ThreeJSBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const symbolsRef = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1c1c28, 0.035);
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create financial symbols
    const symbolGeometries = [
      new THREE.TorusKnotGeometry(2, 0.6, 100, 16),
      new THREE.OctahedronGeometry(2),
      new THREE.TetrahedronGeometry(2),
      new THREE.IcosahedronGeometry(2)
    ];
    
    const createSymbol = (geometry, color, position) => {
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.2,
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        wireframe: Math.random() > 0.5
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: 0.005 + Math.random() * 0.01,
        floatDistance: 0.5 + Math.random() * 1,
        originalY: position[1],
        floatOffset: Math.random() * Math.PI * 2
      };
      
      return mesh;
    };
    
    // Create multiple symbols
    const symbols = [];
    const colors = [0x4c6ef5, 0x7048e8, 0x7950f2, 0x8c4cd6, 0xa94cbb];
    
    for (let i = 0; i < 15; i++) {
      const geometry = symbolGeometries[Math.floor(Math.random() * symbolGeometries.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const position = [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40 - 10
      ];
      
      const symbol = createSymbol(geometry, color, position);
      scene.add(symbol);
      symbols.push(symbol);
    }
    
    symbolsRef.current = symbols;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x7048e8, 1, 50);
    pointLight1.position.set(10, 15, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4c6ef5, 1, 50);
    pointLight2.position.set(-10, -15, 10);
    scene.add(pointLight2);
    
    // Add starfield
    const stars = new THREE.BufferGeometry();
    const starPositions = [];
    
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      
      starPositions.push(x, y, z);
    }
    
    stars.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.8
    });
    
    const starField = new THREE.Points(stars, starMaterial);
    scene.add(starField);
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate camera slightly based on mouse position
      camera.position.x += (mousePosition.current.x * 5 - camera.position.x) * 0.01;
      camera.position.y += (-mousePosition.current.y * 5 - camera.position.y) * 0.01;
      camera.lookAt(scene.position);
      
      // Animate symbols
      symbols.forEach(symbol => {
        // Rotate
        symbol.rotation.x += symbol.userData.rotationSpeed.x;
        symbol.rotation.y += symbol.userData.rotationSpeed.y;
        symbol.rotation.z += symbol.userData.rotationSpeed.z;
        
        // Float up and down
        const time = Date.now() * 0.001;
        symbol.position.y = symbol.userData.originalY + 
                          Math.sin(time * symbol.userData.floatSpeed + symbol.userData.floatOffset) * 
                          symbol.userData.floatDistance;
      });
      
      // Rotate starfield slowly
      starField.rotation.y += 0.0001;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      symbols.forEach(symbol => {
        symbol.geometry.dispose();
        symbol.material.dispose();
      });
      
      stars.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

// 3D model that can be used for the game selection
const GameModel = ({ selectedGame, onSelect }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1c1c28);
    sceneRef.current = scene;
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(200, 200);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create model based on game
    let geometry;
    let material;
    
    switch (selectedGame) {
      case 'quiz':
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x7048e8,
          shininess: 100,
          emissive: 0x7048e8,
          emissiveIntensity: 0.3
        });
        break;
      case 'memory':
        geometry = new THREE.OctahedronGeometry(1);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x4c6ef5,
          shininess: 100,
          emissive: 0x4c6ef5,
          emissiveIntensity: 0.3
        });
        break;
      case 'trading':
        geometry = new THREE.ConeGeometry(1, 2, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x7950f2,
          shininess: 100,
          emissive: 0x7950f2,
          emissiveIntensity: 0.3
        });
        break;
      case 'challenge':
        geometry = new THREE.IcosahedronGeometry(1);
        material = new THREE.MeshPhongMaterial({ 
          color: 0xa94cbb,
          shininess: 100,
          emissive: 0xa94cbb,
          emissiveIntensity: 0.3
        });
        break;
      default:
        geometry = new THREE.SphereGeometry(1, 32, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x7048e8,
          shininess: 100,
          emissive: 0x7048e8,
          emissiveIntensity: 0.3
        });
    }
    
    const model = new THREE.Mesh(geometry, material);
    scene.add(model);
    modelRef.current = model;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (model) {
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      renderer.dispose();
    };
  }, [selectedGame]);
  
  return (
    <div 
      ref={mountRef} 
      className="h-50 w-50 cursor-pointer"
      onClick={() => onSelect(selectedGame)}
    />
  );
};

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoverGame, setHoverGame] = useState<string | null>(null);

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

  // Particle explosion effect when selecting a game
  const triggerParticleExplosion = () => {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'absolute z-50 pointer-events-none';
    particleContainer.style.top = '50%';
    particleContainer.style.left = '50%';
    document.body.appendChild(particleContainer);
    
    const colors = ['#4c6ef5', '#7048e8', '#7950f2', '#8c4cd6', '#a94cbb'];
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.transform = 'translate(-50%, -50%)';
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      const size = 5 + Math.random() * 10;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      const animation = particle.animate(
        [
          { 
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1 
          },
          { 
            transform: `translate(${Math.cos(angle) * speed * 100}px, ${Math.sin(angle) * speed * 100}px) scale(0)`,
            opacity: 0 
          }
        ],
        {
          duration: 500 + Math.random() * 1000,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        }
      );
      
      particleContainer.appendChild(particle);
      
      animation.onfinish = () => {
        particle.remove();
        if (particleContainer.childNodes.length === 0) {
          particleContainer.remove();
        }
      };
    }
  };

  const handleGameSelect = (gameId) => {
    triggerParticleExplosion();
    setSelectedGame(gameId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      <ThreeJSBackground />
      
      <div className="w-full max-w-6xl z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-5 sm:p-8 space-y-6 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-600"
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              <motion.span
                initial={{ y: 0 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                className="inline-block"
              >
                Learning
              </motion.span>{" "}
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                className="inline-block text-indigo-400"
              >
                Games
              </motion.span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">Choose a game to enhance your financial knowledge</p>
          </motion.div>

          {!selectedGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition-all duration-300"
                  onClick={() => handleGameSelect(game.id)}
                  onMouseEnter={() => setHoverGame(game.id)}
                  onMouseLeave={() => setHoverGame(null)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden group">
                      {hoverGame === game.id ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <GameModel selectedGame={game.id} onSelect={handleGameSelect} />
                        </div>
                      ) : (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        >
                          <FontAwesomeIcon icon={game.icon} className="text-xl text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">
                        <motion.span
                          initial={{ backgroundPosition: "0% 0%" }}
                          animate={{ backgroundPosition: "100% 0%" }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                          style={{
                            backgroundSize: "200% auto",
                            backgroundImage: "linear-gradient(45deg, #4c6ef5, #7048e8, #7950f2, #4c6ef5)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: hoverGame === game.id ? "transparent" : "inherit",
                            display: "inline-block"
                          }}
                        >
                          {game.title}
                        </motion.span>
                      </h3>
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
                className="mb-4 text-gray-400 hover:text-gray-200 transition-colors flex items-center"
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [-3, 0, -3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ←
                </motion.span> Back to Games
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGame}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {games.find(game => game.id === selectedGame)?.component}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Glowing orbs floating around */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500/20 blur-2xl"
            style={{
              width: 100 + Math.random() * 200,
              height: 100 + Math.random() * 200,
            }}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.2 + Math.random() * 0.3
            }}
            animate={{ 
              x: [
                Math.random() * window.innerWidth, 
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GamesPage;