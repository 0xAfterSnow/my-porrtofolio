"use server"

import { revalidateTag } from "next/cache"

export async function flushSettingsCache() {
    revalidateTag("site_settings")
    return { success: true }
}
