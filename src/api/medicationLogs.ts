import { MedicationLog } from "@/lib/types";
import { supabase } from "./supabase";
import { Medication } from "@/schema/medication";

export const logMedicationIntake = async (
    medicationId: string,
    userId: string,
    imageFile?: File
): Promise<MedicationLog> => {
    let proofUrl = null;

    if (imageFile) {
        const filePath = `proofs/${medicationId}_${Date.now()}`;
        const { data, error } = await supabase.storage
            .from("medication-proofs")
            .upload(filePath, imageFile);

        if (error) throw error;
        proofUrl = data.path;
    }

    const { data, error } = await supabase
        .from("medication_logs")
        .insert([
            {
                medication_id: medicationId,
                user_id: userId,
                taken_at: new Date().toISOString(),
                proof_image_url: proofUrl,
            },
        ])
        .select();

    if (error) throw error;
    return data[0];
};

export const fetchMedicationLogs = async (
    userId: string,
    date: Date
): Promise<MedicationLog[]> => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("taken_at", start.toISOString())
        .lte("taken_at", end.toISOString());

    if (error) throw error;
    return data;
};

export const calculateAdherence = async (
    patientId: string
): Promise<{ adherenceRate: number; streak: number }> => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all scheduled medications in the last 30 days
    const { data: medications, error: medError } = await supabase
        .from("medications")
        .select("*")
        .eq("patient_id", patientId)
        .gte("time_of_day", thirtyDaysAgo.toISOString());

    // Get all logs in the last 30 days
    const { data: logs, error: logError } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", patientId)
        .gte("taken_at", thirtyDaysAgo.toISOString());

    if (medError || logError) {
        throw new Error("Failed to calculate adherence");
    }

    const totalMeds = medications.length;
    const takenMeds = logs.length;
    const adherenceRate =
        totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

    // Calculate current streak
    let streak = 0;
    const currentDate = new Date();
    while (true) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const hasLog = logs.some(
            (log) => new Date(log.taken_at).toISOString().split("T")[0] === dateStr
        );
        if (!hasLog) break;
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return { adherenceRate, streak };
};
export const fetchPatientMedications = async (userId: string): Promise<Medication[]> => {
    const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("patient_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data
};