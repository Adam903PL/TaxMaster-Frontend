'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGamepad,
  faBars, 
  faTimes,
  faShoppingCart,
  faSearch,
  faBell,
  faSignOutAlt,
  faCog,
  faChevronDown,
  faUserCircle,
  faClipboardList,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { logOut } from '@/lib/auth/logout/action';
import { useRouter } from "next/navigation";
import { searchContent, SearchResult } from '@/services/search';

// Define types
type NavLink = {
  name: string;
  path: string;
  icon: any; // FontAwesome icon type
};

type NotificationType = {
  id: string;
  message: string;
  time: string;
  read: boolean;
};

const FloatingNavbar: React.FC = () => {
  // State
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
  const [notifications, setNotifications] = useState<NotificationType[]>([
    { id: '1', message: 'New message from Sarah', time: '2 min ago', read: false },
    { id: '2', message: 'Your order #46778 has shipped', time: '1 hour ago', read: false },
    { id: '3', message: 'Payment successful', time: '3 hours ago', read: true },
  ]);
  
  const router = useRouter()
  // Refs for dropdown clickaway handling
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const pathname = usePathname();
  const { scrollY } = useScroll();
  
  // Mock user data
  const user = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: '/api/placeholder/32/32', // Placeholder avatar
    role: 'Premium User'
  };
  
  // Transform properties based on scroll
  const navbarOpacity = useTransform(
    scrollY, 
    [0, 100], 
    [1, 0.95]
  );
  

  const navbarScale = useTransform(
    scrollY, 
    [0, 100], 
    [1, 0.98]
  );

  const logoRotate = useTransform(
    scrollY,
    [0, 200],
    [0, 360]
  );

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle clicks outside the dropdowns and search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      // Don't close search if clicking inside the search area
      const searchArea = document.querySelector('.search-area');
      if (isSearchActive && searchArea && !searchArea.contains(event.target as Node)) {
        if (!searchQuery) {
          setIsSearchActive(false);
        }
      }
      // For mobile search, we'll keep it open until explicitly closed by clicking the icon again
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchActive, searchQuery]);
  
  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Navigation links
  const navLinks: NavLink[] = [
    { name: 'Dashboard', path: '/dashboard', icon: faChartLine },
    { name: 'Games', path: '/games', icon: faGamepad },
    { name: 'Orders', path: '/orders', icon: faClipboardList },
    { name: 'Shop', path: '/shop', icon: faShoppingCart },
  ];

  // Animation variants
  const mobileSearchVariants = {
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
  };

  const mobileMenuVariants = {
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
  };

  const navItemVariants = {
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
  };

  // Improved search variants with better animation properties
  const searchVariants = {
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
  };

  const navbarVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }
    }
  };

  const dropdownVariants = {
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
  };
  const logOutFun = async () => {
    const resp = await logOut()
    if(resp.message = "Logged out"){
      router.push("/login")
    }
  }
  return (
    <motion.header 
      className="fixed w-full z-50 top-0 left-0 px-4 sm:px-6 md:px-8 pt-4"
      variants={navbarVariants}
      animate={"visible"}
    >
      <motion.nav 
        style={{ 
          opacity: navbarOpacity, 
          scale: navbarScale
        }}
        className="
          bg-gray-800 text-gray-100
          border border-gray-600
          backdrop-filter backdrop-blur-lg
          px-4 sm:px-6 py-3
          transition-all duration-300 ease-in-out
          shadow-2xl
          rounded-xl
          max-w-7xl mx-auto
        "
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <motion.div 
              style={{ rotate: logoRotate }} 
              className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600"
            >
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
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                passHref
              >
                <motion.div
                  className={`relative flex items-center space-x-1 ${
                    pathname === link.path ? 'text-indigo-400' : 'text-gray-300 hover:text-gray-100'
                  } transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={link.icon} className="h-4 w-4" />
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
            <motion.div 
              className="relative z-50 hidden lg:flex items-center"
            >
              <motion.div
                className="relative flex items-center justify-end"
                initial="closed"
                animate={isSearchActive ? "open" : "closed"}
                variants={searchVariants}
              >
                {isSearchActive && (
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search..."
                    className="w-full pr-8 pl-3 py-2 rounded-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                )}
                <motion.button 
                  className="absolute right-0 p-2 hover:bg-gray-700 rounded-full"
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (!isSearchActive) {
                      setIsSearchActive(true);
                    } else if (!searchQuery) {
                      setIsSearchActive(false);
                      setShowResults(false);
                    } else {
                      handleSearch();
                    }
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="h-4 w-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200" 
                  />
                </motion.button>
              {showResults && (
                <motion.div 
                  className="absolute top-full left-0 right-0 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {searchResults.length > 0 ? (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <Link
                            key={index}
                            href={result.path}
                            className="block p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery('');
                              setIsSearchActive(false);
                            }}
                          >
                            <h4 className="text-indigo-400 font-semibold mb-1">{result.title}</h4>
                            <p className="text-sm text-gray-300">{result.excerpt}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery.trim().length >= 2 && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 text-center text-gray-400">
                      No results found
                    </div>
                  )}
                </motion.div>
              )}
              </motion.div>
            </motion.div>
            
            {/* Search - Mobile version (icon only) */}
            <motion.button 
              className="lg:hidden p-2 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Toggle mobile search bar
                setIsMobileSearchActive(!isMobileSearchActive);
              }}
            >
              <FontAwesomeIcon 
                icon={faSearch} 
                className="h-4 w-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200" 
              />
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-700 relative"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (userDropdownOpen) setUserDropdownOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="p-3 border-b border-gray-600 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-4 text-center text-gray-400">
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
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1"></span>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    
                    <Link href="/notifications" passHref>
                      <div className="p-2 text-center text-sm text-indigo-400 hover:text-indigo-300 border-t border-gray-600">
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
                className="flex items-center space-x-2 rounded-lg py-1 px-2 hover:bg-gray-700 transition-colors duration-150"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  if (notificationsOpen) setNotificationsOpen(false);
                }}
              >
                <img 
                  src={user.avatar} 
                  alt="P" 
                  className="w-8 h-8 rounded-full border-2 border-indigo-500"
                />
                <span className="hidden sm:block font-medium text-sm">{user.name}</span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </motion.button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden z-10"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="p-4 border-b border-gray-600 flex flex-col items-center">
                      <img 
                        src={user.avatar} 
                        alt="P" 
                        className="w-16 h-16 rounded-full border-2 border-indigo-500 mb-2" 
                      />
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <div className="mt-2 px-2 py-1 bg-indigo-900/50 rounded-full text-xs text-indigo-300">
                        {user.role}
                      </div>
                    </div>

                    <div>
                      <Link href="/profile" passHref>
                        <div className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                          <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4 text-gray-400 mr-3"/>
                          <span className="text-sm">Profile</span>
                        </div>
                      </Link>
                      <Link href="/settings" passHref>
                        <div className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                          <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-gray-400 mr-3"/>
                          <span className="text-sm">Settings</span>
                        </div>
                      </Link>
                      <div className="border-t border-gray-600 mt-1">
                        <div
                            onClick={() => logOutFun()}
                            className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400 hover:text-red-300"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-3"/>
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
            >
              <FontAwesomeIcon 
                icon={isOpen ? faTimes : faBars} 
                className="h-5 w-5" 
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearchActive && (
            <motion.div
              variants={mobileSearchVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="w-full mt-4"
            >
              <div className="relative search-area">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={handleSearch}
                >
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="h-4 w-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200" 
                  />
                </button>
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <Link
                          key={index}
                          href={result.path}
                          className="block p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                          onClick={() => {
                            setShowResults(false);
                            setSearchQuery('');
                            setIsMobileSearchActive(false);
                          }}
                        >
                          <h4 className="text-indigo-400 font-semibold mb-1">{result.title}</h4>
                          <p className="text-sm text-gray-300">{result.excerpt}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {showResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 text-center text-gray-400">
                    No results found
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
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden mt-3 bg-gray-800 rounded-lg"
            >
              <div className="px-4 py-2 space-y-2">
                <motion.div variants={navItemVariants} className="flex items-center px-3 py-3 border-b border-gray-700">
                  <img 
                    src={user.avatar} 
                    alt="P" 
                    className="w-10 h-10 rounded-full border-2 border-indigo-500 mr-3" 
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </motion.div>
                
                {navLinks.map((link) => (
                  <motion.div key={link.path} variants={navItemVariants}>
                    <Link 
                      href={link.path} 
                      passHref 
                    >
                      <motion.div
                        className={`
                          flex items-center space-x-3 py-2 px-3 rounded-lg
                          ${pathname === link.path ? 'bg-gray-700 text-indigo-400' : ''}
                          hover:bg-gray-700
                          transition-colors duration-200
                        `}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FontAwesomeIcon icon={link.icon} className="h-5 w-5" />
                        <span>{link.name}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
                
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <motion.div variants={navItemVariants}>
                    <Link href="/profile" passHref>
                      <motion.div
                        className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        whileTap={{ scale: 0.98 }}
                      >
                        <FontAwesomeIcon icon={faUserCircle} className="h-5 w-5" />
                        <span>Profile</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="/settings" passHref>
                      <motion.div
                        className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        whileTap={{ scale: 0.98 }}
                      >
                        <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
                        <span>Settings</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <button onClick={()=>logOutFun()}>
                      <motion.div
                        className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 text-red-400 transition-colors duration-200"
                        whileTap={{ scale: 0.98 }}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                        <span>Sign out</span>
                      </motion.div>
                    </button>
                  </motion.div>
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