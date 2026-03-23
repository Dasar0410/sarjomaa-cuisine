import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import supabase from "../api/supabase"
import {Session } from "@supabase/supabase-js";

interface AuthContextType {
    //currentUser: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<{success: boolean; error?: string}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;

}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { 
            setSession(session);
        })

        return () => subscription.unsubscribe() // Add cleanup!
    }, []);
            

    // Sign Up
    const signUp = async (username: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: username
                }
            }
        });

        if (error) {
            console.error("Error signing up:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true, data };
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if(error) {
            console.error("Error signing in", error.message)
            return { success: false, error: error.message };
        }
        return { success: true, data };
    }

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) {
            console.error("Error signing in with Google:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true };
    }

    const signOut = async () => {
        const {error} = await supabase.auth.signOut()

        if(error){
            console.error("Error signing out", error.message)
            return { success: false, error: error.message }
        }

        return { success: true};
    }

    return (
        <AuthContext.Provider value={{ session, loading, signUp, signIn, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};



export const UserAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('UserAuth must be used within an AuthContextProvider');
    }
    return context;
};