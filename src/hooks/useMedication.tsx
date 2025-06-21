import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Medication, MedicationFormData } from "@/schema/medication";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  createMedication,
  deleteMedication,
  fetchMedications,
  updateMedication,
} from "@/api/medicationsApi";

export const useMedications = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    data: medications,
    isLoading,
    error,
  } = useQuery<Medication[]>({
    queryKey: ["medications", user?.id], // Include userId in queryKey
    queryFn: ({ queryKey }) => fetchMedications(queryKey[1] as string),
    enabled: !!user?.id, // Only fetch when user is available
  });

  // Mutation for creating medication
  const createMutation = useMutation({
    mutationFn: async (formData: MedicationFormData) => {
      if (!user?.id) throw new Error("User not authenticated");
      return await createMedication({ ...formData, user_id: user.id });
    },
    onMutate: async (newMedication) => {
      await queryClient.cancelQueries({ queryKey: ["medications"] });

      const previousMedications = queryClient.getQueryData<Medication[]>([
        "medications",
      ]);

      const optimisticMedication: Medication = {
        ...newMedication,
        id: crypto.randomUUID(),
        user_id: user.id,
      };

      queryClient.setQueryData(["medications"], (old: Medication[] = []) => [
        optimisticMedication,
        ...old,
      ]);

      return { previousMedications };
    },
    onError: (err, variables, context) => {
      toast.error("Failed to create medication");
      queryClient.setQueryData(["medications"], context?.previousMedications);
    },
    onSuccess: () => {
      toast.success("Medication created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });

  // Mutation for updating medication
  const updateMutation = useMutation({
    mutationFn: updateMedication,
    onMutate: async (updatedMedication) => {
      await queryClient.cancelQueries({ queryKey: ["medications"] });

      const previousMedications = queryClient.getQueryData<Medication[]>([
        "medications",
      ]);

      queryClient.setQueryData(["medications"], (old: Medication[] = []) =>
        old.map((med) =>
          med.id === updatedMedication.id ? updatedMedication : med
        )
      );

      return { previousMedications };
    },
    onError: (err, variables, context) => {
      toast.error("Failed to update medication");
      queryClient.setQueryData(["medications"], context?.previousMedications);
    },
    onSuccess: () => {
      toast.success("Medication updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });

  // Mutation for deleting medication
  const deleteMutation = useMutation({
    mutationFn: deleteMedication,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["medications"] });

      const previousMedications = queryClient.getQueryData<Medication[]>([
        "medications",
      ]);

      queryClient.setQueryData(["medications"], (old: Medication[] = []) =>
        old.filter((med) => med.id !== id)
      );

      return { previousMedications };
    },
    onError: (err, variables, context) => {
      toast.error("Failed to delete medication");
      queryClient.setQueryData(["medications"], context?.previousMedications);
    },
    onSuccess: () => {
      toast.success("Medication deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });

  return {
    medications,
    isLoading,
    error,
    createMedication: createMutation.mutateAsync,
    updateMedication: updateMutation.mutateAsync,
    deleteMedication: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};



