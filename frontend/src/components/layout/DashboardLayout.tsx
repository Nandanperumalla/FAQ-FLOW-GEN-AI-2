import React from "react"
import { Sidebar } from "./Sidebar"
import { TopNavbar } from "./TopNavbar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
