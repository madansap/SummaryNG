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
        pixelRatio: 2
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
        className="bg-white rounded-lg shadow overflow-hidden"
        style={{
          aspectRatio: "4/5",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto"
        }}
      >
        <div className="p-12">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Markdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">
                    {children}
                  </h1>
                ),
                p: ({ children }) => (
                  <p className="text-lg text-gray-600 mb-6 font-normal leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-5 list-none pl-0">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start space-x-3 text-gray-700">
                    <span className="block w-1.5 h-1.5 mt-2.5 rounded-full bg-gray-300 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      {typeof children === 'string' 
                        ? children.split(':').map((part, i) => (
                            <span key={i} className={i === 0 ? 'font-semibold' : 'font-normal'}>
                              {i > 0 ? ':' : ''}{part}
                            </span>
                          ))
                        : children}
                    </span>
                  </li>
                ),
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