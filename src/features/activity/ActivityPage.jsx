import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActivityFeedList from './components/ActivityFeedList';
import ActivityFilterControls from './components/ActivityFilterControls';
import ActivityDetailView from './components/ActivityDetailView';
import ManualLogActivityForm from './components/ManualLogActivityForm';

const ActivityPage = () => {
  // State for filters, selected activity and modal visibility
  const [filters, setFilters] = useState({
    activityType: 'all',
    dateRange: 'all',
    searchQuery: ''
  });
  
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showLogActivityForm, setShowLogActivityForm] = useState(false);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };
  
  // Handle activity selection for detailed view
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };
  
  // Handle closing the detail view
  const handleCloseDetailView = () => {
    setSelectedActivity(null);
  };
  
  // Handle opening the log activity form
  const handleOpenLogActivityForm = () => {
    setShowLogActivityForm(true);
  };
  
  // Handle closing the log activity form
  const handleCloseLogActivityForm = () => {
    setShowLogActivityForm(false);
  };
  
  // Handle submitting a new activity
  const handleSubmitNewActivity = (activityData) => {
    // In a real app, you would dispatch this to your API or state management
    console.log('New activity submitted:', activityData);
    
    // Close the form
    setShowLogActivityForm(false);
    
    // Show a success message or update the feed (would be handled by state/API in a real app)
    alert('Activity logged successfully!');
  };
  
  return (
    <div className="container mx-auto pb-12 space-y-6">
      {/* Title section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Feed</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track, analyze, and manage all your fitness activities
          </p>
        </div>
        
        {/* Log Activity Button */}
        <Button 
          onClick={handleOpenLogActivityForm}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <Plus className="h-5 w-5" /> Log Activity
        </Button>
      </div>
      
      {/* Main content with fixed height container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative lg:h-[calc(100vh-200px)]">
        {/* Filters sidebar - fixed position */}
        <div className="lg:h-full">
          <div className="lg:sticky lg:top-4 h-auto">
            <Card className="bg-white dark:bg-[#17171D]/95 shadow-lg dark:shadow-2xl border-gray-100 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFilterControls 
                  activeFilters={filters} 
                  onFilterChange={handleFilterChange} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Activity Feed - scrollable with custom thin scrollbar */}
        <div className="lg:col-span-3 lg:overflow-y-auto lg:h-full custom-scrollbar">
          <ActivityFeedList 
            filters={filters}
            onActivitySelect={handleActivitySelect}
          />
        </div>
      </div>
      
      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <ActivityDetailView 
            activity={selectedActivity}
            onClose={handleCloseDetailView}
            layoutId={`activity-${selectedActivity.id}`}
          />
        )}
      </AnimatePresence>
      
      {/* Log Activity Form Modal */}
      <AnimatePresence>
        {showLogActivityForm && (
          <ManualLogActivityForm 
            onClose={handleCloseLogActivityForm}
            onSubmit={handleSubmitNewActivity}
          />
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default ActivityPage;