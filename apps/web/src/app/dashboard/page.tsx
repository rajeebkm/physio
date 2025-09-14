'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentAppointments } from '@/components/dashboard/RecentAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { HealthSummary } from '@/components/dashboard/HealthSummary';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
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

    if (!user) {
        return null;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
                    <h1 className="text-3xl font-bold">
                        Welcome back, {user.firstName}!
                    </h1>
                    <p className="text-primary-100 mt-2">
                        Here's what's happening with your health today.
                    </p>
                </div>

                {/* Stats Cards */}
                <StatsCards />

                {/* Quick Actions */}
                <QuickActions />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Appointments */}
                    <div className="lg:col-span-2">
                        <RecentAppointments />
                    </div>

                    {/* Health Summary */}
                    <div className="lg:col-span-1">
                        <HealthSummary />
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <UpcomingAppointments />
            </div>
        </DashboardLayout>
    );
}
