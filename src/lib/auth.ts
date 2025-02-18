import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getSession() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUserId() {
  const session = await getSession();
  return session?.user?.id;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  
  return {
    id: session.user.id,
    email: session.user.email,
  };
} 