"use client"

import { useState, useEffect } from "react"
import { Download04Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { buttonQuiet } from "@/components/section"

interface ResumeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "backend" | "web3"
}

export function ResumeModal({ open, onOpenChange }: ResumeModalProps) {
  const [resumeUrl, setResumeUrl] = useState("/ShagbaorAgberResume.pdf")

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createBrowserSupabaseClient()
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
      <DialogContent className="flex h-[90dvh] max-w-[95vw] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-5xl">
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-border py-3 pr-12 pl-6 text-left">
          <div>
            <DialogTitle className="text-base font-semibold">Resume</DialogTitle>
            <DialogDescription className="text-sm">Shagbaor Agber, PDF</DialogDescription>
          </div>
          <a href={resumeUrl} download className={buttonQuiet + " text-sm"}>
            <Icon icon={Download04Icon} size={16} />
            Download
          </a>
        </DialogHeader>

        <iframe
          src={`${resumeUrl}#toolbar=0&navpanes=0`}
          className="w-full flex-1 border-0 bg-secondary"
          title="Shagbaor Agber resume"
        />
      </DialogContent>
    </Dialog>
  )
}
