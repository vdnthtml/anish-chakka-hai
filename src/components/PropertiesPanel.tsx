// src/components/PropertiesPanel.tsx
// Properties panel for Helixar Blueprint Insight. Displays and allows editing of properties for selected timeline elements.
// Designed for clarity, extensibility, and a seamless user experience.

'use client';

import React from 'react'; // Explicitly import React for JSX transform
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Card components from shadcn/ui
import { Badge } from '@/components/ui/badge'; // Badge component from shadcn/ui
import { Separator } from '@/components/ui/separator'; // Separator component from shadcn/ui

/**
 * Interface for a selected element.
 * This matches the `SelectedElement` interface in `BlueprintTerminal.tsx` and `Timeline.tsx`.
 * @interface SelectedElement
 * @property {'narrative' | 'visual' | 'audio' | 'clarity' | null} type - The type of the selected element.
 * @property {string} [id] - Optional unique identifier for the element.
 * @property {number} [timeStart] - Optional start time of the element in seconds.
 * @property {number} [timeEnd] - Optional end time of the element in seconds.
 * @property {any} [data] - Optional arbitrary data associated with the element (e.g., clarity score, scene details).
 */
interface SelectedElement {
  type: 'narrative' | 'visual' | 'audio' | 'clarity' | null;
  id?: string;
  timeStart?: number;
  timeEnd?: number;
  data?: any;
}

/**
 * Props for the PropertiesPanel component.
 * @interface PropertiesPanelProps
 * @property {SelectedElement} selectedElement - The currently selected element from the timeline.
 * @property {number} currentTime - The current playback time of the media in seconds.
 * @property {number} duration - The total duration of the media in seconds.
 */
interface PropertiesPanelProps {
  selectedElement: SelectedElement;
  currentTime: number;
  duration: number;
}

/**
 * Formats a given number of seconds into a "MM:SS" string format.
 * Re-defined here for self-containment, but could be moved to a shared utility.
 * @param {number} seconds - The time in seconds.
 * @returns {string} The formatted time string.
 */
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * PropertiesPanel component.
 * Displays detailed information about a selected timeline element.
 * The content of the panel changes dynamically based on the `selectedElement.type`.
 * Potential Vulnerability: When displaying `data` from `selectedElement`, ensure that `data` is sanitized
 * before rendering to prevent Cross-Site Scripting (XSS) if data originates from untrusted sources.
 * Consider using a library like `dompurify` for sanitization.
 */
export default function PropertiesPanel({
  selectedElement,
  currentTime,
  duration,
}: PropertiesPanelProps) {
  // If no element is selected, display a message prompting the user to select one.
  if (!selectedElement || !selectedElement.type) {
    return (
      <div className="h-full p-4 flex items-center justify-center text-muted-foreground text-center">
        Select an element on the timeline to view its properties.
      </div>
    );
  }

  // Determine the display title and specific data based on the element type.
  let displayTitle = 'Element Properties';
  let elementSpecificData: React.ReactNode = null;

  // Render different content based on the selected element's type.
  switch (selectedElement.type) {
    case 'narrative':
      displayTitle = 'Narrative Beat';
      elementSpecificData = (
        <> {/* Fragment to group multiple elements */}
          <p><strong>Text:</strong> {selectedElement.data?.text}</p>
          <p><strong>Score:</strong> {selectedElement.data?.score || 'N/A'}</p>
        </>
      );
      break;
    case 'visual':
      displayTitle = 'Visual Event';
      elementSpecificData = (
        <> {/* Fragment */}
          <p><strong>Scene:</strong> {selectedElement.data?.scene}</p>
          <p><strong>Description:</strong> {selectedElement.data?.description || 'N/A'}</p>
        </>
      );
      break;
    case 'audio':
      displayTitle = 'Audio Event';
      elementSpecificData = (
        <> {/* Fragment */}
          <p><strong>Track:</strong> {selectedElement.data?.title}</p>
          <p><strong>Volume:</strong> {selectedElement.data?.volume !== undefined ? `${selectedElement.data.volume * 100}%` : 'N/A'}</p>
        </>
      );
      break;
    case 'clarity':
      displayTitle = 'Clarity Insight';
      elementSpecificData = (
        <> {/* Fragment */}
          <p><strong>Insight:</strong> {selectedElement.data?.text}</p>
          <p><strong>Score:</strong> {selectedElement.data?.score || 'N/A'}</p>
        </>
      );
      break;
    default:
      break;
  }

  return (
    <div className="h-full flex flex-col bg-card"> {/* Main container, fills height */}
      <Card className="border-none shadow-none rounded-none"> {/* Card styling, no extra borders/shadows */}
        <CardHeader> {/* Card header section */}
          <CardTitle className="text-lg font-semibold">{displayTitle}</CardTitle> {/* Dynamic title */}
        </CardHeader>
        <CardContent className="space-y-4"> {/* Card content with vertical spacing */}
          {/* General Element Details */}
          <div>
            <h4 className="font-medium mb-1 text-muted-foreground">General</h4>
            <p><strong>ID:</strong> {selectedElement.id || 'N/A'}</p>
            <p><strong>Type:</strong> <Badge>{selectedElement.type}</Badge></p> {/* Display type as a badge */}
            <p>
              <strong>Time:</strong> {formatTime(selectedElement.timeStart || 0)} - {formatTime(selectedElement.timeEnd || 0)}
            </p>
            <p><strong>Duration:</strong> {formatTime((selectedElement.timeEnd || 0) - (selectedElement.timeStart || 0))}</p>
          </div>

          <Separator /> {/* Visual separator */}

          {/* Element-Specific Data */}
          <div>
            <h4 className="font-medium mb-1 text-muted-foreground">Specific Data</h4>
            {elementSpecificData || <p className="text-muted-foreground text-sm">No specific data available for this type.</p>} {/* Dynamic specific data */}
          </div>

          {/* Current Playback Context */}
          <Separator /> {/* Visual separator */}
          <div>
            <h4 className="font-medium mb-1 text-muted-foreground">Context</h4>
            <p><strong>Current Video Time:</strong> {formatTime(currentTime)} / {formatTime(duration)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}