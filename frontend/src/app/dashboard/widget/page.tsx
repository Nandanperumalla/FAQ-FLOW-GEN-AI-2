"use client";

import { useEffect, useState } from "react";

export default function WidgetPage() {
  const [orgId, setOrgId] = useState<string>("loading...");

  useEffect(() => {
    // In a real app we'd fetch the user's org details here
    const token = localStorage.getItem("token");
    if (token) {
      // Decode JWT safely
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setOrgId(payload.sub || "demo");
      } catch {
        setOrgId("demo");
      }
    }
  }, []);

  const snippet = `<script 
  src="http://localhost:8000/widget/faqflow.js" 
  data-org-id="${orgId}">
</script>`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Embed Widget</h2>
        <p className="text-slate-400">Install the FAQFlow AI chatbot on your website.</p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-white mb-4">Installation</h3>
        <p className="text-slate-300 mb-6">
          Copy and paste the following script tag right before the closing <code>&lt;/body&gt;</code> tag of your website.
        </p>

        <div className="relative group">
          <pre className="bg-slate-900 text-slate-300 p-6 rounded-xl overflow-x-auto border border-slate-700 font-mono text-sm">
            {snippet}
          </pre>
          <button 
            onClick={() => navigator.clipboard.writeText(snippet)}
            className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
          >
            Copy Code
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-2">Customization (Pro Feature)</h3>
        <p className="text-slate-300 mb-4">
          Upgrade your plan to customize the chatbot's colors, branding, and initial greeting message.
        </p>
        <button className="bg-white text-blue-900 font-semibold px-6 py-2 rounded-full hover:bg-blue-50 transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
