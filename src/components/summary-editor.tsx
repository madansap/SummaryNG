"use client";

import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  List,
  Undo,
  Redo,
} from "lucide-react";

interface SummaryEditorProps {
  summary: string;
  onUpdate: (newSummary: string) => void;
}

export function SummaryEditor({ summary, onUpdate }: SummaryEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: summary,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
  });

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
          summary: editor?.getHTML(),
          prompt: aiPrompt,
        }),
      });

      if (!response.ok) throw new Error("Failed to edit summary");

      const { updatedSummary } = await response.json();
      editor?.commands.setContent(updatedSummary);
      setAiPrompt("");
      toast.success("Summary updated successfully");
    } catch (error) {
      toast.error("Failed to edit summary");
      console.error("[EDIT_ERROR]", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!editor) return null;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            setIsEditing(!isEditing);
            editor.setEditable(!isEditing);
          }}
        >
          {isEditing ? "Done Editing" : "Edit Content"}
        </Button>

        {isEditing && (
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-muted' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-muted' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className={`prose prose-sm max-w-none ${isEditing ? 'border rounded-lg p-4' : ''}`}>
        <EditorContent editor={editor} />
      </div>

      {!isEditing && (
        <div className="space-y-4">
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
              className="whitespace-nowrap"
            >
              {isLoading ? "Updating..." : "Ask AI to Edit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 