"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";

export default function StaticBioCard({
  bio,
  occupation,
  yearOfPassing,
  address,
}) {
  return (
    <Card className="relative bg-card border rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl mb-4">
      <div className="p-6">
        <div>
          {/* Header section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {occupation && (
                <div className="mb-4">
                  <Badge variant="secondary" className="mb-2">
                    Current Role
                  </Badge>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {occupation}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio section */}
          <div className="mb-6 p-4 border rounded-lg bg-secondary/50">
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">
              About
            </h4>
            <p className="text-foreground leading-relaxed">
              {bio || (
                <span className="italic text-muted-foreground">
                  No bio available.
                </span>
              )}
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yearOfPassing && (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Graduation
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      Class of {yearOfPassing}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {address && (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Location
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Empty state */}
          {!yearOfPassing && !address && (
            <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-secondary/50">
              <div className="w-8 h-8 bg-secondary text-secondary-foreground mx-auto mb-3 flex items-center justify-center rounded-full">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-foreground font-semibold text-sm">
                Limited Profile Information
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Some graduation details are not available
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
