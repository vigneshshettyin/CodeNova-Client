import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { CodeEditor } from "@/components/code-editor";
import { TestCases } from "@/components/test-cases";
import { Results } from "@/components/results";
import { ThemeToggle } from "@/components/theme-toggle";
import { Code as CodeLogo } from "lucide-react";
import { Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

function App() {
  const { shareTaskId } = useParams();
  const [code, setCode] = useState<string>("// Write your code here");
  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [testCases, setTestCases] = useState<
    Array<{ input: string; expectedOutput: string }>
  >([{ input: "", expectedOutput: "" }]);
  const [results, setResults] = useState<
    Array<{
      input: string;
      expected: string;
      actual: string;
      success: boolean;
      error: string | null;
    }>
  >([]);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!taskId) return;

      try {
        const response = await fetch(
          `https://api.code.eurl.dev/api/result/${taskId}`
        );

        if (response.status === 404) {
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();
        setResults(data);
        setLoading(false);
        setTaskId(null);

        // Check if all test cases passed
        const allPassed = data.every(
          (result: { success: boolean }) => result.success
        );
        if (allPassed) {
          setShowShare(true);
          triggerConfetti();
          toast({
            title: "Success!",
            description: "All test cases passed!",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch results",
        });
        setLoading(false);
        setTaskId(null);
      }
    };
    if (taskId) {
      const interval = setInterval(() => {
        fetchResults();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [taskId, toast]);

  const handleSubmit = async () => {
    if (testCases.some((tc) => !tc.input || !tc.expectedOutput)) {
      toast({
        title: "Incomplete Test Cases",
        description:
          "Please fill in all test cases with input and expected output.",
      });
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("https://api.code.eurl.dev/api/judge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          testCases,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit code");
      }

      const data = await response.json();
      setTaskId(data.taskId);
    } catch (error) {
      toast({
        title: "Submission Error",
        description:
          error instanceof Error ? error.message : "Failed to submit code",
      });
      setLoading(false);
    }
  };

  const shareResults = async () => {
    setLoading(true);
    try {
      // post language, code, testcases to a api
      const response = await fetch("https://api.code.eurl.dev/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          testCases,
          results,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to share results");
      }

      setLoading(false);
      const data = await response.json();
      navigator.clipboard.writeText(`${window.location.origin}/${data.taskId}`);
      toast({
        title: "Results Shared",
        description: "Link copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to share results",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shareTaskId) return;

    const fetchSharedResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.code.eurl.dev/api/share/${shareTaskId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shared results");
        }

        const data = await response.json();
        setLanguage(data.language);
        setCode(data.code);
        setTestCases(data.testCases);
        setResults([]);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch shared results",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSharedResults();
  }, [shareTaskId, toast]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="codenova-theme">
      <div className="flex flex-col w-[80vw] md:w-[100vw] overflow-y-scroll">
        <header className="border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CodeLogo className="h-6 w-6" />
              <h1 className="text-xl font-bold">CodeNova</h1>
            </div>
            <div className="flex items-center gap-4">
              {showShare && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={shareResults}
                >
                  <Share2 className="h-5 w-5" />
                  Share
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-6 w-full">
          {isMobile ? (
            <div className="flex flex-col gap-6">
              <div className="flex-1">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={language}
                  setLanguage={setLanguage}
                  theme={theme}
                  setTheme={setTheme}
                />
              </div>
              <div className="flex-1">
                <Tabs defaultValue="testcases">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>
                  <TabsContent value="testcases">
                    <TestCases
                      testCases={testCases}
                      setTestCases={setTestCases}
                      onSubmit={handleSubmit}
                      loading={loading}
                    />
                  </TabsContent>
                  <TabsContent value="results">
                    <Results results={results} loading={loading} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)] w-full">
              <div className="h-full w-full">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={language}
                  setLanguage={setLanguage}
                  theme={theme}
                  setTheme={setTheme}
                />
              </div>
              <div className="h-full flex flex-col w-full">
                <TestCases
                  testCases={testCases}
                  setTestCases={setTestCases}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
                <div className="mt-6 flex-1">
                  <Results results={results} loading={loading} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
