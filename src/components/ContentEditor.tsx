import React, { useState } from 'react';
import { EditorToolbar } from './EditorToolbar';

interface ContentEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

function ContentEditor({ initialContent, onSave }: ContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [content, setContent] = useState(initialContent);
  
  const handleEditClick = () => {
    if (isEditing) {
      onSave(content);
    }
    setIsEditing(!isEditing);
    setShowToolbar(!showToolbar);
  };

  return (
    <div className="relative min-h-[200px] p-4">
      <button 
        onClick={handleEditClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>

      {/* Content area */}
      <div className={`mt-4 p-4 border rounded ${isEditing ? 'border-blue-500' : 'border-gray-200'}`}>
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[200px] p-2 focus:outline-none"
          />
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>

      <EditorToolbar visible={showToolbar} />
    </div>
  );
}

export default ContentEditor; 