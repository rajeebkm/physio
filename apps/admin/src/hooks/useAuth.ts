'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'PROVIDER' | 'PATIENT';
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const useAuth = (): AuthState => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate auth check - in real app, this would check localStorage or make API call
        const checkAuth = async () => {
            try {
                setLoading(true);
                // For demo purposes, simulate an admin user
                const mockUser: User = {
                    id: '1',
                    email: 'admin@physiocare.com',
                    name: 'Admin User',
                    role: 'ADMIN'
                };

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUser(mockUser);
                setError(null);
            } catch (err) {
                setError('Failed to authenticate');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { user, loading, error };
};
