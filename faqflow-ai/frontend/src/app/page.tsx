import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-5xl text-center space-y-10 z-10">
        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4 backdrop-blur-md">
          ✨ The next generation of customer support
        </div>
        
        <h1 className="text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/50 to-muted">
          FAQFlow AI
        </h1>
        <p className="text-2xl text-muted font-light max-w-3xl mx-auto leading-relaxed">
          Instantly generate intelligent conversational support chatbots from your existing documentation.
        </p>
        
        <div className="flex gap-6 justify-center pt-8">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl backdrop-blur-md transition-all border-white/20 hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Floating Preview Widget Mockup */}
        <div className="mt-20 relative mx-auto max-w-4xl perspective-[1000px]">
          <div className="text-sm font-semibold text-muted uppercase tracking-widest mb-4">Live Preview Mockup</div>
          <div className="p-1 rounded-3xl bg-gradient-to-r from-primary/30 via-accent/30 to-success/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
            <div className="bg-card rounded-[22px] p-8 aspect-[21/9] flex flex-col items-center justify-center border border-white/10 relative overflow-hidden group">
              <div className="text-muted font-mono text-lg flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full backdrop-blur-sm border border-white/5 z-10 group-hover:scale-105 transition-transform cursor-default">
                <span className="w-3 h-3 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                Waiting for documents...
              </div>
              <p className="mt-4 text-sm text-muted/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                (Sign up and log in to access the real dashboard and upload documents!)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
