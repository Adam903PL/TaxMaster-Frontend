import React, { useState, ChangeEvent, FormEvent } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Variants } from 'framer-motion';
import {
    faUser,
    faEnvelope,
    faBirthdayCake,
    faChartLine,
    faGraduationCap,
    faCalendarWeek,
    faListUl,
    faFileAlt,
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileForm = () => {
    interface FormData {
        firstName: string;
        lastName: string;
        email: string;
        age: string;
        financialGoal: string;
        knowledgeLevel: string;
        weeklyGoal: number;
        interests: string[];
        bio: string;
    }

    interface FormErrors {
        firstName?: string;
        lastName?: string;
        email?: string;
        age?: string;
    }

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        financialGoal: "savings",
        knowledgeLevel: "beginner",
        weeklyGoal: 3,
        interests: [],
        bio: ""
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    interface InterestOption {
        id: string;
        label: string;
    }

    // List of financial/economic interests
    const interestOptions: InterestOption[] = [
        { id: "investing", label: "Investing" },
        { id: "savings", label: "Savings" },
        { id: "budgeting", label: "Budgeting" },
        { id: "stocks", label: "Stock Market" },
        { id: "crypto", label: "Cryptocurrencies" },
        { id: "retirement", label: "Retirement" },
        { id: "taxes", label: "Taxes" },
        { id: "business", label: "Entrepreneurship" }
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'weeklyGoal' ? Number(value) : value
        });
    };

    const handleInterestChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({
                ...formData,
                interests: [...formData.interests, value]
            });
        } else {
            setFormData({
                ...formData,
                interests: formData.interests.filter(interest => interest !== value)
            });
        }
    };

    const validateForm = (): FormErrors => {
        let tempErrors: FormErrors = {};
        if (!formData.firstName.trim()) tempErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
            tempErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            tempErrors.email = "Invalid email format";
        }

        if (formData.age && isNaN(Number(formData.age))) {
            tempErrors.age = "Age must be a number";
        }

        return tempErrors;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            // Tutaj można dodać logikę wysyłania danych do API
            console.log("Data to send:", formData);
            setIsSubmitted(true);
            setErrors({});
        } else {
            setErrors(validationErrors);
        }
    };

    // Animacje
    const formVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    const successVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 24
            }
        }
    };

    return (
        <div className="w-full px-4 py-8">
            <div className="max-w-2xl mx-auto p-8 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl text-gray-100">
            <motion.h2
                className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
            >
                Your Financial Profile
            </motion.h2>

            <AnimatePresence mode="wait">
                {isSubmitted ? (
                    <motion.div
                        className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-8 rounded-2xl mb-6 border border-indigo-500/50 backdrop-blur-sm shadow-lg"
                        variants={successVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                                <FontAwesomeIcon icon={faCheck} className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <p className="text-indigo-200 text-center font-medium mb-4">Profile updated successfully!</p>
                        <motion.button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => setIsSubmitted(false)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Edit Again
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.form
                        onSubmit={handleSubmit}
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-400" />
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-400" />
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-indigo-400" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faBirthdayCake} className="mr-2 text-indigo-400" />
                                Age (optional)
                            </label>
                            <input
                                type="text"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                placeholder="Your age"
                            />
                            {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-indigo-400" />
                                Main Financial Goal
                            </label>
                            <select
                                name="financialGoal"
                                value={formData.financialGoal}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                            >
                                <option value="savings">Savings</option>
                                <option value="investing">Investing</option>
                                <option value="debt">Debt Repayment</option>
                                <option value="retirement">Retirement Planning</option>
                                <option value="business">Starting a Business</option>
                            </select>
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-indigo-400" />
                                Financial Knowledge Level
                            </label>
                            <select
                                name="knowledgeLevel"
                                value={formData.knowledgeLevel}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faCalendarWeek} className="mr-2 text-indigo-400" />
                                Weekly Goal (lessons)
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    name="weeklyGoal"
                                    min="1"
                                    max="7"
                                    value={formData.weeklyGoal}
                                    onChange={handleChange}
                                    className="w-full mr-4 accent-indigo-500"
                                />
                                <span className="text-lg font-bold text-indigo-400 bg-gray-700 px-3 py-1 rounded-md border border-gray-600">{formData.weeklyGoal}</span>
                            </div>
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faListUl} className="mr-2 text-indigo-400" />
                                Areas of Interest
                            </label>
                            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-700 border border-gray-600 rounded-lg">
                                {interestOptions.map(option => (
                                    <div key={option.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={option.id}
                                            value={option.id}
                                            checked={formData.interests.includes(option.id)}
                                            onChange={handleInterestChange}
                                            className="mr-2 accent-indigo-500"
                                        />
                                        <label htmlFor={option.id} className="text-gray-200">{option.label}</label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-indigo-400" />
                                Short Description (bio)
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                rows="3"
                                placeholder="Write something about yourself and your financial goals..."
                            ></textarea>
                        </motion.div>

                        <motion.div className="mt-6" variants={itemVariants}>
                            <motion.button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Save Profile
                            </motion.button>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
};