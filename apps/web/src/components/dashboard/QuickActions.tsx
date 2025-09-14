'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
    CalendarIcon,
    VideoCameraIcon,
    UserGroupIcon,
    DocumentTextIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

const quickActions = [
    {
        name: 'Book Appointment',
        description: 'Schedule a consultation with a doctor',
        href: '/dashboard/appointments/book',
        icon: CalendarIcon,
        color: 'bg-blue-500',
    },
    {
        name: 'Video Consultation',
        description: 'Start an instant video call',
        href: '/dashboard/video-calls/new',
        icon: VideoCameraIcon,
        color: 'bg-green-500',
    },
    {
        name: 'Find Provider',
        description: 'Search for doctors and therapists',
        href: '/dashboard/providers/search',
        icon: UserGroupIcon,
        color: 'bg-purple-500',
    },
    {
        name: 'Health Records',
        description: 'View your medical history',
        href: '/dashboard/health-records',
        icon: DocumentTextIcon,
        color: 'bg-orange-500',
    },
];

export function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <Link key={action.name} href={action.href}>
                            <div className="relative group cursor-pointer">
                                <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200">
                                    <div className={`flex-shrink-0 w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                                        <action.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                                            {action.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {action.description}
                                        </p>
                                    </div>
                                    <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
