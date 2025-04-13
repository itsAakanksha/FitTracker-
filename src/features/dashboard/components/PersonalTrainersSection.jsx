import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from '../../../app/hooks';
import { selectTrainers } from '../dashboardSlice';
import { motion } from 'framer-motion';

function PersonalTrainersSection() {
    const trainers = useAppSelector(selectTrainers);

    return (
        <Card className="bg-white dark:bg-[#17171D] shadow-lg h-full"> {/* Added h-full */}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Personal Trainers</CardTitle>
                {/* Add dropdown/filter if needed */}
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {trainers.map((trainer, index) => (
                        <motion.div
                            key={trainer.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm"
                        >
                            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-900 shadow-sm">
                                <AvatarImage src={trainer.imgSrc} alt={trainer.name} />
                                <AvatarFallback>{trainer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation if needed */}
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{trainer.name}</p>
                                <p className="text-xs text-violet-600 dark:text-violet-400 truncate">{trainer.specialization}</p>
                            </div>
                            {/* Optional: Add a 'Book' or 'View Profile' button */}
                            {/* <Button variant="outline" size="xs">View</Button> */}
                        </motion.div>
                    ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-200">
                    Book a Session
                </Button>
            </CardContent>
        </Card>
    );
}

export default PersonalTrainersSection;
