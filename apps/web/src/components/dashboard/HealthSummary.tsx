'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import {
    HeartIcon,
    BoltIcon,
    ShieldCheckIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

const healthMetrics = [
    {
        name: 'Overall Health',
        value: 95,
        icon: HeartIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
    {
        name: 'Activity Level',
        value: 78,
        icon: BoltIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        name: 'Recovery Rate',
        value: 88,
        icon: ShieldCheckIcon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    {
        name: 'Progress',
        value: 92,
        icon: ChartBarIcon,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
    },
];

export function HealthSummary() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {healthMetrics.map((metric) => (
                        <div key={metric.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {metric.name}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                    {metric.value}%
                                </span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Recent Activity
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Last consultation</span>
                            <span>2 days ago</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Exercise sessions</span>
                            <span>3 this week</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Medication adherence</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
