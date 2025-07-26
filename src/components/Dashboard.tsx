// src/components/Dashboard.tsx
// Dashboard component for Helixar Blueprint Insight. Displays key stats, blueprint cards, and main dashboard UI.
// Modular and responsive, designed for extensibility and clarity.

'use client';

import { useState } from 'react'; // useState is kept for potential local state management, though not directly used for blueprints now.
import { BarChart3, Clock } from 'lucide-react'; // Icon components from Lucide React
import PageHeader from '@/components/common/PageHeader'; // Reusable component for page titles and descriptions
import StatCard from '@/components/dashboard/StatCard'; // Reusable component for displaying key statistics
import BlueprintCard from '@/components/dashboard/BlueprintCard'; // Reusable component for displaying individual blueprint details
import { useQuery } from '@tanstack/react-query'; // TanStack Query hook for data fetching
import { supabase } from '@/lib/supabase'; // Supabase client for database interaction

/**
 * Interface for a Blueprint object.
 * This interface defines the structure of data expected for each blueprint from the Supabase `blueprints` table.
 * Ensure your Supabase table schema matches these fields.
 * @interface Blueprint
 * @property {string} id - Unique identifier for the blueprint.
 * @property {string} title - Title of the blueprint.
 * @property {string} thumbnail - URL to the thumbnail image for the blueprint.
 * @property {string} duration - Formatted duration of the content (e.g., "2:34").
 * @property {'completed' | 'processing' | 'failed'} status - Current status of the blueprint processing.
 * @property {number} clarityScore - AI-generated clarity score (0-100).
 * @property {string} createdAt - Timestamp or formatted string of when the blueprint was created.
 */
interface Blueprint {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
  clarityScore: number;
  createdAt: string;
}

/**
 * Asynchronous function to fetch blueprint data from the Supabase database.
 * This function is used by TanStack Query to retrieve data for the Dashboard.
 * @returns {Promise<Blueprint[]>} A promise that resolves to an array of Blueprint objects.
 * @throws {Error} Throws an error if the Supabase query fails.
 */
const fetchBlueprints = async (): Promise<Blueprint[]> => {
  // Fetch all columns from the 'blueprints' table.
  const { data, error } = await supabase.from('blueprints').select('*');

  // Handle any errors that occur during the Supabase query.
  if (error) {
    console.error('Error fetching blueprints:', error.message);
    // Re-throw the error so TanStack Query can catch and manage the error state.
    throw new Error(`Failed to fetch blueprints: ${error.message}`);
  }
  // Return the fetched data, cast to the Blueprint array type.
  // It's good practice to add runtime validation or Zod schemas for incoming data in a real app.
  return data as Blueprint[];
};

/**
 * Dashboard component serves as the main overview page for blueprints.
 * It displays high-level statistics and a grid of individual blueprint cards.
 * Data is fetched from Supabase using TanStack Query, handling loading and error states.
 */
export default function Dashboard() {
  // Use TanStack Query to fetch blueprint data.
  // `data` will contain the fetched blueprints (or undefined/null during loading/error).
  // `isLoading` is true while the data is being fetched.
  // `error` will contain an Error object if the fetch fails.
  const { data: blueprints, isLoading, error } = useQuery<Blueprint[], Error>({
    queryKey: ['blueprints'], // Unique key for this query, used for caching and revalidation
    queryFn: fetchBlueprints, // The function that performs the data fetching
    // Options for TanStack Query can be added here, e.g., staleTime, refetchOnWindowFocus.
  });

  // Display a loading message while blueprints are being fetched.
  if (isLoading) {
    return <div className="p-8 text-center text-xl text-muted-foreground">Loading blueprints...</div>;
  }

  // Display an error message if fetching blueprints fails.
  // In a production app, this should be more user-friendly and less technical.
  if (error) {
    return (
      <div className="p-8 text-center text-xl text-destructive">
        Error: Could not load blueprints. {error.message}
      </div>
    );
  }

  // Ensure `blueprints` is an array before attempting to filter or map.
  // `useQuery`'s `data` will be `undefined` initially or on error.
  const validBlueprints = blueprints || [];

  // Calculate statistics based on fetched blueprints.
  const completedBlueprints = validBlueprints.filter(b => b.status === 'completed');
  const averageClarityScore = completedBlueprints.length > 0
    ? Math.round(completedBlueprints.reduce((acc, b) => acc + b.clarityScore, 0) / completedBlueprints.length)
    : 0;

  return (
    <div className="p-8"> {/* Main padding for the dashboard layout */}
      {/* Page Header section */}
      <PageHeader 
        title="Blueprint Dashboard" 
        description="Analyze your video content with AI-powered insights"
      />

      {/* Statistics Overview section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Responsive grid for stat cards */}
        {/* Total Blueprints Stat Card */}
        <StatCard 
          title="Total Blueprints"
          value={validBlueprints.length}
          icon={<BarChart3 className="h-8 w-8 text-primary" />} // Icon for total blueprints
        />
        
        {/* Average Clarity Score Stat Card */}
        <StatCard 
          title="Avg Clarity Score"
          value={averageClarityScore}
          icon={<span className="text-primary font-bold text-sm">%</span>} // Custom icon for percentage
          iconBgColor="bg-primary/20"
          iconTextColor="text-primary"
        />
        
        {/* Processing Blueprints Stat Card */}
        <StatCard 
          title="Processing"
          value={validBlueprints.filter(b => b.status === 'processing').length}
          icon={<Clock className="h-8 w-8 text-clarity" />} // Icon for processing status
          iconTextColor="text-clarity"
        />
      </div>

      {/* Blueprint Grid section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Responsive grid for blueprint cards */}
        {validBlueprints.length === 0 && !isLoading && !error ? (
          <p className="col-span-full text-center text-muted-foreground">No blueprints found. Start by creating a new one!</p>
        ) : (
          validBlueprints.map((blueprint) => (
            <BlueprintCard key={blueprint.id} {...blueprint} /> // Render each BlueprintCard
          ))
        )}
      </div>
    </div>
  );
}