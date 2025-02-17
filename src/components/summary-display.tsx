"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import Markdown from "react-markdown";

interface SummaryDisplayProps {
  summary: string;
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const summaryRef = useRef<HTMLDivElement>(null);

  async function downloadImage() {
    if (!summaryRef.current) return;

    try {
      const padding = 16; // Consistent 16px padding
      const width = summaryRef.current.offsetWidth;
      const height = summaryRef.current.offsetHeight;

      const dataUrl = await toPng(summaryRef.current, {
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
      <div className="flex justify-end">
        <Button onClick={downloadImage}>
          Download
        </Button>
      </div>

      <div
        ref={summaryRef}
        className="bg-white rounded-lg shadow-lg p-6 mx-auto"
        style={{
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
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
            {summary}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
