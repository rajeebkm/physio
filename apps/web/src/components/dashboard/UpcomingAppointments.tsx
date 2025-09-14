'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
    CalendarIcon,
    VideoCameraIcon,
    ClockIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';

const upcomingAppointments = [
    {
        id: '1',
        provider: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        type: 'Video Consultation',
        date: '2024-01-16',
        time: '2:00 PM',
        duration: '30 min',
        status: 'Confirmed',
    },
    {
        id: '2',
        provider: 'Dr. Michael Chen',
        specialty: 'Physiotherapy',
        type: 'In-Person',
        date: '2024-01-17',
        time: '10:00 AM',
        duration: '45 min',
        status: 'Confirmed',
        location: 'PhysioCare Clinic, Mumbai',
    },
];

export function UpcomingAppointments() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Upcoming Appointments</CardTitle>
                <Link href="/dashboard/appointments">
                    <Button variant="outline" size="sm">
                        View All
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {appointment.type === 'Video Consultation' ? (
                                        <VideoCameraIcon className="h-8 w-8 text-blue-500" />
                                    ) : (
                                        <CalendarIcon className="h-8 w-8 text-green-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {appointment.provider}
                                    </h3>
                                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <ClockIcon className="h-3 w-3 mr-1" />
                                            {appointment.date} at {appointment.time}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {appointment.duration}
                                        </div>
                                        {appointment.location && (
                                            <div className="flex items-center text-xs text-gray-500">
                                                <MapPinIcon className="h-3 w-3 mr-1" />
                                                {appointment.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {appointment.status}
                                </span>
                                <Button size="sm" variant="outline">
                                    Join
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
