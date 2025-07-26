// src/components/Timeline.tsx
// Timeline component for Helixar Blueprint Insight. Visualizes and allows navigation of blueprint events over time.
// Designed for interactivity, clarity, and extensibility.

'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Hand, ZoomIn, ZoomOut } from 'lucide-react'; // Corrected: Pan to Hand icon for dragging
import { Button } from '@/components/ui/button'; // Reusable Button component from shadcn/ui
import { Input } from '@/components/ui/input'; // Input component for zoom level display
import { Slider } from '@/components/ui/slider'; // Slider component for scrubbing
import { cn } from '@/lib/utils'; // Utility function for conditionally joining Tailwind CSS classes

/**
 * Interface for a timeline element.
 * These elements represent different tracks (narrative, visual, audio, clarity) within the media.
 * @interface TimelineElement
 * @property {string} id - Unique identifier for the element.
 * @property {'narrative' | 'visual' | 'audio' | 'clarity'} type - The type of the element (corresponds to track).
 * @property {number} start - Start time of the element in seconds.
 * @property {number} end - End time of the element in seconds.
 * @property {string} text - Display text for the element.
 * @property {string} [colorClass] - Optional Tailwind CSS class for custom element coloring.
 */
interface TimelineElement {
  id: string;
  type: 'narrative' | 'visual' | 'audio' | 'clarity';
  start: number;
  end: number;
  text: string;
  colorClass?: string;
}

/**
 * Interface for a selected element.
 * This matches the `SelectedElement` interface in `BlueprintTerminal.tsx`.
 * @interface SelectedElement
 * @property {'narrative' | 'visual' | 'audio' | 'clarity' | null} type - The type of the selected element.
 * @property {string} [id] - Optional unique identifier for the element.
 * @property {number} [timeStart] - Optional start time of the element in seconds.
 * @property {number} [timeEnd] - Optional end time of the element in seconds.
 * @property {any} [data] - Optional arbitrary data associated with the element.
 */
interface SelectedElement {
  type: 'narrative' | 'visual' | 'audio' | 'clarity' | null;
  id?: string;
  timeStart?: number;
  timeEnd?: number;
  data?: any;
}

/**
 * Props for the Timeline component.
 * @interface TimelineProps
 * @property {number} duration - The total duration of the media in seconds.
 * @property {number} currentTime - The current playback time of the media in seconds.
 * @property {(time: number) => void} onScrub - Callback function when the user scrubs the timeline.
 * @property {(element: SelectedElement) => void} onElementSelect - Callback function when a timeline element is selected.
 * @property {SelectedElement} selectedElement - The currently selected element, for highlighting.
 * @property {number} zoomLevel - The current zoom level of the timeline.
 * @property {(zoom: number) => void} onZoomChange - Callback to update the zoom level.
 * @property {number} scrollX - The current horizontal scroll position of the timeline.
 * @property {(scroll: number) => void} onScrollChange - Callback to update the horizontal scroll position.
 */
interface TimelineProps {
  duration: number;
  currentTime: number;
  onScrub: (time: number) => void;
  onElementSelect: (element: SelectedElement) => void;
  selectedElement: SelectedElement;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  scrollX: number;
  onScrollChange: (scroll: number) => void;
}

