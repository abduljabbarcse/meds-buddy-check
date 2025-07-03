// components/PatientSelectorModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Search } from "lucide-react";
import { useState } from "react";

interface Patient {
  id: string;
  name: string;
  email: string;
  adherenceRate?: number;
}

interface PatientSelectorModalProps {
  patients?: Patient[];
  selectedPatient: string | null;
  onSelect: (patientId: string) => void;
  triggerClassName?: string;
}

export const PatientSelectorModal = ({
  patients,
  selectedPatient,
  onSelect,
  triggerClassName = ""
}: PatientSelectorModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const currentPatient = patients?.find(p => p.id === selectedPatient);

  const filteredPatients = patients?.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${triggerClassName}`}>
          <User className="h-4 w-4" />
          {currentPatient ? (
            <span className="truncate max-w-[160px]">{currentPatient.name}</span>
          ) : (
            <span>Select Patient</span>
          )}
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            {patients?.length || 0}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Select a Patient
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border">
            <div className="divide-y">
              {filteredPatients?.length ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => {
                      onSelect(patient.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                      selectedPatient === patient.id
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      selectedPatient === patient.id
                        ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        selectedPatient === patient.id ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{patient.email}</p>
                    </div>
                    {patient.adherenceRate && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.adherenceRate > 80
                          ? 'bg-green-100 text-green-800'
                          : patient.adherenceRate > 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {patient.adherenceRate}%
                      </div>
                    )}
                    {selectedPatient === patient.id && (
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No patients found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};