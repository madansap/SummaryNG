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
}

export function SummaryDisplay({ summary: initialSummary }: SummaryDisplayProps) {
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
      const padding = 16;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      const dataUrl = await toPng(containerRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        width,
        height,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          padding: `${padding}px`,
          backgroundColor: 'white',
        }
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
        style={{
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {isEditing && (
          <div className="flex items-center gap-2 border rounded-lg p-1 bg-white shadow-sm mb-4">
            <Button
              variant="ghost"
              size="sm"
              title="Bold"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end);
                  setContent(`${before}**${selection}**${after}`);
                }
              }}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Italic"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end);
                  setContent(`${before}_${selection}_${after}`);
                }
              }}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Code"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end);
                  setContent(`${before}\`${selection}\`${after}`);
                }
              }}
            >
              <Code className="h-4 w-4" />
            </Button>

            <div className="h-4 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              title="Bullet List"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const after = text.substring(start);
                  setContent(`${before}\n• ${after}`);
                }
              }}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Numbered List"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const after = text.substring(start);
                  setContent(`${before}\n1. ${after}`);
                }
              }}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>

            <div className="h-4 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              title="Heading 1"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const after = text.substring(start);
                  setContent(`${before}\n# ${after}`);
                }
              }}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Heading 2"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const after = text.substring(start);
                  setContent(`${before}\n## ${after}`);
                }
              }}
            >
              <Heading2 className="h-4 w-4" />
            </Button>

            <div className="h-4 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              title="Blockquote"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const after = text.substring(start);
                  setContent(`${before}\n> ${after}`);
                }
              }}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Link"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end);
                  setContent(`${before}[${selection}](url)${after}`);
                }
              }}
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Horizontal Rule"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const after = text.substring(start);
                  setContent(`${before}\n---\n${after}`);
                }
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="h-4 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              title="Undo"
              onClick={() => {
                document.execCommand('undo');
              }}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Redo"
              onClick={() => {
                document.execCommand('redo');
              }}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        )}
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
