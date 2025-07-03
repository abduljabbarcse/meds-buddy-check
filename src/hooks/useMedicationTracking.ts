import { calculateAdherence, fetchMedicationLogs, fetchPatientMedications, logMedicationIntake } from "@/api/medicationLogs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isToday } from "date-fns";
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
    // Helper functions for derived data
    const getTodaysMedicationStatus = () => {
        if (!medicationsQuery.data || !medicationLogsQuery.data) return null;


        // Get all medications scheduled for today
        const todaysMedications = medicationsQuery.data.filter(med => {
            const medTime = new Date(med.time_of_day);
            return isToday(medTime);
        });

        // Get logs for today
        const todaysLogs = medicationLogsQuery.data.filter(log => {
            const logDate = new Date(log.taken_at);
            return isToday(logDate);
        });

        const takenCount = todaysLogs.length;
        const totalCount = todaysMedications.length;

        if (totalCount === 0) {
            return {
                status: "no_medications",
                taken: 0,
                total: 0
            };
        }

        return {
            status: takenCount >= totalCount ? "completed" : "pending",
            taken: takenCount,
            total: totalCount
        };
    };

    const getMonthlyAdherenceData = () => {
        if (!medicationsQuery.data || !medicationLogsQuery.data || !adherenceQuery.data) return null;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Get all days in current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysPassed = currentDate.getDate();

        // Calculate expected doses (assuming 1 dose per medication per day)
        const expectedDoses = medicationsQuery.data.length * daysPassed;
        const takenDoses = medicationLogsQuery.data.filter(log => {
            const logDate = new Date(log.taken_at);
            return logDate.getMonth() === currentMonth &&
                logDate.getFullYear() === currentYear;
        }).length;

        const missedDoses = Math.max(0, expectedDoses - takenDoses);
        const remainingDays = Math.max(0, daysInMonth - daysPassed);

        return {
            adherenceRate: adherenceQuery.data.adherenceRate,
            takenDays: medicationsQuery.data.length > 0 ?
                Math.round(takenDoses / medicationsQuery.data.length) : 0,
            missedDays: medicationsQuery.data.length > 0 ?
                Math.round(missedDoses / medicationsQuery.data.length) : 0,
            remainingDays,
            streak: adherenceQuery.data.streak
        };
    };

    // Get derived data
    const todaysStatus = getTodaysMedicationStatus();
    const monthlyData = getMonthlyAdherenceData();
    return {
        // Queries
        medications: medicationsQuery.data,
        isMedicationsLoading: medicationsQuery.isLoading,
        medicationLogs: medicationLogsQuery.data,
        isLogsLoading: medicationLogsQuery.isLoading,
        adherence: adherenceQuery.data,
        isAdherenceLoading: adherenceQuery.isLoading,
        // Derived data
        todaysStatus,
        monthlyAdherence: monthlyData,
        // Mutation
        logMedicationIntake: logIntakeMutation.mutateAsync,
        isLogging: logIntakeMutation.isPending, // Changed from isLoading to isPending
    };
};