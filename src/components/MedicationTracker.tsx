import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Image as ImageIcon, Camera, Clock, Pill } from "lucide-react";
import { format, parseISO,  isBefore } from "date-fns";
import { Medication } from "@/schema/medication";
import { MedicationLog } from "@/lib/types";

interface MedicationTrackerProps {
  medications: Medication[];
  logs: MedicationLog[];
  date: string;
  onMarkTaken: (medicationId: string, imageFile?: File) => Promise<void>;
  isToday: boolean;
  isLoading: boolean;
}

const MedicationTracker = ({
  medications,
  logs,
  date,
  onMarkTaken,
  isToday,
  isLoading,
}: MedicationTrackerProps) => {
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkTaken = async (medicationId: string) => {
    try {
      await onMarkTaken(medicationId, selectedImage || undefined);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error marking medication as taken:", error);
    }
  };

  const getMedicationStatus = (medicationId: string) => {
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) return "unknown";
    
    const isTaken = logs.some(log => log.medication_id === medicationId);
    if (isTaken) return "taken";
    
    const isMissed = isBefore(parseISO(medication.time_of_day), new Date());
    return isMissed ? "missed" : "pending";
  };

  if (medications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No medications scheduled for this day
      </div>
    );
  }

  // Check if all medications are taken for this date
  const allTaken = medications.every(med => 
    logs.some(log => log.medication_id === med.id)
  );

  if (allTaken) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              All Medications Completed!
            </h3>
            <p className="text-green-600">
              Great job! You've taken all medications for {format(new Date(date), 'MMMM d, yyyy')}.
            </p>
          </div>
        </div>
        
        {medications.map(med => (
          <Card key={med.id} className="border-green-200 bg-green-50/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Pill className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800">{med.name}</h4>
                  <p className="text-sm text-green-600">{med.dosage}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Clock className="w-3 h-3 mr-1" />
                {format(parseISO(med.time_of_day), 'h:mm a')}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {medications.map(med => {
        const status = getMedicationStatus(med.id);
        return (
          <div key={med.id} className="space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === "taken" ? "bg-green-100" : 
                    status === "missed" ? "bg-red-100" : "bg-blue-100"
                  }`}>
                    <Pill className={`w-5 h-5 ${
                      status === "taken" ? "text-green-600" : 
                      status === "missed" ? "text-red-600" : "text-blue-600"
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{med.name}</h4>
                    <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  </div>
                </div>
                <Badge variant={status === "taken" ? "secondary" : "outline"}>
                  <Clock className="w-3 h-3 mr-1" />
                  {format(parseISO(med.time_of_day), 'h:mm a')}
                </Badge>
              </CardContent>
            </Card>

            {status === "taken" ? (
              <div className="flex items-center justify-center text-green-600 mb-6">
                <Check className="w-4 h-4 mr-2" />
                <span>Medication already taken</span>
              </div>
            ) : status === "missed" ? (
              <div className="flex items-center justify-center text-red-600 mb-6">
                <Clock className="w-4 h-4 mr-2" />
                <span>Medication missed</span>
              </div>
            ) : (
              <>
                {/* Image Upload Section */}
                <Card className="border-dashed border-2 border-border/50">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Add Proof Photo (Optional)</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Take a photo of your medication as confirmation
                      </p>
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedMedication(med.id);
                          fileInputRef.current?.click();
                        }}
                        className="mb-4"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {selectedImage && selectedMedication === med.id ? "Change Photo" : "Take Photo"}
                      </Button>
                      
                      {imagePreview && selectedMedication === med.id && (
                        <div className="mt-4">
                          <img
                            src={imagePreview}
                            alt="Medication proof"
                            className="max-w-full h-32 object-cover rounded-lg mx-auto border-2 border-border"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            Photo selected: {selectedImage?.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Mark as Taken Button */}
                <Button
                  onClick={() => handleMarkTaken(med.id)}
                  className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white"
                  disabled={!isToday || isLoading}
                >
                  <Check className="w-5 h-5 mr-2" />
                  {isLoading ? "Processing..." : "Mark as Taken"}
                </Button>
              </>
            )}
          </div>
        );
      })}

      {!isToday && (
        <p className="text-center text-sm text-muted-foreground">
          You can only mark today's medication as taken
        </p>
      )}
    </div>
  );
};

export default MedicationTracker;