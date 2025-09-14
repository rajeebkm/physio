'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

const pendingProviders = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        email: 'sarah.johnson@example.com',
        phone: '+91 98765 43210',
        experience: '8 years',
        documents: ['Medical License', 'Degree Certificate', 'ID Proof'],
        submittedAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Physiotherapy',
        email: 'michael.chen@example.com',
        phone: '+91 98765 43211',
        experience: '5 years',
        documents: ['Physiotherapy License', 'Degree Certificate', 'ID Proof'],
        submittedAt: '2024-01-14',
    },
    {
        id: '3',
        name: 'Dr. Emily Davis',
        specialty: 'General Medicine',
        email: 'emily.davis@example.com',
        phone: '+91 98765 43212',
        experience: '12 years',
        documents: ['Medical License', 'Degree Certificate', 'ID Proof', 'Experience Certificate'],
        submittedAt: '2024-01-13',
    },
];

export function ProviderVerification() {
    const handleApprove = (providerId: string) => {
        // TODO: Implement approval logic
        console.log('Approving provider:', providerId);
    };

    const handleReject = (providerId: string) => {
        // TODO: Implement rejection logic
        console.log('Rejecting provider:', providerId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Provider Verification</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingProviders.map((provider) => (
                        <div
                            key={provider.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-medium text-gray-600">
                                            {provider.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {provider.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{provider.specialty}</p>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <div className="text-xs text-gray-500">
                                            {provider.email}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {provider.phone}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {provider.experience} experience
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <ClockIcon className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            Submitted on {provider.submittedAt}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <DocumentTextIcon className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            {provider.documents.length} documents uploaded
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                    onClick={() => handleApprove(provider.id)}
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => handleReject(provider.id)}
                                >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
