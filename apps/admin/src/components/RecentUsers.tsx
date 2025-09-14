'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    UserIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const recentUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Patient',
        status: 'Active',
        joinedAt: '2024-01-15',
        lastActive: '2 hours ago',
    },
    {
        id: '2',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'Doctor',
        status: 'Active',
        joinedAt: '2024-01-14',
        lastActive: '1 hour ago',
    },
    {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        role: 'Physiotherapist',
        status: 'Pending',
        joinedAt: '2024-01-13',
        lastActive: '1 day ago',
    },
    {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'Patient',
        status: 'Active',
        joinedAt: '2024-01-12',
        lastActive: '3 hours ago',
    },
];

export function RecentUsers() {
    const handleActivate = (userId: string) => {
        // TODO: Implement activation logic
        console.log('Activating user:', userId);
    };

    const handleDeactivate = (userId: string) => {
        // TODO: Implement deactivation logic
        console.log('Deactivating user:', userId);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Recent Users</CardTitle>
                <Button variant="outline" size="sm">
                    View All
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <UserIcon className="h-5 w-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <div className="text-xs text-gray-500">
                                            {user.role}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <CalendarIcon className="h-3 w-3 mr-1" />
                                            Joined {user.joinedAt}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Last active {user.lastActive}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {user.status === 'Active' ? (
                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                    ) : (
                                        <XCircleIcon className="h-3 w-3 mr-1" />
                                    )}
                                    {user.status}
                                </span>
                                {user.status === 'Active' ? (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                        onClick={() => handleDeactivate(user.id)}
                                    >
                                        Deactivate
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                        onClick={() => handleActivate(user.id)}
                                    >
                                        Activate
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
