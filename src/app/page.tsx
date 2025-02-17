import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen" data-oid="e2obry:">
      {/* Header */}
      <header className="border-b" data-oid="qi:ypno">
        <div
          className="container mx-auto px-4 h-16 flex items-center justify-between"
          data-oid="obj9p7."
        >
          <Link href="/" className="text-xl font-bold" data-oid="6cxk3jx">
            Article Summarizer
          </Link>
          <Link href="/dashboard" data-oid="mbm9l9x">
            <Button data-oid="05e8iyn">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1" data-oid="y1548pg">
        <section
          className="container mx-auto px-4 py-24 flex flex-col items-center text-center gap-8"
          data-oid="yui0jbk"
        >
          <h1 className="text-5xl font-bold tracking-tight" data-oid="jgm8xsi">
            Summarize Articles with AI
          </h1>
          <p
            className="text-xl text-muted-foreground max-w-2xl"
            data-oid="smxgm7u"
          >
            Transform long articles into concise, easy-to-digest summaries.
          </p>
          <Link href="/dashboard" data-oid="0ji.ofx">
            <Button size="lg" data-oid="pysi94x">
              Try for Free
            </Button>
          </Link>
        </section>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-muted/50" data-oid="_uq.1zt">
        <div className="container mx-auto px-4 py-24" data-oid="aj97e_5">
          <h2
            className="text-3xl font-bold text-center mb-12"
            data-oid="b4vjwp1"
          >
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8" data-oid="hf4e_7u">
            <FeatureCard
              title="AI-Powered Summaries"
              description="Advanced AI technology extracts the most important information from any article."
              data-oid="mf.d:m5"
            />

            <FeatureCard
              title="Multiple Export Options"
              description="Export your summaries in different formats and aspect ratios for easy sharing."
              data-oid="dssw6hw"
            />

            <FeatureCard
              title="Fast & Accurate"
              description="Get concise summaries in seconds without losing crucial information."
              data-oid="40g5yu3"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" data-oid="4kkm5j2">
        <div
          className="container mx-auto px-4 py-8 text-center text-muted-foreground"
          data-oid="nsbq:9z"
        >
          © 2024 Article Summarizer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card" data-oid=":0k749:">
      <h3 className="text-xl font-semibold mb-2" data-oid="68pe0p0">
        {title}
      </h3>
      <p className="text-muted-foreground" data-oid="8tl5dsp">
        {description}
      </p>
    </div>
  );
}
