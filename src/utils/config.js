import { createClient } from '@supabase/supabase-js'

export const config = {
    SUPABASE_URL: "https://vajgjcypgtvjqbwduhmi.supabase.co",
    REACT_APP_SUPABASE_ANON_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhamdqY3lwZ3R2anFid2R1aG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzMDIxNjgsImV4cCI6MjAxNDg3ODE2OH0.anO9iJJjOnUoo4q6lrGc-69bEX5pN9SmIhfX_NMYC1w"
}

export const supabase = createClient(config.SUPABASE_URL, config.REACT_APP_SUPABASE_ANON_KEY)