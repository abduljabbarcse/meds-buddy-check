import { z } from "zod";

export const medicationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.enum(["daily", "weekly", "monthly", "as_needed"]),
  time_of_day: z.string().min(1, "Time is required"),
  patient_id: z.string().min(1, "Patient is required"),
});

export type MedicationFormData = z.infer<typeof medicationFormSchema>;

export interface Medication extends MedicationFormData {
  id: string;
  user_id: string;
}