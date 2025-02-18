"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { toPng } from 'html-to-image';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Minus, Undo, Redo } from 'lucide-react';

interface Summary {
  id: string;
  title: string;
  content: string;
  url: string;
}

interface EditResponse {
  updatedSummary: string;
}

export function SummaryForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        toast.error("Please enter a valid http or https URL");
        return;
      }
    } catch (_err: unknown) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to generate summary");
      }

      const data = await response.json();
      if (!data) {
        throw new Error("No data received from the server");
      }

      setSummary(data as Summary);
      setUrl(""); // Clear the input after successful summary
      toast.success("Summary generated successfully!");
    } catch (error) {
      console.error("[SUMMARIZE_ERROR]", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate summary";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownload = async () => {
    if (!containerRef.current) return;
    
    try {
      // Find the summary-content div
      const summaryContent = containerRef.current.querySelector('.summary-content');
      
      if (!summaryContent) {
        throw new Error('Summary content not found');
      }

      const dataUrl = await toPng(summaryContent as HTMLElement, {
        quality: 1.0,
        pixelRatio: 2,
        width: (summaryContent as HTMLElement).offsetWidth + 48, // Add padding
        height: (summaryContent as HTMLElement).offsetHeight + 48, // Add padding
        style: {
          padding: '24px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transform: 'scale(1)', // Ensure proper rendering
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
          summary: summary?.content,
          prompt: aiPrompt,
        }),
      });

      if (!response.ok) throw new Error("Failed to edit summary");

      const data = await response.json() as EditResponse;
      setSummary({ ...summary!, content: data.updatedSummary });
      setAiPrompt("");
      toast.success("Summary updated successfully");
    } catch (error) {
      toast.error("Failed to edit summary");
      console.error("[EDIT_ERROR]", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleContentChange = () => {
    const selection = document.getSelection();
    const range = selection?.getRangeAt(0);
    
    const summaryContent = containerRef.current?.querySelector('.summary-content') as HTMLElement;
    if (summaryContent) {
      setUndoStack((prev: string[]) => [...prev, summaryContent.innerHTML]);
      setRedoStack([]);
      setIsEdited(true);
      
      if (range && summaryContent.contains(range.commonAncestorContainer)) {
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const handleSaveChanges = () => {
    if (!containerRef.current) return;
    
    const summaryContent = containerRef.current.querySelector('.summary-content');
    if (!summaryContent) return;

    const updatedContent = summaryContent.innerHTML;
    
    setSummary((prev: Summary | null) => prev ? { ...prev, content: updatedContent } : null);
    setIsEdited(false);
    toast.success("Changes saved successfully");
  };

  const handleContentClick = () => {
    // Focus the content div when clicked
    const summaryContent = containerRef.current?.querySelector('.summary-content');
    if (summaryContent) {
      (summaryContent as HTMLElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    if (!range) return;

    const pointContainer = range.commonAncestorContainer.parentElement?.closest('.point-container');
    const editableSpan = pointContainer?.querySelector('[contenteditable="true"]') as HTMLElement;
    
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (pointContainer) {
        // Get the current text content and cursor position
        const text = editableSpan?.textContent || '';
        const cursorPosition = selection.anchorOffset;
        
        // Create new bullet point with the same structure
        const newPoint = document.createElement('div');
        newPoint.className = 'point-container group';
        newPoint.innerHTML = `
          <div class="flex items-baseline">
            <span class="text-[#333] mr-2">•</span>
            <div class="flex-1">
              <span class="text-[15px] outline-none" contenteditable="true"></span>
            </div>
          </div>
        `;
        
        // If Enter is pressed in the middle of text, split the content
        if (cursorPosition < text.length) {
          const beforeText = text.substring(0, cursorPosition);
          const afterText = text.substring(cursorPosition);
          
          editableSpan.textContent = beforeText;
          const newEditableSpan = newPoint.querySelector('[contenteditable="true"]') as HTMLElement;
          if (newEditableSpan) {
            newEditableSpan.textContent = afterText;
          }
        }
        
        pointContainer.insertAdjacentElement('afterend', newPoint);
        
        // Focus the new bullet point
        const newEditableSpan = newPoint.querySelector('[contenteditable="true"]') as HTMLElement;
        if (newEditableSpan) {
          newEditableSpan.focus();
          // If splitting text, place cursor at start, else at end
          const newRange = document.createRange();
          newRange.selectNodeContents(newEditableSpan);
          newRange.collapse(cursorPosition >= text.length);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        
        setIsEdited(true);
        handleContentChange();
      }
    }
    
    // Handle Backspace key
    if (e.key === 'Backspace') {
      if (!editableSpan) return;
      
      // Get the current cursor position
      const cursorPosition = selection.anchorOffset;
      const text = editableSpan.textContent || '';
      
      // If at start of bullet point
      if (cursorPosition === 0) {
        // Don't delete if it's the first bullet point and has content
        const prevPoint = pointContainer?.previousElementSibling;
        if (!prevPoint?.classList.contains('point-container')) {
          if (text.length > 0) {
            e.preventDefault();
          }
          return;
        }
        
        // If current point is empty, merge with previous point
        if (text.trim() === '') {
          e.preventDefault();
          
          const prevEditableSpan = prevPoint.querySelector('[contenteditable="true"]') as HTMLElement;
          if (!prevEditableSpan) return;
          
          // Move cursor to the end of previous bullet point
          const newRange = document.createRange();
          newRange.selectNodeContents(prevEditableSpan);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Remove the empty bullet point
          pointContainer?.remove();
          setIsEdited(true);
          handleContentChange();
        }
        // If current point has content, merge with previous point
        else {
          e.preventDefault();
          
          const prevEditableSpan = prevPoint.querySelector('[contenteditable="true"]') as HTMLElement;
          if (!prevEditableSpan) return;
          
          const prevText = prevEditableSpan.textContent || '';
          const currentText = editableSpan.textContent || '';
          
          // Combine the text
          prevEditableSpan.textContent = prevText + currentText;
          
          // Move cursor to the merge point
          const newRange = document.createRange();
          newRange.selectNodeContents(prevEditableSpan);
          newRange.setStart(prevEditableSpan.firstChild || prevEditableSpan, prevText.length);
          newRange.setEnd(prevEditableSpan.firstChild || prevEditableSpan, prevText.length);
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Remove the merged bullet point
          pointContainer?.remove();
          setIsEdited(true);
          handleContentChange();
        }
      }
    }

    // Handle Delete key
    if (e.key === 'Delete') {
      if (!editableSpan) return;
      
      const cursorPosition = selection.anchorOffset;
      const text = editableSpan.textContent || '';
      
      // If at end of bullet point
      if (cursorPosition === text.length) {
        const nextPoint = pointContainer?.nextElementSibling;
        if (!nextPoint?.classList.contains('point-container')) return;
        
        e.preventDefault();
        
        const nextEditableSpan = nextPoint.querySelector('[contenteditable="true"]') as HTMLElement;
        if (!nextEditableSpan) return;
        
        // Merge with next bullet point
        const currentText = text;
        const nextText = nextEditableSpan.textContent || '';
        
        editableSpan.textContent = currentText + nextText;
        
        // Keep cursor at merge point
        const newRange = document.createRange();
        newRange.selectNodeContents(editableSpan);
        newRange.setStart(editableSpan.firstChild || editableSpan, currentText.length);
        newRange.setEnd(editableSpan.firstChild || editableSpan, currentText.length);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // Remove the merged bullet point
        nextPoint.remove();
        setIsEdited(true);
        handleContentChange();
      }
    }

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!pointContainer || !editableSpan) return;
      
      // Shift+Tab decreases indentation
      if (e.shiftKey) {
        const currentIndent = parseInt((pointContainer as HTMLElement).style.marginLeft || '0');
        if (currentIndent >= 20) {
          (pointContainer as HTMLElement).style.marginLeft = `${currentIndent - 20}px`;
          setIsEdited(true);
          handleContentChange();
        }
      }
      // Tab increases indentation
      else {
        const currentIndent = parseInt((pointContainer as HTMLElement).style.marginLeft || '0');
        (pointContainer as HTMLElement).style.marginLeft = `${currentIndent + 20}px`;
        setIsEdited(true);
        handleContentChange();
      }
    }
  };

  const handleFormatText = (command: string, value?: string) => {
    // Save the current selection
    const selection = document.getSelection();
    if (!selection?.rangeCount) return;
    
    // Get the editable content element
    const summaryContent = containerRef.current?.querySelector('.summary-content') as HTMLElement;
    if (!summaryContent) return;
    
    // Focus the content area if not already focused
    if (!summaryContent.contains(selection.anchorNode)) {
      summaryContent.focus();
    }
    
    // Apply the formatting command
    document.execCommand(command, false, value);
    
    // Save the change to undo stack
    setUndoStack(prev => [...prev, summaryContent.innerHTML]);
    // Clear redo stack on new changes
    setRedoStack([]);
    
    setIsEdited(true);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const currentState = containerRef.current?.querySelector('.summary-content')?.innerHTML;
    if (!currentState) return;
    
    // Save current state to redo stack
    setRedoStack(prev => [...prev, currentState]);
    
    // Pop the last state from undo stack
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    // Apply the previous state
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
    
    // Save current state to undo stack
    setUndoStack(prev => [...prev, currentState]);
    
    // Pop the last state from redo stack
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    
    // Apply the next state
    const summaryContent = containerRef.current?.querySelector('.summary-content');
    if (summaryContent) {
      summaryContent.innerHTML = nextState;
      setIsEdited(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleAiPromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAiPrompt(e.target.value);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="url"
          placeholder="Enter article url"
          value={url}
          onChange={handleInputChange}
          className="flex-1 h-12 px-4 text-base bg-white border rounded-lg"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-12 px-6 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </Button>
      </form>

      {/* Quick Tips */}
      {!summary && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Works best with article URLs from major news and blog sites</li>
            <li>• Ensure the article is publicly accessible</li>
            <li>• For best results, use direct article links</li>
          </ul>
        </div>
      )}

      {summary && (
        <div className="mt-8" ref={containerRef}>
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
          <div 
            className="bg-white rounded-lg mt-1"
          >
            <div className="p-6">
              <div 
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentChange}
                onClick={handleContentClick}
                onKeyDown={handleKeyDown}
                className="summary-content prose prose-sm max-w-none outline-none min-h-[200px]"
                ref={(element) => {
                  if (element && !element.innerHTML && summary?.content) {
                    element.innerHTML = summary.content;
                  }
                }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Input
              type="text"
              placeholder="Ask AI to make changes (e.g., 'Make it shorter')"
              value={aiPrompt}
              onChange={handleAiPromptChange}
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
      )}
    </div>
  );
}
