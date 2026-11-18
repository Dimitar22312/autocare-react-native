import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (isMounted) {
                setSession(newSession);
                setIsInitializing(false);
            }
        }
        );

        async function restoreSession() {
            try {
                const {data, error} = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (isMounted) {
                    setSession(data.session);
                }
            } catch (error) {
                console.error('Session Error:', error);
            } finally {
                if (isMounted) {
                    setIsInitializing(false);
                }
            }
        }

        restoreSession();

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    return { data, error };
}

    async function login(email, password) {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    async function logout() {
        return await supabase.auth.signOut();
    }

    const value = {
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isInitializing,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}