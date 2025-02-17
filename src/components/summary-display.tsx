"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import Markdown from "react-markdown";
import {
  Edit3, X, Download, Save,
  Bold, Italic, List, Heading1, Minus,
  Quote, Link2, Undo, Redo, 
  ListOrdered, Heading2, Code
} from "lucide-react";

interface SummaryDisplayProps {
  summary: string;
  onUpdate?: (newSummary: string) => void;
}

export function SummaryDisplay({ summary: initialSummary, onUpdate }: SummaryDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(initialSummary);
  const containerRef = useRef<HTMLDivElement>(null);

  async function handleAiEdit() {
    if (!aiPrompt.trim()) {
      toast.error("Please enter your editing request");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/edit-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: content,
          prompt: aiPrompt,
        }),
      });

      if (!response.ok) throw new Error("Failed to edit summary");

      const { updatedSummary } = await response.json();
      setContent(updatedSummary);
      onUpdate?.(updatedSummary);
      setAiPrompt("");
      toast.success("Summary updated successfully");
    } catch (error) {
      toast.error("Failed to edit summary");
      console.error("[EDIT_ERROR]", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function downloadImage() {
    if (!containerRef.current) return;

    try {
      const dataUrl = await toPng(containerRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = "summary.png";
      link.href = dataUrl;
      link.click();

      toast.success("Summary downloaded successfully");
    } catch (err) {
      toast.error("Failed to download summary");
      console.error("[DOWNLOAD_ERROR]", err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <><X className="h-4 w-4 mr-2" /> Done Editing</>
          ) : (
            <><Edit3 className="h-4 w-4 mr-2" /> Edit Content</>
          )}
        </Button>

        <Button onClick={downloadImage}>
          <Download className="h-4 w-4 mr-2" /> Download
        </Button>
      </div>

      <div
        ref={containerRef}
        className={`bg-white rounded-lg shadow-lg p-6 mx-auto ${
          isEditing ? 'border-2 border-primary' : ''
        }`}
      >
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onUpdate?.(e.target.value);
            }}
            className="w-full min-h-[300px] p-4 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ) : (
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-3 text-gray-900">
                  {children}
                </h1>
              ),
              p: ({ children }) => (
                <p className="text-base text-gray-600 mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-3 list-none pl-0">
                  {children}
                </ul>
              ),
              li: ({ children }) => {
                const [point, explanation] = typeof children === 'string' 
                  ? children.split(':').map(part => part.trim())
                  : [children, ''];
                
                return (
                  <li className="flex gap-3 text-gray-800 items-start">
                    <span className="text-gray-400 select-none mt-1">•</span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">{point}</span>
                      {explanation && (
                        <span className="text-gray-600 font-normal">
                          : {explanation}
                        </span>
                      )}
                    </div>
                  </li>
                );
              },
            }}
          >
            {content}
          </Markdown>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask AI to make changes (e.g., 'Make the explanations shorter')"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border"
        />
        <Button 
          onClick={handleAiEdit} 
          disabled={isLoading}
        >
          {isLoading ? (
            "Updating..."
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Apply AI Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
