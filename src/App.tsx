// src/App.tsx
// Main entry point for the React application. Sets up global providers, routing, and layout for the Helixar Blueprint Insight app.
// Provides Toaster notifications, tooltips, and integrates TanStack Query for data fetching.
// Uses React Router for client-side navigation and renders the main Sidebar and page components.

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import NewBlueprint from "./components/NewBlueprint";
import BlueprintTerminal from "./components/BlueprintTerminal";
import Settings from "./components/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewBlueprint />} />
              <Route path="/blueprint/:id" element={<BlueprintTerminal />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
