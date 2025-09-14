'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const [formData, setFormData] = useState({
        email: 'admin@physiocare.com',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);

            // Check if user is admin
            const user = JSON.parse(localStorage.getItem('user_data') || '{}');
            if (user.role !== 'ADMIN') {
                throw new Error('Access denied. Admin privileges required.');
            }

            toast.success('Welcome back, Admin!');
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
            toast.error('Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative max-w-md w-full space-y-8"
            >
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center"
                >
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <ShieldCheckIcon className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Admin Access
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 font-medium">
                        PhysioCare Admin Dashboard
                    </p>
                    <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                        <span>Secure Platform Management</span>
                        <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                    </div>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-6 pt-8">
                            <CardTitle className="text-2xl font-bold text-center text-gray-900">
                                Welcome back, Admin
                            </CardTitle>
                            <p className="text-sm text-gray-600 text-center">
                                Enter your credentials to access the management dashboard
                            </p>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                                            <div className="flex items-center">
                                                <div className="h-4 w-4 text-red-600 mr-2">⚠</div>
                                                {error}
                                            </div>
                                        </Alert>
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                        Admin Email Address
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="admin@physiocare.com"
                                            className="h-14 px-4 pl-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <div className="h-5 w-5 text-gray-400">@</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your secure password"
                                            className="h-14 px-4 pr-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded-lg transition-colors"
                                        />
                                        <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700">
                                            Keep me signed in
                                        </label>
                                    </div>
                                    <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                            Authenticating...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <LockClosedIcon className="h-5 w-5 mr-2" />
                                            Access Admin Dashboard
                                        </div>
                                    )}
                                </Button>
                            </form>

                            {/* Security Notice */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                            >
                                <div className="flex items-start">
                                    <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Security Notice</h4>
                                        <p className="text-xs text-blue-700">
                                            This is a secure admin area. All activities are logged and monitored for security purposes.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Footer Links */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500">
                                    By accessing this system, you agree to our{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Support Contact */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center"
                >
                    <p className="text-sm text-gray-600">
                        Need assistance? Contact{' '}
                        <a href="mailto:admin@physiocare.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                            admin@physiocare.com
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}