// src/components/BlueprintTerminal.tsx
// Main interface for analyzing a specific blueprint. Integrates video player, playback controls, WebSocket-based terminal for real-time updates, timeline navigation, and properties panel.
// Designed for extensibility, security, and a seamless user experience.

'use client';

import { useState, useRef, useEffect } from 'react'; // React hooks for state, refs, and side effects
import { Play, Pause, SkipBack, SkipForward, Maximize2 } from 'lucide-react'; // Icons for video controls
import { Button } from '@/components/ui/button'; // Reusable Button component from shadcn/ui
import Timeline from './Timeline'; // Component for displaying and interacting with the blueprint timeline
import PropertiesPanel from './PropertiesPanel'; // Component for displaying properties of selected timeline elements
import React from 'react'; // Explicitly import React for JSX transform

/**
 * Interface for video data.
 * @interface VideoData
 * @property {string} id - Unique identifier for the video.
 * @property {string} title - Title of the video.
 * @property {number} duration - Duration of the video in seconds.
 * @property {string} url - URL of the video file.
 * @property {string} thumbnail - URL of the video thumbnail.
 */
interface VideoData {
  id: string;
  title: string;
  duration: number; // in seconds
  url: string;
  thumbnail: string;
}

/**
 * Interface for a selected element on the timeline.
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

// TODO: Replace mockVideo with dynamic fetching from API or props.
const mockVideo: VideoData = {
  id: '1',
  title: 'Product Demo - SaaS Platform',
  duration: 154, // 2:34
  url: '/api/placeholder/854/480', // Placeholder URL for video
  thumbnail: '/api/placeholder/854/480' // Placeholder URL for thumbnail
};

/**
 * BlueprintTerminal component.
 * Manages video playback, displays real-time WebSocket messages, and integrates with timeline and properties panel.
 * Potential Vulnerability: WebSocket connection is to `window.location.host`. In production, this should ideally
 * use a secure WebSocket (WSS) and connect to a specific, trusted backend WebSocket endpoint.
 * Ensure proper input validation and sanitization for any messages sent via WebSocket to prevent XSS or other injection attacks.
 */
