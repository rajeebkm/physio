'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import {
    ServerIcon,
    CircleStackIcon,
    CpuChipIcon,
    GlobeAltIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const systemMetrics = [
    {
        name: 'API Response Time',
        value: 95,
        status: 'good',
        icon: ServerIcon,
        description: 'Average response time: 120ms',
    },
    {
        name: 'Database Performance',
        value: 88,
        status: 'good',
        icon: CircleStackIcon,
        description: 'Query time: 45ms',
    },
    {
        name: 'Server CPU Usage',
        value: 65,
        status: 'warning',
        icon: CpuChipIcon,
        description: 'Current usage: 65%',
    },
    {
        name: 'Uptime',
        value: 99.9,
        status: 'excellent',
        icon: GlobeAltIcon,
        description: 'Last 30 days: 99.9%',
    },
];

export function SystemHealth() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent':
                return 'text-green-600';
            case 'good':
                return 'text-blue-600';
            case 'warning':
                return 'text-yellow-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'excellent':
            case 'good':
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
            case 'error':
                return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {systemMetrics.map((metric) => (
                        <div key={metric.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <metric.icon className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {metric.name}
                                    </span>
                                    {getStatusIcon(metric.status)}
                                </div>
                                <span className={`text-sm font-semibold ${getStatusColor(metric.status)}`}>
                                    {metric.value}%
                                </span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                            <p className="text-xs text-gray-500">{metric.description}</p>
                        </div>
                    ))}

                    {/* System Alerts */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                            <h4 className="text-sm font-medium text-yellow-800">
                                System Alert
                            </h4>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                            CPU usage is above 60%. Consider scaling up server resources.
                        </p>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Recent Activity
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Database backup completed</span>
                                <span className="text-gray-400">2 hours ago</span>
                            </div>
                            <div className="flex justify-between">
                                <span>API rate limit increased</span>
                                <span className="text-gray-400">4 hours ago</span>
                            </div>
                            <div className="flex justify-between">
                                <span>New user registration spike</span>
                                <span className="text-gray-400">6 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
