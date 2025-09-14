'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const revenueData = [
    { month: 'Jan', revenue: 120000, consultations: 450, therapy: 320 },
    { month: 'Feb', revenue: 135000, consultations: 520, therapy: 380 },
    { month: 'Mar', revenue: 148000, consultations: 580, therapy: 420 },
    { month: 'Apr', revenue: 162000, consultations: 640, therapy: 460 },
    { month: 'May', revenue: 175000, consultations: 700, therapy: 500 },
    { month: 'Jun', revenue: 189000, consultations: 760, therapy: 540 },
];

export function RevenueChart() {
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Revenue Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Revenue Chart */}
                    <div className="h-64 flex items-end space-x-2">
                        {revenueData.map((data, index) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center">
                                <div className="w-full bg-gray-200 rounded-t-lg relative">
                                    <div
                                        className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500"
                                        style={{
                                            height: `${(data.revenue / maxRevenue) * 200}px`,
                                        }}
                                    />
                                </div>
                                <div className="mt-2 text-xs text-gray-600 font-medium">
                                    {data.month}
                                </div>
                                <div className="text-xs text-gray-500">
                                    ₹{(data.revenue / 1000).toFixed(0)}k
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Revenue Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                ₹{revenueData[revenueData.length - 1].revenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Current Month</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                +{((revenueData[revenueData.length - 1].revenue - revenueData[revenueData.length - 2].revenue) / revenueData[revenueData.length - 2].revenue * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">Growth Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {revenueData[revenueData.length - 1].consultations + revenueData[revenueData.length - 1].therapy}
                            </div>
                            <div className="text-sm text-gray-500">Total Sessions</div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">Revenue Breakdown</h4>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Consultations</span>
                                <span className="font-medium">₹{revenueData[revenueData.length - 1].consultations * 500}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Therapy Sessions</span>
                                <span className="font-medium">₹{revenueData[revenueData.length - 1].therapy * 800}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium border-t pt-1">
                                <span>Total</span>
                                <span>₹{revenueData[revenueData.length - 1].revenue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
