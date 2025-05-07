import React, { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    faEnvelope,
    faLock,
    faBell,
    faLanguage,
    faChartLine,
    faClock,
    faCheck,
    faPalette,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

interface FormData {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    enableNotifications: boolean;
    dailyReminder: boolean;
    weeklyReport: boolean;
    challengeAlerts: boolean;
    language: 'pl' | 'en' | 'de' | 'fr';
    theme: 'dark' | 'light' | 'system';
    privacyMode: boolean;
    currencyDisplay: 'PLN' | 'EUR' | 'USD' | 'GBP';
}

export const SettingsForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>({
        defaultValues: {
            email: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            enableNotifications: true,
            dailyReminder: true,
            weeklyReport: true,
            challengeAlerts: true,
            language: "pl",
            theme: "dark",
            privacyMode: false,
            currencyDisplay: "PLN"
        }
    });

    const watchNewPassword = watch("newPassword");

    const submitSettingsForm = async (data: FormData) => {
        try {
            const onSubmit = (data: FormData) => {
                console.log('Saved settings:', data);
            };
            setIsSubmitted(true);
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    const handleReset = () => {
        reset();
        setIsSubmitted(false);
    };

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
                    className="text-2xl font-bold mb-6"
                >
                    Account Settings
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
                            <p className="text-indigo-200 text-center font-medium mb-4">Settings updated successfully!</p>
                            <motion.button
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25"
                                onClick={handleReset}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Back to settings
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit(submitSettingsForm)}
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-gray-700 pb-2">
                                    Account
                                </h3>

                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-indigo-400" />
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                        placeholder="your@email.com"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email format"
                                            }
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{(errors.email as FieldError)?.message}</p>
                                    )}
                                </motion.div>

                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <FontAwesomeIcon icon={faLock} className="mr-2 text-indigo-400" />
                                        Current password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                        placeholder="Enter current password"
                                        {...register("currentPassword", {
                                            required: "Current password is required to change password"
                                        })}
                                    />
                                    {errors.currentPassword && (
                                        <p className="text-red-400 text-sm mt-1">{(errors.currentPassword as FieldError)?.message}</p>
                                    )}
                                </motion.div>

                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <FontAwesomeIcon icon={faLock} className="mr-2 text-indigo-400" />
                                        New password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                        placeholder="Enter new password"
                                        {...register("newPassword", {
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                message: "Password should contain uppercase and lowercase letters, a number and a special character"
                                            }
                                        })}
                                    />
                                    {errors.newPassword && (
                                        <p className="text-red-400 text-sm mt-1">{(errors.newPassword as FieldError)?.message}</p>
                                    )}
                                </motion.div>

                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <FontAwesomeIcon icon={faLock} className="mr-2 text-indigo-400" />
                                        Confirm new password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder:text-gray-400"
                                        placeholder="Confirm new password"
                                        {...register("confirmPassword", {
                                            validate: value =>
                                                value === watchNewPassword || "Passwords do not match"
                                        })}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-400 text-sm mt-1">{(errors.confirmPassword as FieldError)?.message}</p>
                                    )}
                                </motion.div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-gray-700 pb-2">
                                    Notifications
                                </h3>

                                <motion.div className="mb-4" variants={itemVariants}>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faBell} className="text-indigo-400 mr-3" />
                                            <span>Enable notifications</span>
                                        </div>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                {...register('enableNotifications')}
                                                className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span>Enable Notifications</span>
                                        </label>
                                    </div>
                                </motion.div>

                                <motion.div className="mb-4" variants={itemVariants}>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faClock} className="text-indigo-400 mr-3" />
                                            <span>Daily reminder</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                {...register("dailyReminder")}
                                            />
                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                        </label>
                                    </div>
                                </motion.div>

                                <motion.div className="mb-4" variants={itemVariants}>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faChartLine} className="text-indigo-400 mr-3" />
                                            <span>Weekly report</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                {...register("weeklyReport")}
                                            />
                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                        </label>
                                    </div>
                                </motion.div>

                                <motion.div className="mb-4" variants={itemVariants}>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faBell} className="text-indigo-400 mr-3" />
                                            <span>Challenge alerts</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                {...register("challengeAlerts")}
                                            />
                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                        </label>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4 text-indigo-300 border-b border-gray-700 pb-2">
                                    Preferences
                                </h3>

                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <FontAwesomeIcon icon={faLanguage} className="mr-2 text-indigo-400" />
                                        Language
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                                        {...register("language")}
                                    >
                                        <option value="en">English</option>
                                        <option value="pl">Polish</option>
                                        <option value="de">German</option>
                                        <option value="fr">French</option>
                                    </select>
                                </motion.div>

                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <FontAwesomeIcon icon={faPalette} className="mr-2 text-indigo-400" />
                                        Theme
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                                        {...register("theme")}
                                    >
                                        <option value="dark">Dark</option>
                                        <option value="light">Light</option>
                                        <option value="system">System</option>
                                    </select>
                                </motion.div>

                                <motion.div className="mb-6" variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <FontAwesomeIcon icon={faChartLine} className="mr-2 text-indigo-400" />
                                        Currency
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-700/75 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                                        {...register("currencyDisplay")}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="PLN">PLN (zł)</option>
                                    </select>
                                </motion.div>

                                <motion.div className="mb-4" variants={itemVariants}>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-400 mr-3" />
                                            <span>Privacy Mode (hide progress from others)</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                {...register("privacyMode")}
                                            />
                                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                        </label>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div className="mt-8 flex space-x-4" variants={itemVariants}>
                                <motion.button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-lg hover:shadow-indigo-500/25"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Save Changes
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => reset()}
                                    className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Cancel
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};