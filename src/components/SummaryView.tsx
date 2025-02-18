'use client';

import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Minus, Undo, Redo } from 'lucide-react';

interface SummaryViewProps {
  summary: {
    id: string;
    content: string;
    title: string;
    url: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface EditResponse {
  updatedSummary: string;
}

export function SummaryView({ summary }: SummaryViewProps) {
  const [content, setContent] = useState(summary.content);
  const [isEdited, setIsEdited] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!containerRef.current) return;
    
    try {
      const summaryContent = containerRef.current.querySelector('.summary-content');
      
      if (!summaryContent) {
        throw new Error('Summary content not found');
      }

      const dataUrl = await toPng(summaryContent as HTMLElement, {
        quality: 1.0,
        pixelRatio: 2,
        width: (summaryContent as HTMLElement).offsetWidth + 48,
        height: (summaryContent as HTMLElement).offsetHeight + 48,
        style: {
          padding: '24px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      const link = document.createElement("a");
      link.download = `summary-${new Date().toISOString()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("Summary downloaded successfully");
    } catch (err) {
      toast.error("Failed to download summary");
      console.error("[DOWNLOAD_ERROR]", err);
    }
  };

  const handleContentChange = () => {
    const selection = document.getSelection();
    const range = selection?.getRangeAt(0);
    
    const summaryContent = containerRef.current?.querySelector('.summary-content') as HTMLElement;
    if (summaryContent) {
      setUndoStack(prev => [...prev, summaryContent.innerHTML]);
      setRedoStack([]);
      setIsEdited(true);
      
      if (range && summaryContent.contains(range.commonAncestorContainer)) {
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!containerRef.current) return;
    
    const summaryContent = containerRef.current.querySelector('.summary-content');
    if (!summaryContent) return;

    const updatedContent = summaryContent.innerHTML;
    
    try {
      const response = await fetch(`/api/summaries/${summary.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!response.ok) throw new Error('Failed to save changes');

      setContent(updatedContent);
      setIsEdited(false);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      console.error("[SAVE_ERROR]", error);
    }
  };

  const handleAiEdit = async () => {
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

      const data = await response.json() as EditResponse;
      setContent(data.updatedSummary);
      setAiPrompt("");
      toast.success("Summary updated successfully");
    } catch (error) {
      toast.error("Failed to edit summary");
      console.error("[EDIT_ERROR]", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatText = (command: string, value?: string) => {
    const selection = document.getSelection();
    if (!selection?.rangeCount) return;
    
    const summaryContent = containerRef.current?.querySelector('.summary-content') as HTMLElement;
    if (!summaryContent) return;
    
    if (!summaryContent.contains(selection.anchorNode)) {
      summaryContent.focus();
    }
    
    document.execCommand(command, false, value);
    
    setUndoStack(prev => [...prev, summaryContent.innerHTML]);
    setRedoStack([]);
    setIsEdited(true);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const currentState = containerRef.current?.querySelector('.summary-content')?.innerHTML;
    if (!currentState) return;
    
    setRedoStack(prev => [...prev, currentState]);
    
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    const summaryContent = containerRef.current?.querySelector('.summary-content');
    if (summaryContent) {
      summaryContent.innerHTML = previousState;
      setIsEdited(true);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const currentState = containerRef.current?.querySelector('.summary-content')?.innerHTML;
    if (!currentState) return;
    
    setUndoStack(prev => [...prev, currentState]);
    
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    
    const summaryContent = containerRef.current?.querySelector('.summary-content');
    if (summaryContent) {
      summaryContent.innerHTML = nextState;
      setIsEdited(true);
    }
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center gap-1 sticky top-0 z-10">
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <Button
            onClick={() => handleFormatText('bold')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleFormatText('italic')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleFormatText('underline')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <Button
            onClick={() => handleFormatText('justifyLeft')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleFormatText('justifyCenter')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleFormatText('justifyRight')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <Button
            onClick={() => handleFormatText('insertUnorderedList')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleFormatText('insertOrderedList')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleFormatText('insertHorizontalRule')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Horizontal Line"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            onClick={handleUndo}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Undo"
            disabled={undoStack.length === 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleRedo}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1 hover:bg-gray-100"
            title="Redo"
            disabled={redoStack.length === 0}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg mt-1">
        <div className="p-6">
          <div 
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            className="summary-content prose prose-sm max-w-none outline-none min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Input
          type="text"
          placeholder="Ask AI to make changes (e.g., 'Make it shorter')"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="flex-1 h-12 px-4 text-base bg-white border rounded-lg"
        />
        <Button
          onClick={handleAiEdit}
          disabled={isLoading}
          className="h-12 px-6 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          Ask AI
        </Button>
        {isEdited && (
          <Button
            onClick={handleSaveChanges}
            className="h-12 px-6 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </Button>
        )}
        <Button
          onClick={handleDownload}
          className="h-12 px-6 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          Download
        </Button>
      </div>
    </div>
  );
} 