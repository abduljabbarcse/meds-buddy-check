import { User, Session } from "@supabase/supabase-js";

export type AuthContextType = {
    user: User | null;
    session: Session | null;
    role: "patient" | "caretaker" | null;
    isLoading: boolean;
    signUp: (
        email: string,
        password: string,
        name: string,
        role: "patient" | "caretaker"
    ) => Promise<{ error: string | null }>;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
};

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  proof_image_url?: string;
}