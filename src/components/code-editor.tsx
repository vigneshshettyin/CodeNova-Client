import { useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  theme,
  setTheme,
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    setLanguage(language);
    setCode(code);
  }, [code, language, setCode, setLanguage]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: () => {
        const suggestions: monaco.languages.CompletionItem[] = [
          {
            label: "def",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "def ${1:function_name}(${2:parameters}):\n\t${3:pass}",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Define a new function",
            range: new monaco.Range(1, 1, 1, 1),
          },
          {
            label: "class",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
              "class ${1:ClassName}:\n\tdef __init__(self, ${2:parameters}):\n\t\t${3:pass}",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Define a new class",
            range: new monaco.Range(1, 1, 1, 1),
          },
          {
            label: "if",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "if ${1:condition}:\n\t${2:pass}",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "If statement",
            range: new monaco.Range(1, 1, 1, 1),
          },
          {
            label: "print",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "print(${1:object})",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Print to standard output",
            range: new monaco.Range(1, 1, 1, 1),
          },
        ];
        return { suggestions };
      },
    });
  };

  return (
    <Card className="h-full flex flex-col w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Code Editor</CardTitle>
          <div className="flex gap-2">
            <div>
              <Label htmlFor="language-select" className="text-xs mb-1 block">
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language-select" className="w-[140px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="theme-select" className="text-xs mb-1 block">
                Theme
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select" className="w-[140px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vs-dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="hc-black">High Contrast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            scrollBeyondLastLine: false,
          }}
        />
      </CardContent>
    </Card>
  );
}
