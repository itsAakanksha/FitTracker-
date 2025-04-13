import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, PersonStanding, Dumbbell, HeartPulse as WorkoutIcon } from 'lucide-react'; // Import icons directly
import { useAppSelector } from '../../../app/hooks';
import { selectRecommendations } from '../dashboardSlice';
import { motion } from 'framer-motion';

function RecommendationsSection() {
    const recommendedWorkouts = useAppSelector(selectRecommendations);

    // Map of icon components by ID
    const iconMap = {
        rec1: PersonStanding,
        rec2: Dumbbell,
        rec3: WorkoutIcon
    };

    return (
        <Card className="bg-white dark:bg-[#17171D] shadow-lg h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Workouts</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30">View All</Button>
            </CardHeader>
            <CardContent>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {recommendedWorkouts.map((workout, index) => {
                        const IconComponent = iconMap[workout.id];
                        return (
                            <motion.li
                                key={workout.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                                className="py-3.5 flex items-center justify-between space-x-3 cursor-pointer rounded-md px-2 -mx-2"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-violet-100 dark:bg-violet-900/50 p-2.5 rounded-full">
                                        {IconComponent && <IconComponent className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{workout.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {workout.level} | {workout.time} | {workout.duration}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </motion.li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}

export default RecommendationsSection;

