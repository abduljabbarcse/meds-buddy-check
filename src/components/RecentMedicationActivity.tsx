// components/RecentMedicationActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, AlertTriangle, Camera } from "lucide-react";
import { Medication } from "@/schema/medication";
import { MedicationLog } from "@/lib/types";

interface RecentMedicationActivityProps {
  medications: Medication[];
  logs: MedicationLog[];
  className?: string;
}

export const RecentMedicationActivity = ({ 
  medications,
  logs,
  className = ""
}: RecentMedicationActivityProps) => {
    
  const recentActivity = logs
    .map(log => {
      const medication = medications.find(m => m.id === log.medication_id);
      return {
        ...log,
        medication,
        date: log.taken_at,
        taken: true,
        time: format(new Date(log.taken_at), 'h:mm a'),
        hasPhoto: !!log.proof_image_url
      };
    })
    .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
    .slice(0, 5); 

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Medication Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.taken ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {activity.taken ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.medication?.name || 'Unknown Medication'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.taken 
                        ? `Taken at ${activity.time} on ${format(new Date(activity.date), 'MMMM d, yyyy')}`
                        : 'Medication missed'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activity.hasPhoto && (
                    <Badge variant="outline">
                      <Camera className="w-3 h-3 mr-1" />
                      Photo
                    </Badge>
                  )}
                  <Badge variant={activity.taken ? "secondary" : "destructive"}>
                    {activity.taken ? "Completed" : "Missed"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent medication activity found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};