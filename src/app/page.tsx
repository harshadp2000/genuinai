"use client";

import { useState, useRef } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Upload,
} from "lucide-react";

import { analyzeTextStream } from "@/ai/flows/real-time-analysis";
import {
  detectBiasFromPrompt,
  type DetectBiasFromPromptOutput,
} from "@/ai/flows/bias-detection-from-prompt";
import { summarizeText } from "@/ai/flows/summarize-text";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type AnalysisResults = {
  summary: string;
  bias: DetectBiasFromPromptOutput;
  insights: string;
};

export default function Home() {
  const [text, setText] = useState<string>("");
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("bias");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
        toast({
          title: "File loaded",
          description: "The content of the text file has been loaded.",
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a text file.",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResults(null);
    setActiveTab("bias");

    try {
      const [summaryResult, biasResult, insightsResult] = await Promise.all([
        summarizeText({ text }),
        detectBiasFromPrompt({ promptText: text }),
        analyzeTextStream({ text }),
      ]);

      setResults({
        summary: summaryResult.summary,
        bias: biasResult,
        insights: insightsResult.analysis,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AnalysisSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[75%]" />
    </div>
  );

  const formatExplanation = (explanation: string) => {
    const paragraphs = explanation
      .split('\n')
      .filter(p => p.trim() !== '') // Remove empty lines
      .map(p => p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));

    return (
      <div>
        {paragraphs.map((p, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
            GenuinAI
          </h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
              <CardDescription>
                Enter text or upload a text file for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Textarea
                placeholder="Paste your text here..."
                className="min-h-[300px] resize-y"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".txt"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2" />
                  Upload Text File
                </Button>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2" />
                )}
                Analyze
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                View the summary, bias detection, and insights from the AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-[400px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="bias">Bias Detection</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-4">
                  {isLoading && <AnalysisSkeleton />}
                  {results && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {results.summary}
                    </p>
                  )}
                  {!isLoading && !results && (
                    <p className="text-center text-sm text-muted-foreground py-10">
                      Analysis results will appear here.
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="bias" className="mt-4">
                  {isLoading && <AnalysisSkeleton />}
                  {results &&
                    (results.bias.biasDetected ? (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Potential Bias Detected</AlertTitle>
                        <AlertDescription asChild>
                           <div className="prose prose-sm dark:prose-invert max-w-none">{formatExplanation(results.bias.biasExplanation)}</div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert
                        variant="default"
                        className="border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-500"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>No Bias Detected</AlertTitle>
                        <AlertDescription asChild>
                          <div className="prose prose-sm dark:prose-invert max-w-none">{formatExplanation(results.bias.biasExplanation)}</div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  {!isLoading && !results && (
                     <p className="text-center text-sm text-muted-foreground py-10">
                      Analysis results will appear here.
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="insights" className="mt-4">
                  {isLoading && <AnalysisSkeleton />}
                  {results && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {results.insights}
                    </p>
                  )}
                  {!isLoading && !results && (
                     <p className="text-center text-sm text-muted-foreground py-10">
                      Analysis results will appear here.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
