'use client';

import { Card, CardContent } from '@/components/ui/Card';
import {
    UsersIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

const stats = [
    {
        name: 'Total Users',
        value: '12,543',
        change: '+12%',
        changeType: 'positive',
        icon: UsersIcon,
    },
    {
        name: 'Active Providers',
        value: '1,247',
        change: '+8%',
        changeType: 'positive',
        icon: UserGroupIcon,
    },
    {
        name: 'Monthly Revenue',
        value: '₹2,45,670',
        change: '+23%',
        changeType: 'positive',
        icon: CurrencyDollarIcon,
    },
    {
        name: 'Platform Growth',
        value: '18.5%',
        change: '+5.2%',
        changeType: 'positive',
        icon: ChartBarIcon,
    },
];

export function AdminStatsCards() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.name}>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <stat.icon className="h-8 w-8 text-red-600" />
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
