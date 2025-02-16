"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { toPng } from "html-to-image"
import { toast } from "sonner"
import Markdown from "react-markdown"

interface SummaryDisplayProps {
  summary: string
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const summaryRef = useRef<HTMLDivElement>(null)

  async function downloadImage() {
    if (!summaryRef.current) return

    try {
      const dataUrl = await toPng(summaryRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        canvasWidth: summaryRef.current.scrollWidth,
        canvasHeight: summaryRef.current.scrollHeight
      })
      
      const link = document.createElement('a')
      link.download = 'summary.png'
      link.href = dataUrl
      link.click()
      
      toast.success("Summary downloaded successfully")
    } catch (err) {
      toast.error("Failed to download summary")
      console.error("[DOWNLOAD_ERROR]", err)
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
        className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[600px] mx-auto"
      >
        <div className="p-8">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Markdown
              components={{
                ul: ({ children }) => (
                  <ul className="space-y-2 list-none pl-0">
                    {children}
                  </ul>
                ),
                li: ({ children }) => {
                  const text = typeof children === 'string' ? children.split(':')[0] : children
                  return (
                    <li className="flex items-center gap-2 text-gray-800 text-sm leading-tight">
                      <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                      <span className="flex-1 text-[15px] font-semibold">
                        {text}
                      </span>
                    </li>
                  )
                }
              }}
            >
              {summary}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  )
}
