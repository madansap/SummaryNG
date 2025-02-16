"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { SummaryDisplay } from "./summary-display"

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL")
})

type FormValues = z.infer<typeof formSchema>

export function SummaryForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ""
    }
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: data.url })
      })
      
      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const { summary } = await response.json()
      setSummary(summary)
      
    } catch (error) {
      toast.error("Failed to generate summary")
      console.error("[SUMMARY_ERROR]", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Enter article URL"
          {...form.register("url")}
          disabled={isLoading}
        />
        {form.formState.errors.url && (
          <p className="text-sm text-red-500">
            {form.formState.errors.url.message}
          </p>
        )}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Summary"}
        </Button>
      </form>

      {summary && <SummaryDisplay summary={summary} />}
    </div>
  )
} 