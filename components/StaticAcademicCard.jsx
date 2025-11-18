"use client";

import { Card } from "@/components/ui/card";
import { GraduationCap, Calendar, Building2, Sparkles } from "lucide-react";

export default function StaticAcademicCard({
  course,
  yearOfPassingOut,
  department,
}) {
  return (
    <Card className="relative bg-card border border-blue-500/20 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-black" />
              <h3 className="text-xl font-semibold text-foreground">
                Academic Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Course */}
            {course ? (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <GraduationCap className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Course
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {course}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <StaticInfoItem
                icon={GraduationCap}
                label="Course"
                message="No course information available."
              />
            )}

            {/* Year of Passing Out */}
            {yearOfPassingOut ? (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <Calendar className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Year of Passing Out
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {yearOfPassingOut}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <StaticInfoItem
                icon={Calendar}
                label="Year of Passing Out"
                message="Graduation year not available."
              />
            )}

            {/* Department */}
            {department ? (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <Building2 className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Department
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {department}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <StaticInfoItem
                icon={Building2}
                label="Department"
                message="No department information available."
              />
            )}
          </div>

          {/* Empty state for the entire card if all fields are empty */}
          {!course && !yearOfPassingOut && !department && (
            <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-secondary/50 mt-4">
              <div className="w-8 h-8 bg-secondary text-secondary-foreground mx-auto mb-3 flex items-center justify-center rounded-full">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
              <p className="text-foreground font-semibold text-sm">
                No Academic Information Available
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Academic details are not available for this alumni.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Helper component for consistent empty states in display view
function StaticInfoItem({ icon: Icon, label, message }) {
  return (
    <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md opacity-70">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
          <Icon className="h-4 w-4 text-black" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {label}
          </p>
          <p className="text-sm italic text-muted-foreground leading-tight">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
