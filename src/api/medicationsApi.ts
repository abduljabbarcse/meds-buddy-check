import { Medication, MedicationFormData } from "@/schema/medication";
import { supabase } from "./supabase";

export const createMedication = async (data: MedicationFormData & { user_id: string }) => {
    const [hours, minutes] = data.time_of_day.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours));
    timeDate.setMinutes(parseInt(minutes));
    timeDate.setSeconds(0);

    const { data: result, error } = await supabase
        .from("medications")
        .insert([{
            ...data,
            time_of_day: timeDate.toISOString(),
        }])
        .select();

    if (error) throw error;
    return result[0];
};

export const fetchMedications = async (userId: string): Promise<Medication[]> => {
    const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(med => ({
        ...med,
        time_of_day: new Date(med.time_of_day).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
};
export const updateMedication = async (medication: Medication) => {
    const [hours, minutes] = medication.time_of_day.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours));
    timeDate.setMinutes(parseInt(minutes));
    timeDate.setSeconds(0);
    const { data, error } = await supabase
        .from("medications")
        .update({
            ...medication,
            time_of_day: timeDate.toISOString(),
        })
        .eq("id", medication.id)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    return data[0];
};

export const deleteMedication = async (id: string) => {
    const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
};