'use client';

import { Card, CardContent } from '@/components/ui/Card';
import {
    CalendarIcon,
    VideoCameraIcon,
    UserGroupIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

const stats = [
    {
        name: 'Total Appointments',
        value: '24',
        change: '+4',
        changeType: 'positive',
        icon: CalendarIcon,
    },
    {
        name: 'Video Consultations',
        value: '18',
        change: '+2',
        changeType: 'positive',
        icon: VideoCameraIcon,
    },
    {
        name: 'Active Providers',
        value: '12',
        change: '+1',
        changeType: 'positive',
        icon: UserGroupIcon,
    },
    {
        name: 'Health Score',
        value: '95%',
        change: '+5%',
        changeType: 'positive',
        icon: HeartIcon,
    },
];

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.name}>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <stat.icon className="h-8 w-8 text-primary-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        {stat.name}
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stat.value}
                                        </div>
                                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
