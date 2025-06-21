import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Check, Calendar as CalendarIcon, User, Pill } from "lucide-react";
import MedicationTracker from "./MedicationTracker";
import { format, isToday, isBefore, startOfDay, parseISO } from "date-fns";
import { useMedicationTracking } from "@/hooks/useMedicationTracking";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "./Loader";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    medications,
    isMedicationsLoading,
    medicationLogs,
    isLogsLoading,
    adherence,
    isAdherenceLoading,
    logMedicationIntake,
    isLogging,
  } = useMedicationTracking(user?.id || "", "patient");

  if (!user) return <Loader />;

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const isTodaySelected = isToday(selectedDate);

  const todaysMedications = medications?.filter(med => {
    try {
      const medDate = new Date(med.time_of_day);
      return format(medDate, 'yyyy-MM-dd') === selectedDateStr;
    } catch (e) {
      console.error("Error parsing medication time:", med.time_of_day, e);
      return false;
    }
  });


  const handleMarkTaken = async (medicationId: string, imageFile?: File) => {
    try {
      await logMedicationIntake({ medicationId, imageFile });
    } catch (error) {
      console.error("Error logging medication:", error);
    }
  };



  if (isMedicationsLoading || isAdherenceLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user.user_metadata?.name ?? ""}!</h2>
            <p className="text-white/90 text-lg">Ready to stay on track with your medication?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherence?.streak || 0}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {medicationLogs?.some(log =>
                format(parseISO(log.taken_at), 'yyyy-MM-dd') === todayStr
              ) ? "✓" : "○"}
            </div>
            <div className="text-white/80">Today's Status</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherence?.adherenceRate || 0}%</div>
            <div className="text-white/80">Adherence Rate</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Medication Tracker */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                {isTodaySelected ? "Today's Medication" : `Medication for ${format(selectedDate, 'MMMM d, yyyy')}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLogsLoading ? (
                <div>Loading medication logs...</div>
              ) : (
                <MedicationTracker
                  medications={todaysMedications || []}
                  logs={medicationLogs || []}
                  date={selectedDateStr}
                  onMarkTaken={handleMarkTaken}
                  isToday={isTodaySelected}
                  isLoading={isLogging}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Medication Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white hover:bg-blue-700",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isPast = isBefore(date, startOfDay(today));
                    const isCurrentDay = isToday(date);
                    const isTaken = medicationLogs?.some(log => {
                      try {
                        const logDate = new Date(log.taken_at);
                        return format(logDate, 'yyyy-MM-dd') === dateStr;
                      } catch (e) {
                        console.error("Error parsing log time:", log.taken_at, e);
                        return false;
                      }
                    });

                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {isTaken && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {!isTaken && isPast && !isCurrentDay && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
                        )}
                      </div>
                    );
                  }
                }}
              />

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Medication taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Missed medication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;