"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Lock, Key, Palette, Bell, CreditCard, Copy, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 pb-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? "text-white" : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="settings-active-tab"
                  className="absolute inset-0 rounded-lg bg-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`relative z-10 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your personal information and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Full Name</label>
                    <Input defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Email Address</label>
                    <Input defaultValue="john@example.com" disabled />
                    <p className="text-xs text-muted">To change your email, please contact support.</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/5 pt-6 justify-end">
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "api-keys" && (
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for widget integration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-warning/20 bg-warning/10 p-4">
                    <p className="text-sm text-warning font-medium">Keep your API keys secret.</p>
                    <p className="text-xs text-warning/80 mt-1">Do not share your API keys in publicly accessible areas such as GitHub, client-side code, etc.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Production Key</label>
                    <div className="flex items-center gap-3">
                      <Input type="password" value="sk_live_1234567890abcdefghijklmnopqrstuvwxyz" readOnly className="font-mono text-muted" />
                      <Button variant="outline" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/5 pt-6 justify-end">
                  <Button variant="outline">Generate New Key</Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your billing and payment methods.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/10">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Pro Plan</h4>
                      <p className="text-xs text-primary mt-1">$49 / month</p>
                    </div>
                    <Button variant="glass" className="text-xs text-primary">Manage via Stripe</Button>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <h4 className="text-sm font-semibold text-white">Usage this month</h4>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-muted text-right">4,500 / 10,000 queries</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Placeholders for other tabs */}
            {["security", "appearance", "notifications"].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center p-12 border border-white/5 border-dashed rounded-xl bg-card/50">
                <Settings2 className="h-8 w-8 text-muted mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white">Under Construction</h3>
                <p className="text-sm text-muted text-center max-w-md mt-2">
                  This section is currently being updated to match the new design system.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Settings2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  )
}
