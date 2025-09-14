'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminStatsCards } from '@/components/AdminStatsCards';
import { RecentUsers } from '@/components/RecentUsers';
import { ProviderVerification } from '@/components/ProviderVerification';
import { RevenueChart } from '@/components/RevenueChart';
import { SystemHealth } from '@/components/SystemHealth';

export default function AdminDashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
                    <h1 className="text-3xl font-bold">
                        Admin Dashboard
                    </h1>
                    <p className="text-primary-100 mt-2">
                        Monitor and manage your PhysioCare platform.
                    </p>
                </div>

                {/* Stats Cards */}
                <AdminStatsCards />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-1">
                        <RevenueChart />
                    </div>

                    {/* System Health */}
                    <div className="lg:col-span-1">
                        <SystemHealth />
                    </div>
                </div>

                {/* Provider Verification */}
                <ProviderVerification />

                {/* Recent Users */}
                <RecentUsers />
            </div>
        </AdminLayout>
    );
}
