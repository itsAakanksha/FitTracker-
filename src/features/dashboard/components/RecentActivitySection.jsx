
//==================================================
// src/features/dashboard/components/RecentActivitySection.jsx (NEW + Enhanced)
//==================================================
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from '../../../app/hooks';
import { selectRecentActivity } from '../dashboardSlice';
import { motion } from 'framer-motion';
import clsx from 'clsx'; // Use clsx

function RecentActivitySection() {
    const recentActivities = useAppSelector(selectRecentActivity);

    return (
        <Card className="bg-white dark:bg-[#17171D] shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30">View All</Button>
            </CardHeader>
            <CardContent>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {recentActivities.map((activity, index) => {
                        // const IconComponent = activity.icon;
                        return (
                            <motion.li
                                key={activity.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="py-3.5 flex items-center justify-between space-x-3"
                            >
                                <div className="flex items-center space-x-4"> {/* Increased space */}
                                    <div className="bg-violet-100 dark:bg-violet-900/50 p-2.5 rounded-full">
                                        {/* <IconComponent className="h-5 w-5 text-violet-600 dark:text-violet-400" /> */}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.type}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.detail}</p>
                                    </div>
                                </div>
                                <p className={clsx(
                                    "text-sm font-medium text-right", // Ensure text aligns right
                                    activity.statusColor ? activity.statusColor : 'text-gray-700 dark:text-gray-300'
                                )}>
                                    {activity.value}
                                </p>
                            </motion.li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}

export default RecentActivitySection;
