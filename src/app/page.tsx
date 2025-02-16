import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Article Summarizer
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center gap-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Summarize Articles with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Transform long articles into concise, easy-to-digest summaries.
          </p>
          <Link href="/dashboard">
            <Button size="lg">Try for Free</Button>
          </Link>
        </section>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-muted/50">
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI-Powered Summaries"
              description="Advanced AI technology extracts the most important information from any article."
            />
            <FeatureCard 
              title="Multiple Export Options"
              description="Export your summaries in different formats and aspect ratios for easy sharing."
            />
            <FeatureCard 
              title="Fast & Accurate"
              description="Get concise summaries in seconds without losing crucial information."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          © 2024 Article Summarizer. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
