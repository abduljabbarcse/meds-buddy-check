import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/api/supabase";

export const usePatients = () => {
    const { user, role } = useAuth();

    return useQuery({
        queryKey: ["patients", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            if (role === "caretaker") {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("role", "patient");

                if (error) throw error;
                console.log(data)
                return data || [];
            }

            else { return [] }
        },
        enabled: !!user?.id,
    });
};