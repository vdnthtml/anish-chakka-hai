import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function NewBlueprint() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      toast({
        title: "Blueprint Created",
        description: "Your video analysis is complete and ready to view.",
      });
    }, 3000);
  };

  const resetForm = () => {
    setUrl('');
    setIsCompleted(false);
    setIsProcessing(false);
  };

  if (isCompleted) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-audio rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Blueprint Ready!</h2>
          <p className="text-muted-foreground mb-8">
            Your video has been analyzed and your Blueprint Terminal is ready to explore.
          </p>
          
          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/blueprint/new-analysis')}>
              Open Blueprint Terminal
            </Button>
            <Button variant="outline" onClick={resetForm} className="w-full">
              Create Another Blueprint
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Create New Blueprint</h1>
          <p className="text-muted-foreground text-lg">
            Transform your video content into actionable insights with AI-powered analysis
          </p>
        </div>

        {/* Main Form */}
        <div className="space-y-8">
          {/* URL Input Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="drop-zone">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Link className="h-8 w-8 text-primary" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Paste Video URL</h3>
                  <p className="text-muted-foreground text-sm">
                    Supports YouTube, Vimeo, and direct video links
                  </p>
                </div>
                
                <div className="w-full max-w-md space-y-4">
                  <div>
                    <Label htmlFor="video-url" className="sr-only">Video URL</Label>
                    <Input
                      id="video-url"
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="text-center"
                      disabled={isProcessing}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isProcessing || !url.trim()}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Video...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Create Blueprint
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Processing State */}
          {isProcessing && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <div>
                  <h4 className="font-medium">Processing your video...</h4>
                  <p className="text-sm text-muted-foreground">
                    This usually takes 1-3 minutes depending on video length
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Extracting frames</span>
                  <span className="text-primary">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Analyzing audio</span>
                  <span className="text-primary">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mapping narrative structure</span>
                  <Loader2 className="h-3 w-3 animate-spin" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Calculating clarity score</span>
                  <span>Pending</span>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-narrative/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-narrative font-bold">N</span>
              </div>
              <h4 className="font-medium mb-2">Narrative Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Identify hooks, problems, and solutions in your story structure
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-visuals/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-visuals font-bold">V</span>
              </div>
              <h4 className="font-medium mb-2">Visual Breakdown</h4>
              <p className="text-sm text-muted-foreground">
                Scene detection and visual element analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-audio/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-audio font-bold">A</span>
              </div>
              <h4 className="font-medium mb-2">Audio Insights</h4>
              <p className="text-sm text-muted-foreground">
                Speech patterns, music, and sound effect analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}