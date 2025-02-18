import React from 'react';

interface EditorToolbarProps {
  visible: boolean;
}

export function EditorToolbar({ visible }: EditorToolbarProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto max-w-2xl bg-white shadow-lg border border-gray-200 rounded-lg p-3">
      <div className="flex gap-2 justify-center items-center">
        <button className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 font-medium">
          Bold
        </button>
        <button className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 font-medium">
          Italic
        </button>
        <button className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 font-medium">
          Link
        </button>
      </div>
    </div>
  );
} 