export default function BlueprintTerminal() {
  const [isPlaying, setIsPlaying] = useState(false); // State for video playback status
  const [currentTime, setCurrentTime] = useState(0); // State for current video playback time
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({ type: null }); // State for the currently selected timeline element
  const [zoomLevel, setZoomLevel] = useState(1); // State for timeline zoom level
  const [timelineScrollX, setTimelineScrollX] = useState(0); // State for timeline horizontal scroll position
  const videoRef = useRef<HTMLVideoElement>(null); // Ref to access the HTML video element
  const [websocketMessages, setWebsocketMessages] = useState<string[]>([]); // State to store real-time WebSocket messages
  const terminalRef = useRef<HTMLDivElement>(null); // Ref to automatically scroll terminal output

  // useEffect hook to establish and manage the WebSocket connection.
  // This runs once on component mount and cleans up on unmount.
  useEffect(() => {
    // Connect to the WebSocket server using the current host and the defined API route.
    const ws = new WebSocket(`ws://${window.location.host}/api/websocket`);

    // Event handler for when the WebSocket connection is established.
    ws.onopen = () => {
      setWebsocketMessages((prev) => [...prev, '[WebSocket] Connected to server.']);
    };

    // Event handler for receiving messages from the WebSocket server.
    ws.onmessage = (event) => {
      // Add the received message to the state, prefixed for clarity.
      setWebsocketMessages((prev) => [...prev, `[WebSocket] ${event.data}`]);
    };

    // Event handler for when the WebSocket connection is closed.
    ws.onclose = () => {
      setWebsocketMessages((prev) => [...prev, '[WebSocket] Disconnected from server.']);
    };

    // Event handler for WebSocket errors.
    ws.onerror = (error) => {
      setWebsocketMessages((prev) => [...prev, '[WebSocket] Error occurred.']);
    };

    // Cleanup function: Close the WebSocket connection when the component unmounts.
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // useEffect hook to automatically scroll the terminal output to the bottom when new messages arrive.
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [websocketMessages]); // Re-run this effect whenever websocketMessages array updates.

  /**
   * Formats a given number of seconds into a "MM:SS" string format.
   * @param {number} seconds - The time in seconds.
   * @returns {string} The formatted time string.
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Toggles video playback (play/pause).
   */
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * Seeks the video to a specific time.
   * @param {number} time - The target time in seconds.
   */
  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  /**
   * Skips the video forward by 10 seconds.
   */
  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, mockVideo.duration); // Prevent seeking beyond video duration
    seekTo(newTime);
  };

  /**
   * Skips the video backward by 10 seconds.
   */
  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0); // Prevent seeking before the start of the video
    seekTo(newTime);
  };

  /**
   * Handles scrubbing (seeking) on the timeline component.
   * @param {number} time - The time to seek to, provided by the timeline.
   */
  const handleTimelineScrub = (time: number) => {
    seekTo(time);
  };

  /**
   * Handles selection of an element on the timeline.
   * @param {SelectedElement} element - The selected element object.
   */
  const handleElementSelect = (element: SelectedElement) => {
    setSelectedElement(element);
  };

  // useEffect hook for video event listeners.
  // Attaches and detaches event listeners for time updates and metadata loading.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime); // Update current time state as video plays
    };

    const handleLoadedMetadata = () => {
      // This event fires when the video's metadata (duration, dimensions) is loaded.
      // Useful for initializing controls or displaying video info once available.
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Cleanup function: Remove event listeners when component unmounts or dependencies change.
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []); // Empty dependency array ensures listeners are set up once.

  return (
    <div className="h-screen flex flex-col bg-background"> {/* Full height container, flex column layout */}
      {/* Header Section: Displays video title and fullscreen option. */}
      <div className="border-b border-border p-4"> {/* Bottom border, padding */}
        <div className="flex items-center justify-between"> {/* Flex container for title and buttons */}
          <div>
            <h1 className="text-xl font-semibold">{mockVideo.title}</h1> {/* Video title */}
            <p className="text-sm text-muted-foreground"> {/* Video duration and context */}
              Duration: {formatTime(mockVideo.duration)} • Blueprint Terminal
            </p>
          </div>
          <div className="flex items-center space-x-2"> {/* Space between buttons */}
            <Button variant="outline" size="sm"> {/* Fullscreen button */}
              <Maximize2 className="h-4 w-4 mr-2" /> {/* Fullscreen icon */}
              Fullscreen
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Divided into Left (Video/Terminal/Timeline) and Right (Properties Panel). */}
      <div className="flex-1 flex"> {/* Flex-grow to fill remaining space, flex row layout */}
        {/* Left Content Area: Contains video player, WebSocket terminal, and timeline. */}
        <div className="flex-1 flex flex-col"> {/* Flex-grow, flex column layout */}
          {/* Video Preview Section */}
          <div className="bg-black aspect-video relative"> {/* Black background, maintains aspect ratio */}
            <video
              ref={videoRef} // Ref to control the video element
              className="w-full h-full object-contain" // Occupy full space, maintain aspect ratio
              poster={mockVideo.thumbnail} // Thumbnail image to display before video loads
              preload="metadata" // Preload video metadata (duration, etc.)
            >
              <source src={mockVideo.url} type="video/mp4" /> {/* Video source file */}
              Your browser does not support video playback. {/* Fallback message */} 
            </video>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4"> {/* Position controls at bottom */}
              <div className="bg-black/80 backdrop-blur rounded-lg p-3"> {/* Semi-transparent background for controls */}
                <div className="flex items-center justify-between text-white"> {/* Flex for controls alignment */}
                  <div className="flex items-center space-x-3"> {/* Playback buttons group */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipBackward}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlayback}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {/* Play/Pause toggle icon */}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipForward}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm"> {/* Current time / total duration display */}
                    {formatTime(currentTime)} / {formatTime(mockVideo.duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WebSocket Terminal Output Section */}
          <div 
            ref={terminalRef} // Ref for auto-scrolling
            className="flex-1 bg-gray-900 text-white p-4 font-mono text-sm overflow-y-auto" // Styling for terminal look
          >
            {/* Map and display each WebSocket message */}
            {websocketMessages.map((msg, index) => (
              <p key={index} className="text-gray-300">{msg}</p> // Display each message in a paragraph
            ))}
            {/* Potential Vulnerability: Directly displaying raw WebSocket messages could lead to XSS
                if untrusted data is sent from the server. Sanitize or escape messages before rendering in production. */}
          </div>

          {/* Timeline Container Section */}
          <div className="flex-1 border-t border-border"> {/* Top border, flex-grow to fill space */}
            <Timeline
              duration={mockVideo.duration} // Total duration of the media
              currentTime={currentTime} // Current playback time
              onScrub={handleTimelineScrub} // Callback for timeline scrubbing
              onElementSelect={handleElementSelect} // Callback for selecting timeline elements
              selectedElement={selectedElement} // Currently selected element
              zoomLevel={zoomLevel} // Current zoom level of the timeline
              onZoomChange={setZoomLevel} // Callback to change zoom level
              scrollX={timelineScrollX} // Current horizontal scroll position
              onScrollChange={setTimelineScrollX} // Callback to update scroll position
            />
          </div>
        </div>

        {/* Right Properties Panel Section */}
        <div className="w-80 border-l border-border"> {/* Fixed width, left border */}
          <PropertiesPanel
            selectedElement={selectedElement} // Currently selected element for properties display
            currentTime={currentTime} // Current video time (for context in panel)
            duration={mockVideo.duration} // Total video duration (for context in panel)
          />
        </div>
      </div>
    </div>
  );
}