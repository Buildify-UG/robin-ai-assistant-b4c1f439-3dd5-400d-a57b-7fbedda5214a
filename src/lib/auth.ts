import { supabase, auth } from './supabase';
import { User } from '@/types';

export async function signUp(email: string, password: string, name: string) {
  try {
    const { data: authData, error: authError } = await auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name,
      language: 'en',
      dark_mode: false,
      notifications_enabled: true,
      memory_enabled: true,
    });

    if (profileError) throw profileError;

    return { user: authData.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { session: data.session, error: null };
  } catch (error) {
    return { session: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: sessionData } = await auth.getSession();
    if (!sessionData.session?.user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function updateUserProfile(updates: Partial<User>) {
  try {
    const { data: sessionData } = await auth.getSession();
    if (!sessionData.session?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', sessionData.session.user.id)
      .select()
      .single();

    if (error) throw error;
    return { user: data as User, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export async function onAuthStateChange(callback: (user: User | null) => void) {
  const { data } = auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });

  return data.subscription;
}
