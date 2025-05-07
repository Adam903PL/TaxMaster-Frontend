"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLottie } from "lottie-react";
import NotFoundAnimation from "../../public/animations/404Animation.json";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.7,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const NotFound = () => {
  const options = {
    animationData: NotFoundAnimation,
    loop: true,
    // You can also adjust the size through Lottie options
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    }
  };

  const { View } = useLottie(options);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 text-center text-white">
      <motion.div
        className="w-full max-w-2xl" // Increased from max-w-xl
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Lottie Animation - Enlarged */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="transform scale-150 md:scale-175"> {/* Increased scale */}
            {View}
          </div>
        </motion.div>

        {/* Error Text */}
        <motion.p variants={itemVariants} className="text-gray-400 mb-12 mt-6">
          The page <span className="text-white font-semibold">{`you're`}</span>{" "}
          looking for{" "}
          <span className="text-white font-semibold">{`doesn't`}</span> exist or
          has been moved.
        </motion.p>

        {/* Button */}
        <motion.div variants={itemVariants}>
          <Link href="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;