// TODO: Replace mockTimelineData with dynamic fetching from API or props.
const mockTimelineData: TimelineElement[] = [
  // Narrative Track
  { id: 'n1', type: 'narrative', start: 0, end: 10, text: 'Intro to SaaS Platform', colorClass: 'bg-narrative' },
  { id: 'n2', type: 'narrative', start: 15, end: 30, text: 'Key Features Overview', colorClass: 'bg-narrative' },
  { id: 'n3', type: 'narrative', start: 40, end: 55, text: 'User Testimonials', colorClass: 'bg-narrative' },
  
  // Visuals Track
  { id: 'v1', type: 'visual', start: 5, end: 12, text: 'Dashboard UI Showcase', colorClass: 'bg-visuals' },
  { id: 'v2', type: 'visual', start: 25, end: 35, text: 'Feature Animation Demo', colorClass: 'bg-visuals' },
  { id: 'v3', type: 'visual', start: 45, end: 60, text: 'Product Mockups', colorClass: 'bg-visuals' },

  // Audio Track
  { id: 'a1', type: 'audio', start: 0, end: 15, text: 'Background Music', colorClass: 'bg-audio' },
  { id: 'a2', type: 'audio', start: 20, end: 40, text: 'Voiceover Explanation', colorClass: 'bg-audio' },
  { id: 'a3', type: 'audio', start: 50, end: 65, text: 'Sound Effects Highlight', colorClass: 'bg-audio' },

  // Clarity Track (example of AI insights)
  { id: 'c1', type: 'clarity', start: 8, end: 11, text: 'High Clarity Segment', colorClass: 'bg-clarity text-black' },
  { id: 'c2', type: 'clarity', start: 32, end: 34, text: 'Confusing Terminology', colorClass: 'bg-clarity text-black' },
  { id: 'c3', type: 'clarity', start: 52, end: 54, text: 'Audience Engagement Peak', colorClass: 'bg-clarity text-black' },
];

// Pixels per second at base zoom level
const PIXELS_PER_SECOND_BASE = 50;

/**
 * Timeline component.
 * Visualizes different tracks of content over time and allows user interaction.
 * @param {TimelineProps} props - The component props.
 */
