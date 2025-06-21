import { calculateAdherence, fetchMedicationLogs, fetchPatientMedications, logMedicationIntake } from "@/api/medicationLogs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMedicationTracking = (userId: string, role: 'patient' | 'caretaker') => {
    const queryClient = useQueryClient();

    // Queries
    const medicationsQuery = useQuery({
        queryKey: ["medications", userId],
        queryFn: () => fetchPatientMedications(userId),
    });
    console.log(medicationsQuery)

    const medicationLogsQuery = useQuery({
        queryKey: ["medicationLogs", userId],
        queryFn: ({ queryKey }) => {
            // You'll need to pass the date here - you might want to adjust this
            // Currently using a default date since the original implementation didn't show where date comes from
            const defaultDate = new Date();
            return fetchMedicationLogs(userId, defaultDate);
        },
        enabled: role === 'patient',
    });

    const adherenceQuery = useQuery({
        queryKey: ["adherence", userId],
        queryFn: () => calculateAdherence(userId),
        enabled: role === 'patient',
    });

    const logIntakeMutation = useMutation({
        mutationFn: (params: { medicationId: string; imageFile?: File }) =>
            logMedicationIntake(params.medicationId, userId, params.imageFile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicationLogs", userId] });
            queryClient.invalidateQueries({ queryKey: ["adherence", userId] });
            toast.success("Medication logged successfully");
        },
        onError: (error: Error) => {
            toast.error("Failed to log medication");
            console.error(error);
        },
    });

    return {
        // Queries
        medications: medicationsQuery.data,
        isMedicationsLoading: medicationsQuery.isLoading,
        medicationLogs: medicationLogsQuery.data,
        isLogsLoading: medicationLogsQuery.isLoading,
        adherence: adherenceQuery.data,
        isAdherenceLoading: adherenceQuery.isLoading,

        // Mutation
        logMedicationIntake: logIntakeMutation.mutateAsync,
        isLogging: logIntakeMutation.isPending, // Changed from isLoading to isPending
    };
};