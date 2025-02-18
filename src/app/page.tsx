'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Brain, Download, Clock, Shield, Users } from "lucide-react";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-lg border bg-white hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Article Summarizer
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Button variant="ghost" onClick={handleSignIn}>Sign In</Button>
            <Button onClick={handleSignUp}>Get Started</Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero CTA */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Summarize Articles with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Save hours of reading time with AI-powered article summaries
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={handleSignUp}>
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleSignIn}>
                Try Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Everything You Need for Efficient Reading
              </h2>
              <p className="text-muted-foreground">
                Powerful features to help you consume content more effectively.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-purple-500" />}
                title="One-Click Summaries"
                description="Paste any URL and get an instant, well-structured summary powered by AI."
              />
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-purple-500" />}
                title="AI Editor"
                description="Refine summaries with AI assistance for perfect clarity and focus."
              />
              <FeatureCard
                icon={<Download className="h-8 w-8 text-purple-500" />}
                title="Easy Export"
                description="Download summaries in multiple formats for seamless integration."
              />
              <FeatureCard
                icon={<Clock className="h-8 w-8 text-purple-500" />}
                title="Save Time"
                description="Reduce reading time by 80% while retaining key insights."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-purple-500" />}
                title="Secure Storage"
                description="All your summaries are securely stored and easily accessible."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-purple-500" />}
                title="Team Sharing"
                description="Share summaries with team members for better collaboration."
              />
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Simple, Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Tier */}
              <div className="border rounded-lg p-8 bg-white">
                <h3 className="text-xl font-semibold mb-4">Free</h3>
                <p className="text-3xl font-bold mb-6">$0<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <Button className="w-full mb-6" onClick={handleSignUp}>Get Started</Button>
              </div>

              {/* Pro Tier */}
              <div className="border rounded-lg p-8 bg-white relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">Popular</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Pro</h3>
                <p className="text-3xl font-bold mb-6">$9<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <Button className="w-full mb-6" onClick={handleSignUp}>Get Started</Button>
              </div>

              {/* Team Tier */}
              <div className="border rounded-lg p-8 bg-white">
                <h3 className="text-xl font-semibold mb-4">Team</h3>
                <p className="text-3xl font-bold mb-6">$29<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <Button className="w-full mb-6" onClick={handleSignUp}>Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="text-xl font-bold flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
                Article Summarizer
              </Link>
              <p className="text-sm text-muted-foreground">
                Making content consumption efficient and effective.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Use Cases</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Article Summarizer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
