import { supabase } from '../config/supabase'
import type { VerifiedIdentity } from '../types'

// Supabase Auth handles the Google sign-in. This asks it who an access token belongs to.
export const identityRepository = {
  /** The person a Supabase access token was issued to, or null when the token is invalid or expired. */
  async findByAccessToken(accessToken: string): Promise<VerifiedIdentity | null> {
    const { data, error } = await supabase.auth.getUser(accessToken)
    const user = data.user
    if (error || !user?.email) return null

    const fullName: unknown = user.user_metadata?.full_name
    return {
      id: user.id,
      email: user.email,
      name: typeof fullName === 'string' && fullName ? fullName : null,
    }
  },
}
