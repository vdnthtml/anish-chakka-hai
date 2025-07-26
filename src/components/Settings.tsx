// src/components/Settings.tsx
// Settings page for Helixar Blueprint Insight. Allows users to configure preferences and app options in a user-friendly interface.

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, User, Bell, Palette, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <SettingsIcon className="h-8 w-8 mr-3" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your Helixar experience
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Account Settings */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Account</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground mt-1">user@example.com</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Plan</Label>
              <p className="text-sm text-muted-foreground mt-1">Professional Plan</p>
            </div>
            
            <Button variant="outline" size="sm">
              Manage Account
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Palette className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-play videos</Label>
                <p className="text-sm text-muted-foreground">Automatically play videos in Blueprint Terminal</p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">High quality previews</Label>
                <p className="text-sm text-muted-foreground">Use higher resolution for video thumbnails</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Real-time analysis</Label>
                <p className="text-sm text-muted-foreground">Show analysis results as they're processed</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Analysis complete</Label>
                <p className="text-sm text-muted-foreground">Get notified when video analysis finishes</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Weekly insights</Label>
                <p className="text-sm text-muted-foreground">Receive weekly performance reports</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Data retention</Label>
                <p className="text-sm text-muted-foreground">Keep analysis data for 30 days</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Data</Label>
              <p className="text-sm text-muted-foreground">
                Download all your analysis data and blueprints
              </p>
              <Button variant="outline" size="sm">
                Request Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}