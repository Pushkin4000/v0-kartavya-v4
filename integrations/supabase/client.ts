// Copy of the Supabase client for Next.js path resolution
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const SUPABASE_URL = "https://nrljqlsceajrpdcifknv.supabase.co"
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGpxbHNjZWFqcnBkY2lma252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5Mzk3MzEsImV4cCI6MjA2MTUxNTczMX0.2JbgfCdeyILjyAsJmYvAYngn6pp_kdhDu4OiqGDVKhw"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