export default function Timeline({
  duration,
  currentTime,
  onScrub,
  onElementSelect,
  selectedElement,
  zoomLevel,
  onZoomChange,
  scrollX,
  onScrollChange,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null); // Ref for the main scrollable timeline container
  const [isDragging, setIsDragging] = useState(false); // State to track if the timeline is being dragged
  const [dragStartX, setDragStartX] = useState(0); // Starting X position for dragging
  const [startScrollX, setStartScrollX] = useState(0); // Initial scroll position when dragging starts

  // Calculate total width of the timeline based on duration and zoom level
  const totalWidth = duration * PIXELS_PER_SECOND_BASE * zoomLevel;

  // Memoized callback for handling timeline scroll events
  const handleScroll = useCallback(() => {
    if (timelineRef.current) {
      onScrollChange(timelineRef.current.scrollLeft); // Update parent's scroll state
    }
  }, [onScrollChange]);

  // Attach and detach scroll event listener
  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener('scroll', handleScroll);
      return () => {
        timeline.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Synchronize timeline scroll position with parent state
  useEffect(() => {
    if (timelineRef.current && timelineRef.current.scrollLeft !== scrollX) {
      timelineRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  // Handle mouse down for dragging the timeline
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setStartScrollX(timelineRef.current?.scrollLeft || 0);
    e.preventDefault(); // Prevent text selection during drag
  };

  // Handle mouse move for dragging the timeline
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = startScrollX - deltaX;
    }
  }, [isDragging, dragStartX, startScrollX]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach and detach global mouse event listeners for dragging
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Calculate the position of the playback indicator (current time line)
  const indicatorPosition = (currentTime / duration) * totalWidth;

  // Handle scrubbing by clicking on the timeline track
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || isDragging) return; // Ignore clicks if dragging

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - timelineRect.left + timelineRef.current.scrollLeft;
    const newTime = (clickX / totalWidth) * duration;
    onScrub(newTime); // Call parent's scrub handler
  };

  // Handle zoom level changes
  const handleZoomChange = (value: number[]) => {
    onZoomChange(value[0]); // Slider provides an array, take the first value
  };

  // Function to get element position and width on the timeline
  const getElementStyle = (element: TimelineElement) => {
    const left = (element.start / duration) * totalWidth;
    const width = ((element.end - element.start) / duration) * totalWidth;
    const isSelected = selectedElement.id === element.id && selectedElement.type === element.type;
    return {
      left: `${left}px`,
      width: `${width}px`,
      backgroundColor: element.colorClass, // Using Tailwind class for background
      border: isSelected ? '2px solid white' : 'none', // Highlight selected element
      zIndex: isSelected ? 10 : 1, // Bring selected to front
    };
  };

  // Group timeline data by type (track)
  const groupedData = mockTimelineData.reduce((acc, element) => {
    if (!acc[element.type]) {
      acc[element.type] = [];
    }
    acc[element.type].push(element);
    return acc;
  }, {} as Record<string, TimelineElement[]>);

  // Define track order for consistent rendering
  const trackOrder: (keyof typeof groupedData)[] = ['narrative', 'visual', 'audio', 'clarity'];

  return (
    <div className="flex flex-col h-full bg-secondary text-secondary-foreground"> {/* Main container for the timeline */}
      {/* Timeline Controls */}
      <div className="p-2 border-b border-border flex items-center space-x-4"> {/* Controls bar */}
        <div className="flex items-center space-x-2"> {/* Zoom controls */}
          <Hand className="h-5 w-5 text-muted-foreground" /> {/* Pan icon */}
          <Button variant="ghost" size="sm" onClick={() => onZoomChange(Math.max(0.5, zoomLevel - 0.5))}> {/* Zoom out button */}
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[zoomLevel]} // Current zoom level
            onValueChange={handleZoomChange} // Callback for slider change
            max={5} // Max zoom level
            min={0.5} // Min zoom level
            step={0.1} // Zoom step
            className="w-[100px]" // Slider width
          />
          <Button variant="ghost" size="sm" onClick={() => onZoomChange(Math.min(5, zoomLevel + 0.5))}> {/* Zoom in button */}
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={zoomLevel.toFixed(1)} // Display current zoom level
            onChange={(e) => onZoomChange(parseFloat(e.target.value))} // Allow manual input
            step="0.1"
            min="0.5"
            max="5"
            className="w-20 h-8 text-center bg-input border-input"
          />
        </div>
      </div>

      {/* Timeline Display Area */}
      <div 
        ref={timelineRef} // Ref for scrolling
        className="flex-1 overflow-x-auto relative cursor-grab active:cursor-grabbing select-none" // Scrollable area, cursor changes on drag
        onMouseDown={handleMouseDown} // Start drag
        onClick={handleTimelineClick} // Handle click to seek
      >
        {/* Playback Indicator (Current Time Line) */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20" // Red vertical line for current time
          style={{ left: indicatorPosition }} // Position based on current time and zoom
        />

        {/* Timeline Tracks */}
        <div 
          className="flex flex-col h-full py-2" // Padding for tracks
          style={{ width: totalWidth }} // Set total width based on zoom
        >
          {trackOrder.map(trackType => (
            <div key={trackType} className="flex-1 border-b border-border-foreground/10 last:border-b-0 relative"> {/* Each track row */}
              <div className="absolute left-0 top-0 h-full w-20 bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold uppercase opacity-80 z-10 rounded-r-md"> {/* Track label */}
                {trackType}
              </div>
              <div className="relative h-full ml-20"> {/* Area for elements within the track */}
                {groupedData[trackType]?.map(element => (
                  <div
                    key={element.id} // Unique key for elements
                    className={cn("absolute h-3/4 rounded-sm flex items-center justify-center text-xs text-white p-1 overflow-hidden whitespace-nowrap opacity-90", element.colorClass || 'bg-gray-700')} // Element styling
                    style={getElementStyle(element)} // Dynamic positioning and sizing
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent timeline click from bubbling
                      onElementSelect({ // Select the element
                        type: element.type,
                        id: element.id,
                        timeStart: element.start,
                        timeEnd: element.end,
                        data: element, // Pass the full element data for properties panel
                      });
                    }}
                  >
                    {element.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}