'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGamepad,
  faBars, 
  faTimes,
  faMoneyBillTransfer,
  faSearch,
  faBell,
  faSignOutAlt,
  faCog,
  faChevronDown,
  faUserCircle,
  faMessage,
  faChartLine,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { logOut } from '@/lib/auth/logout/action';
import { searchContent, SearchResult } from '@/services/search';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Definicja typów
type NavLink = {
  name: string;
  path: string;
  icon: IconDefinition;
  label: string; // Dla dostępności
};

type NotificationType = {
  id: string;
  message: string;
  time: string;
  read: boolean;
};

type User = {
  name: string;
  email: string;
  avatar: string;
  role: string;
};

// Animacja - wariacje
const animations = {
  navbar: {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  },
  dropdown: {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 24 }
    }
  },
  mobileMenu: {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  navItem: {
    closed: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  },
  search: {
    closed: {
      width: '40px',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      width: '300px',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  mobileSearch: {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: { 
      opacity: 1,
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }
};

// Dane nawigacyjne
const navLinks: NavLink[] = [
  { name: 'Dashboard', path: '/dashboard', icon: faChartLine, label: 'Go to Dashboard' },
  { name: 'Games', path: '/games', icon: faGamepad, label: 'Browse Games' },
  { name: 'Leaderboard', path: '/leaderboard', icon: faTrophy, label: 'View Leaderboard' },
  { name: 'Chat', path: '/chat', icon: faMessage, label: 'Open Chat' },
  { name: 'Translator', path: '/translator', icon: faMoneyBillTransfer, label: 'Use Translator' }
];

// Przykładowy użytkownik
const defaultUser: User = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  avatar: '/api/placeholder/32/32',
  role: 'Premium User'
};

const FloatingNavbar: React.FC = () => {
  // Routing
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  
  // State dla UI
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  
  // Stan powiadomień
  const [notifications, setNotifications] = useState<NotificationType[]>([
    { id: '1', message: 'New message from Sarah', time: '2 min ago', read: false },
    { id: '2', message: 'Your order #46778 has shipped', time: '1 hour ago', read: false },
    { id: '3', message: 'Payment successful', time: '3 hours ago', read: true },
  ]);
  
  // Stan użytkownika - w produkcji powinien być pobierany z API/context
  const [user] = useState<User>(defaultUser);
  
  // Refs dla obsługi kliknięć poza elementami
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  
  // Transformacje animacji bazujące na scrollu
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navbarScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  
  // Liczba nieprzeczytanych powiadomień
  const unreadCount = notifications.filter(n => !n.read).length;

  // Obsługa widoczności paska nawigacyjnego podczas przewijania
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Przewijanie w dół - ukryj navbar
        setVisible(false);
      } else {
        // Przewijanie w górę - pokaż navbar
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Obsługa kliknięć poza dropdown'ami
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Obsługa dropdown użytkownika
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      
      // Obsługa dropdown powiadomień
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      
      // Obsługa wyszukiwarki (nie zamykaj jeśli jest wprowadzony tekst)
      const searchArea = document.querySelector('.search-area');
      if (isSearchActive && searchArea && !searchArea.contains(event.target as Node)) {
        if (!searchQuery.trim()) {
          setIsSearchActive(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchActive, searchQuery]);
  
  // Auto-focus na polu wyszukiwania
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    if (isMobileSearchActive && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isSearchActive, isMobileSearchActive]);
  
  // Zamykanie menu mobilnego przy zmianie strony
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Obsługa ESC key do zamykania dropdown'ów
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setNotificationsOpen(false);
        setIsSearchActive(false);
        if (isMobileSearchActive && !searchQuery) {
          setIsMobileSearchActive(false);
        }
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMobileSearchActive, searchQuery]);

  // Pomoc dla czytników ekranowych - ogłaszanie powiadomień
  useEffect(() => {
    // Tylko dla środowiska z obsługą czytników ekranowych
    if (typeof window !== 'undefined' && 'aria-live' in document.createElement('div')) {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length > 0) {
        // Utwórz element tylko dla czytników ekranowych
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = `You have ${unreadNotifications.length} unread notifications`;
        document.body.appendChild(announcer);
        
        // Usuń element po ogłoszeniu
        setTimeout(() => {
          document.body.removeChild(announcer);
        }, 1000);
      }
    }
  }, [notifications]);

  // Obsługa zamknięcia menu przy większym ekranie
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Funkcje obsługi
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    }
  }, [searchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const results = searchContent(value);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleSearch = useCallback(() => {
    if (!isSearchActive) {
      setIsSearchActive(true);
    } else if (!searchQuery.trim()) {
      setIsSearchActive(false);
      setShowResults(false);
    } else {
      handleSearch();
    }
  }, [isSearchActive, searchQuery, handleSearch]);

  const toggleMobileSearch = useCallback(() => {
    setIsMobileSearchActive(prev => !prev);
  }, []);

  const toggleUserDropdown = useCallback(() => {
    setUserDropdownOpen(prev => !prev);
    if (notificationsOpen) setNotificationsOpen(false);
  }, [notificationsOpen]);

  const toggleNotifications = useCallback(() => {
    setNotificationsOpen(prev => !prev);
    if (userDropdownOpen) setUserDropdownOpen(false);
  }, [userDropdownOpen]);

  const handleLogOut = useCallback(async () => {
    try {
      const resp = await logOut();
      if(resp?.message === "Logged out"){
        router.push("/login");
      } else {
        console.error("Logout failed:", resp);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  const clearSearch = useCallback(() => {
    setShowResults(false);
    setSearchQuery('');
    if (window.innerWidth >= 1024) {
      setIsSearchActive(false);
    } else {
      setIsMobileSearchActive(false);
    }
  }, []);

  return (
    <motion.header 
      className="fixed w-full z-50 top-0 left-0 px-4 sm:px-6 md:px-8 pt-4"
      variants={animations.navbar}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      aria-label="Main navigation"
    >
      <motion.nav 
        style={{ 
          opacity: navbarOpacity, 
          scale: navbarScale
        }}
        className="bg-gray-800 text-gray-100 border border-gray-600 backdrop-filter backdrop-blur-lg px-4 sm:px-6 py-3 transition-all duration-300 ease-in-out shadow-2xl rounded-xl max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1" aria-label="TaxMaster Dashboard">
            <motion.div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600">
              <span className="font-bold text-xl text-white">D</span>
            </motion.div>
            <motion.span 
              className="font-bold text-xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              TaxMaster
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main menu">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                passHref
                aria-label={link.label}
                aria-current={pathname === link.path ? 'page' : undefined}
              >
                <motion.div
                  className={`relative flex items-center space-x-1 ${
                    pathname === link.path ? 'text-indigo-400' : 'text-gray-300 hover:text-gray-100'
                  } transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={link.icon} className="h-4 w-4" aria-hidden="true" />
                  <span>{link.name}</span>
                  {pathname === link.path && (
                    <motion.div 
                      className="absolute -bottom-2 left-0 h-0.5 w-full bg-indigo-400"
                      layoutId="navbar-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search - Desktop version */}
            <motion.div className="relative z-50 hidden lg:flex items-center search-area">
              <motion.div
                className="relative flex items-center justify-end"
                initial="closed"
                animate={isSearchActive ? "open" : "closed"}
                variants={animations.search}
              >
                {isSearchActive && (
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search..."
                    className="w-full pr-8 pl-3 py-2 rounded-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search site content"
                    aria-expanded={showResults}
                    role="combobox"
                    aria-controls="search-results"
                    aria-autocomplete="list"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                )}
                <motion.button 
                  className="absolute right-0 p-2 hover:bg-gray-700 rounded-full"
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSearch}
                  aria-label={isSearchActive ? "Search" : "Open search"}
                >
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="h-4 w-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200" 
                    aria-hidden="true"
                  />
                </motion.button>
                
                {/* Desktop Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div 
                      className="absolute top-full left-0 right-0 mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      id="search-results"
                      role="listbox"
                    >
                      {searchResults.length > 0 ? (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                          <div className="max-h-96 overflow-y-auto">
                            {searchResults.map((result, index) => (
                              <Link
                                key={index}
                                href={result.path}
                                className="block p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0 focus:outline-none focus:bg-gray-700 focus:text-indigo-300"
                                onClick={clearSearch}
                                role="option"
                                aria-selected="false"
                              >
                                <h4 className="text-indigo-400 font-semibold mb-1">{result.title}</h4>
                                <p className="text-sm text-gray-300">{result.excerpt}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : searchQuery.trim().length >= 2 && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 text-center text-gray-400" role="status">
                          No results found
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
            
            {/* Search - Mobile version (icon only) */}
            <motion.button 
              className="lg:hidden p-2 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileSearch}
              aria-label={isMobileSearchActive ? "Close search" : "Open search"}
              aria-expanded={isMobileSearchActive}
              aria-controls="mobile-search"
            >
              <FontAwesomeIcon 
                icon={faSearch} 
                className="h-4 w-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200" 
                aria-hidden="true"
              />
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-700 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={toggleNotifications}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                aria-haspopup="true"
                aria-expanded={notificationsOpen}
              >
                <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-gray-300" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" 
                    aria-hidden="true">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10"
                    variants={animations.dropdown}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    role="dialog"
                    aria-label="Notifications"
                  >
                    <div className="p-3 border-b border-gray-600 flex justify-between items-center">
                      <h3 className="font-medium" id="notifications-title">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:underline"
                          aria-label="Mark all notifications as read"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" role="list" aria-labelledby="notifications-title">
                      {notifications.length === 0 ? (
                        <div className="py-4 text-center text-gray-400" role="status">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div 
                            key={notification.id}
                            className={`p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 ${
                              !notification.read ? 'bg-gray-700/50' : ''
                            }`}
                            whileHover={{ x: 3 }}
                            onClick={() => markAsRead(notification.id)}
                            role="listitem"
                            aria-label={`${notification.read ? 'Read' : 'Unread'} notification: ${notification.message}`}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                markAsRead(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1" aria-hidden="true"></span>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    
                    <Link href="/notifications" passHref>
                      <div className="p-2 text-center text-sm text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:underline border-t border-gray-600" tabIndex={0}>
                        View all notifications
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="relative" ref={userDropdownRef}>
              <motion.button
                className="flex items-center space-x-2 rounded-lg py-1 px-2 hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={toggleUserDropdown}
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
              >
                <img 
                  src={user.avatar} 
                  alt={`${user.name}'s avatar`}
                  className="w-8 h-8 rounded-full border-2 border-indigo-500"
                />
                <span className="hidden sm:block font-medium text-sm">{user.name}</span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`} 
                  aria-hidden="true"
                />
              </motion.button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10"
                    variants={animations.dropdown}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    role="dialog"
                    aria-label="User menu"
                  >
                    <div className="p-4 border-b border-gray-600 flex flex-col items-center">
                      <img 
                        src={user.avatar} 
                        alt={`${user.name}'s avatar`}
                        className="w-16 h-16 rounded-full border-2 border-indigo-500 mb-2" 
                      />
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <div className="mt-2 px-2 py-1 bg-indigo-900/50 rounded-full text-xs text-indigo-300">
                        {user.role}
                      </div>
                    </div>

                    <div role="menu">
                      <Link href="/profile" passHref>
                        <div className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer focus:outline-none focus:bg-gray-700" role="menuitem" tabIndex={0}>
                          <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4 text-gray-400 mr-3" aria-hidden="true"/>
                          <span className="text-sm">Profile</span>
                        </div>
                      </Link>
                      <Link href="/settings" passHref>
                        <div className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer focus:outline-none focus:bg-gray-700" role="menuitem" tabIndex={0}>
                          <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-gray-400 mr-3" aria-hidden="true"/>
                          <span className="text-sm">Settings</span>
                        </div>
                      </Link>
                      <div className="border-t border-gray-600 mt-1">
                        <div
                          onClick={handleLogOut}
                          className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400 hover:text-red-300 focus:outline-none focus:bg-gray-700"
                          role="menuitem"
                          tabIndex={0}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-3" aria-hidden="true"/>
                          <span className="text-sm">Sign out</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => setIsOpen(!isOpen)}
              className="block lg:hidden p-1"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <FontAwesomeIcon 
                icon={isOpen ? faTimes : faBars} 
                className="h-5 w-5" 
                aria-hidden="true"
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearchActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full mt-4"
              id="mobile-search"
            >
              <div className="relative search-area">
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search site content"
                  aria-expanded={showResults}
                  role="combobox"
                  aria-controls="mobile-search-results"
                  aria-autocomplete="list"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={handleSearch}
                  aria-label="Search"
                >
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="h-4 w-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200" 
                    aria-hidden="true"
                  />
                </button>
                {showResults && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
                    id="mobile-search-results"
                    role="listbox"
                  >
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                          <Link
                            key={index}
                            href={result.path}
                            className="block p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0 focus:outline-none focus:bg-gray-700 focus:text-indigo-300"
                            onClick={clearSearch}
                            role="option"
                            aria-selected="false"
                          >
                            <h4 className="text-indigo-400 font-semibold mb-1">{result.title}</h4>
                            <p className="text-sm text-gray-300">{result.excerpt}</p>
                          </Link>
                        ))
                      ) : searchQuery.trim().length >= 2 && (
                        <div className="p-4 text-center text-gray-400" role="status">
                          No results found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden mt-3 bg-gray-800 rounded-lg"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile menu"
            >
              <div className="px-4 py-2 space-y-2">
                <div className="flex items-center px-3 py-3 border-b border-gray-700">
                  <img 
                    src={user.avatar} 
                    alt={`${user.name}'s avatar`}
                    className="w-10 h-10 rounded-full border-2 border-indigo-500 mr-3" 
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path} 
                    passHref 
                    aria-label={link.label}
                    aria-current={pathname === link.path ? 'page' : undefined}
                  >
                    <div
                      className={`
                        flex items-center space-x-3 py-2 px-3 rounded-lg
                        ${pathname === link.path ? 'bg-gray-700 text-indigo-400' : ''}
                        hover:bg-gray-700
                        transition-colors duration-200
                        focus:outline-none focus:bg-gray-700
                      `}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <FontAwesomeIcon icon={link.icon} className="h-5 w-5" aria-hidden="true" />
                      <span>{link.name}</span>
                    </div>
                  </Link>
                ))}
                
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <Link href="/profile" passHref>
                    <div 
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:bg-gray-700"
                      role="menuitem"
                      tabIndex={0}
                    >
                      <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" aria-hidden="true" />
                      <span>Profile</span>
                    </div>
                  </Link>
                  
                  <Link href="/settings" passHref>
                    <div 
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:bg-gray-700"
                      role="menuitem"
                      tabIndex={0}
                    >
                      <FontAwesomeIcon icon={faCog} className="h-5 w-5" aria-hidden="true" />
                      <span>Settings</span>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={handleLogOut}
                    className="w-full text-left"
                  >
                    <div 
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 text-red-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700"
                      role="menuitem"
                      tabIndex={0}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" aria-hidden="true" />
                      <span>Sign out</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
};

export default FloatingNavbar;