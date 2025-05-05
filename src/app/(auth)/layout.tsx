'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Sprawdzanie, czy urządzenie jest mobilne
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Obsługa ruchu myszy dla efektu paralaksy
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    // Obsługa przewijania dla efektów scrollowania
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
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Animowane tło */}
      <div className="fixed inset-0 z-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 opacity-80"></div>
        
        {/* Animated circles */}
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
        
        {/* Animowane linie/siatka */}
        <div className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}>
        </div>
        
        {/* Animowane gwiazdki - punkciki */}
        <div className="stars absolute inset-0"></div>
      </div>

      {/* Header z nawigacją */}
      <header className="w-full py-4 px-6 backdrop-blur-md bg-gray-900/70 z-10 border-b border-gray-800">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white flex items-center">
            <span className="text-indigo-400 mr-1">Dev</span>Portal
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
            <Link href="/projects" className="text-gray-300 hover:text-white transition">Projects</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm px-4 py-2 rounded-md bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white transition duration-300">
              Login
            </Link>
            <Link href="/register" className="text-sm px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
              Register
            </Link>
            
            {/* Mobilne menu burger */}
            <button className="md:hidden text-gray-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 backdrop-blur-md bg-gray-900/70 border-t border-gray-800 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                We provide cutting-edge solutions for modern web development, focusing on performance and user experience.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="text-gray-400 hover:text-indigo-400 transition">Documentation</Link></li>
                <li><Link href="/tutorials" className="text-gray-400 hover:text-indigo-400 transition">Tutorials</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-indigo-400 transition">API Reference</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-400 hover:text-indigo-400 transition">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-indigo-400 transition">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-indigo-400 transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400 text-center">
            <p>&copy; {new Date().getFullYear()} DevPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Style dla animacji */}
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
    </div>
  );
}