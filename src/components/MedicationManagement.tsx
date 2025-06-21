// components/MedicationManagement.tsx
import { useState } from "react";
import { Medication, MedicationFormData } from "@/schema/medication";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MedicationForm } from "./MedicationForm";
import { Plus, Pencil, Trash2, Pill } from "lucide-react";
import { useMedications } from "@/hooks/useMedication";
import { usePatients } from "@/hooks/usePatients";




export const MedicationManagement = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
    const { data: patients } = usePatients();
    const {
        medications,
        isLoading,
        error,
        createMedication,
        updateMedication,
        deleteMedication,
        isCreating,
        isUpdating,
        isDeleting,
    } = useMedications();

    const handleCreate = async (data: MedicationFormData) => {
        try {
            await createMedication(data);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error creating medication:", error);
        }
    };

    const handleUpdate = async (data: MedicationFormData) => {
        if (!editingMedication) return;
        try {
            await updateMedication({
                ...data,
                id: editingMedication.id,
                user_id: editingMedication.user_id,
            });
            setIsDialogOpen(false);
            setEditingMedication(null);
        } catch (error) {
            console.error("Error updating medication:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMedication(id);
        } catch (error) {
            console.error("Error deleting medication:", error);
        }
    };



    if (error) {
        return <div>Error loading medications: {error.message}</div>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Medication Management</CardTitle>
                <Button
                    size="sm"
                    onClick={() => {
                        setEditingMedication(null);
                        setIsDialogOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div>Loading medications...</div>
                ) : medications?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No medications found. Add your first medication to get started.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medications?.map((medication) => (
                                <TableRow key={medication.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Pill className="h-4 w-4 text-blue-500" />
                                            {medication.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{medication.dosage}</TableCell>
                                    <TableCell className="capitalize">
                                        {medication.frequency.replace("_", " ")}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {medication.time_of_day}
                                    </TableCell>
                                    <TableCell>
                                        {medication.patient_id
                                            ? patients?.find(p => p.id === medication.patient_id)?.name || "Unknown"
                                            : "Self"}                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingMedication(medication);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(medication.id)}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                )}
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingMedication ? "Edit Medication" : "Add New Medication"}
                        </DialogTitle>
                    </DialogHeader>
                    <MedicationForm
                        defaultValues={editingMedication || undefined}
                        onSubmit={editingMedication ? handleUpdate : handleCreate}
                        onCancel={() => setIsDialogOpen(false)}
                        isLoading={isCreating || isUpdating}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    );
};