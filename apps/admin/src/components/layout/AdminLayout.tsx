'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import {
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    CogIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, description: 'Overview & Analytics' },
    { name: 'Users', href: '/users', icon: UsersIcon, description: 'Patient Management' },
    { name: 'Providers', href: '/providers', icon: UserGroupIcon, description: 'Doctor & Therapist' },
    { name: 'Revenue', href: '/revenue', icon: CurrencyDollarIcon, description: 'Financial Reports' },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, description: 'Data Insights' },
    { name: 'Settings', href: '/settings', icon: CogIcon, description: 'System Configuration' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // In a real app, you'd persist this to localStorage and apply to document
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative flex w-80 flex-col bg-white dark:bg-gray-800 shadow-2xl"
                        >
                            <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">PhysioCare</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-2 px-4 py-6">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div
                                            key={item.name}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                <item.icon
                                                    className={`mr-4 h-5 w-5 ${isActive
                                                            ? 'text-white'
                                                            : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                        }`}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className={`text-xs ${isActive
                                                            ? 'text-blue-100'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl">
                    <div className="flex h-20 items-center px-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <ShieldCheckIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">PhysioCare</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-2 px-4 py-6">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <motion.div
                                    key={item.name}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-4 h-5 w-5 ${isActive
                                                    ? 'text-white'
                                                    : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                }`}
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold">{item.name}</div>
                                            <div className={`text-xs ${isActive
                                                    ? 'text-blue-100'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {item.description}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Top navigation */}
                <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    {/* Search bar */}
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1">
                            <div className="relative w-full max-w-lg">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users, providers, or reports..."
                                    className="block w-full rounded-xl border-0 py-3 pl-10 pr-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* Dark mode toggle */}
                            <button
                                type="button"
                                onClick={toggleDarkMode}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {darkMode ? (
                                    <SunIcon className="h-6 w-6" />
                                ) : (
                                    <MoonIcon className="h-6 w-6" />
                                )}
                            </button>

                            {/* Notifications */}
                            <button
                                type="button"
                                className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* User menu */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <UserCircleIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {user?.name || 'Admin User'}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Administrator</div>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                                        >
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Profile Settings
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Account Preferences
                                            </a>
                                            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                                            <button
                                                onClick={logout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                Sign out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}