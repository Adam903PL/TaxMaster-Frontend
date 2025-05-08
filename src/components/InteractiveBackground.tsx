'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.z = 5;


















    
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particle system for stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true
    });
    
    const starsCount = 1500;
    const starsPositions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPositions[i] = (Math.random() - 0.5) * 20;
      starsPositions[i + 1] = (Math.random() - 0.5) * 20;
      starsPositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create the interactive 3D object (a custom shape)
    const interactiveGroup = new THREE.Group();
    scene.add(interactiveGroup);
    
    // Create a geometric crystal shape
    const crystalGeometry = new THREE.IcosahedronGeometry(1, 0);
    const crystalMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      emissive: 0x2a0087,
      emissiveIntensity: 0.5,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.8,
      wireframe: false
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    
    // Add outer glow
    const glowGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const glowMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      emissive: 0x4338ca,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    interactiveGroup.add(crystal);
    interactiveGroup.add(glow);
    
    // Add inner particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true
    });
    
    const particlesCount = 100;
    const particlesPositions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlesPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlesPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlesPositions[i + 2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    interactiveGroup.add(particles);
    
    // Add orbiting rings
    const ring1Geometry = new THREE.TorusGeometry(1.5, 0.02, 16, 100);
    const ring1Material = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 2;
    
    const ring2Geometry = new THREE.TorusGeometry(1.8, 0.01, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.4
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 4;
    
    interactiveGroup.add(ring1);
    interactiveGroup.add(ring2);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const light1 = new THREE.PointLight(0x6366f1, 2, 50);
    light1.position.set(2, 2, 2);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0x4338ca, 1, 50);
    light2.position.set(-2, -2, -2);
    scene.add(light2);
    
    // Position the interactive object
    interactiveGroup.position.x = 0;
    interactiveGroup.position.y = 0;
    interactiveGroup.position.z = 0;
    interactiveGroup.scale.set(0.8, 0.8, 0.8);
    
    // Event listeners
    const handleResize = () => {
      checkMobile();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const handleMouseMove = (e) => {
      if (isMobile) return;
      
      // Calculate normalized mouse position
      const newMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const newMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({
        x: newMouseX,
        y: newMouseY
      });
    };
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Touch events for mobile
    const handleTouchMove = (e) => {
      if (!isMobile) return;
      
      const touch = e.touches[0];
      const newMouseX = (touch.clientX / window.innerWidth) * 2 - 1;
      const newMouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({
        x: newMouseX,
        y: newMouseY
      });
    };
    
    window.addEventListener('touchmove', handleTouchMove);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate stars slowly
      stars.rotation.y = elapsedTime * 0.05;
      
      // Interactive rotation based on mouse position
      const targetRotationX = mousePosition.y * 0.5;
      const targetRotationY = mousePosition.x * 0.5;
      
      interactiveGroup.rotation.x += (targetRotationX - interactiveGroup.rotation.x) * 0.05;
      interactiveGroup.rotation.y += (targetRotationY - interactiveGroup.rotation.y) * 0.05;
      
      // Pulse effect
      const scale = 0.8 + Math.sin(elapsedTime ** 2) * 0.03;
      interactiveGroup.scale.set(scale, scale, scale);
      
      // Ring animation
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.1;
      
      // Crystal rotation
      crystal.rotation.y = elapsedTime * 0.1;
      glow.rotation.y = -elapsedTime * 0.05;
      
      // Scroll effect - move crystal slightly down when scrolling
      const scrollEffect = scrollPosition * 0.001;
      interactiveGroup.position.y = -scrollEffect;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
      
      // Dispose resources
      starsGeometry.dispose();
      starsMaterial.dispose();
      crystalGeometry.dispose();
      crystalMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      ring1Geometry.dispose();
      ring1Material.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      renderer.dispose();
    };
  }, [isMobile]);
  
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {/* Three.js container */}
      <div ref={containerRef} className="absolute inset-0"></div>
      
      {/* Additional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 opacity-70"></div>
      
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`
        }}
      ></div>
    </div>
  );
}