"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

interface ResumeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "backend" | "web3"
}

export function ResumeModal({ open, onOpenChange, mode }: ResumeModalProps) {
  const [resumeUrl, setResumeUrl] = useState("/ShagbaorAgberResume.pdf")
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("resume_url").single()
      if (data?.resume_url) {
        setResumeUrl(data.resume_url)
      }
    }
    if (open) {
      fetchSettings()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[95vw] h-[95vh] p-0 gap-0 overflow-hidden border-2 flex flex-col"
        style={{
          borderColor: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 0 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        <DialogHeader
          className="px-6 py-4 border-b backdrop-blur-xl shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                }}
              >
                📄
              </div>
              Resume
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 relative overflow-hidden p-0 m-0" style={{ background: "oklch(0.15 0.015 240)" }}>
          <div
            className="w-full h-full border-0 block "
          >
            <iframe
              src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0"
              title="Shagbaor Agber Resume"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

