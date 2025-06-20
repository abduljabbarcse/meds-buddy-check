import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { AuthContextType } from "@/lib/types";
import { Session, User } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);

    const [session, setSession] = useState<Session | null>(null);

    const [role, setRole] = useState<"patient" | "caretaker" | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                if (error) throw error;


                if (session?.user) {
                    const { data: profile, error: profileError } = await supabase
                        .from("profiles")
                        .select("role")
                        .eq("id", session.user.id)
                        .single();

                    if (profileError) throw profileError;

                    setRole(profile?.role as "patient" | "caretaker" | null);
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {

            const handleAuthChange = async () => {
                if (session?.user) {
                    try {
                        const { data: profile, error } = await supabase
                            .from("profiles")
                            .select("role")
                            .eq("id", session.user.id)
                            .single();

                        if (error) throw error;

                        setRole(profile?.role as "patient" | "caretaker" | null);
                        setSession(session);
                        setUser(session.user);
                    } catch (error) {
                        console.error("Error fetching profile after auth change:", error);
                    } finally {
                        setIsLoading(false);
                    }
                } else {
                    setIsLoading(false);
                }
            };

            handleAuthChange();
        });


        return () => {
            subscription.unsubscribe();
        };
    }, []);


    const signUp = async (email: string, password: string, name: string, role: "patient" | "caretaker"): Promise<{ error: string | null }> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name },
                },
            });

            if (error) throw error;

            if (data.user) {
                const { error: profileError } = await supabase.from("profiles").insert({
                    id: data.user.id,
                    email,
                    name,
                    role,
                });

                if (profileError) throw profileError;
            }

            return { error: null };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Signup failed";
            return { error: errorMessage };
        }
    };

    const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Login failed";
            return { error: errorMessage };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setSession(null);
            setUser(null);
            setRole(null);

        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, session, role, isLoading, signUp, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
