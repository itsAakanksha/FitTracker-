import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Bike, Waves, Footprints, Dumbbell, Flower, Mountain, 
         Calendar, Clock, Ruler, Flame, Heart } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const ManualLogActivityForm = ({ onClose, onSubmit }) => {
  // Form state
  const [formData, setFormData] = useState({
    type: 'Running',
    title: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    duration: '',
    distance: '',
    calories: '',
    avgHeartRate: '',
    notes: '',
    hasRoute: false
  });

  // Activity type options
  const activityTypes = [
    { id: 'Running', label: 'Running', icon: Activity },
    { id: 'Cycling', label: 'Cycling', icon: Bike },
    { id: 'Swimming', label: 'Swimming', icon: Waves },
    { id: 'Walking', label: 'Walking', icon: Footprints },
    { id: 'Gym Workout', label: 'Gym Workout', icon: Dumbbell },
    { id: 'Yoga', label: 'Yoga', icon: Flower },
    { id: 'Hiking', label: 'Hiking', icon: Mountain },
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle activity type selection
  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type
    });
  };

  // Auto-calculate calories if not manually entered
  const autoCalculateCalories = () => {
    if (!formData.calories && formData.distance && formData.duration) {
      const distance = parseFloat(formData.distance);
      const duration = parseInt(formData.duration);
      
      if (!isNaN(distance) && !isNaN(duration)) {
        let calculatedCalories = 0;
        
        switch (formData.type) {
          case 'Running':
            calculatedCalories = Math.round(distance * 60 + (duration * 0.5));
            break;
          case 'Cycling':
            calculatedCalories = Math.round(distance * 30 + (duration * 0.2));
            break;
          case 'Swimming':
            calculatedCalories = Math.round(distance * 300 + (duration * 0.3));
            break;
          default:
            calculatedCalories = Math.round(distance * 40 + (duration * 0.25));
        }
        
        setFormData({
          ...formData,
          calories: calculatedCalories.toString()
        });
      }
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct ISO date string from form fields
    const dateTimeStr = `${formData.date}T${formData.time}`;
    const dateObj = new Date(dateTimeStr);
    
    // Submit with formatted data
    onSubmit({
      ...formData,
      date: dateObj.toISOString(),
      duration: parseInt(formData.duration),
      distance: parseFloat(formData.distance),
      calories: parseInt(formData.calories),
      avgHeartRate: parseInt(formData.avgHeartRate)
    });
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 500 
      } 
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800/90 rounded-xl overflow-hidden max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl border border-gray-100 dark:border-gray-700/80 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        variants={contentVariants}
      >
        {/* Header with Close Button */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Log Activity
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Activity Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity Type
            </label>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => {
                const isActive = formData.type === type.id;
                const IconComponent = type.icon;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeChange(type.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors
                      ${isActive 
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-700'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-violet-500' : 'text-gray-500 dark:text-gray-500'}`} />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={`${formData.type} Session`}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
                required
              />
            </div>
          </div>

          {/* Activity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                placeholder="60"
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
                required
              />
            </div>
            
            {/* Distance */}
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Ruler className="h-4 w-4 mr-1.5 text-gray-500" />
                Distance (km)
              </label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="5.0"
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
              />
            </div>
            
            {/* Calories */}
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Flame className="h-4 w-4 mr-1.5 text-gray-500" />
                Calories
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  min="0"
                  placeholder="300"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
                />
                <button 
                  type="button"
                  onClick={autoCalculateCalories}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 border-l-0 rounded-r-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none text-xs"
                >
                  Auto
                </button>
              </div>
            </div>
            
            {/* Heart Rate */}
            <div>
              <label htmlFor="avgHeartRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Heart className="h-4 w-4 mr-1.5 text-gray-500" />
                Avg Heart Rate (bpm)
              </label>
              <input
                type="number"
                id="avgHeartRate"
                name="avgHeartRate"
                value={formData.avgHeartRate}
                onChange={handleChange}
                min="0"
                max="250"
                placeholder="140"
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="How did it go? Add any additional details here."
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600"
            />
          </div>

          {/* Has Route Checkbox */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasRoute"
                name="hasRoute"
                checked={formData.hasRoute}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="hasRoute" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I have a GPS route to upload
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Save Activity
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ManualLogActivityForm;