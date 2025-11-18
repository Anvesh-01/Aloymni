import { Card } from "@/components/ui/card";
import { Briefcase, Building2, MapPin, User, Sparkles } from "lucide-react";

export default function StaticProfessionalCard({
  occupation,
  placeOfWork,
  designation,
  officialAddress,
}) {
  return (
    <Card className="relative bg-card border border-green-500/20 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-green-600" />
              <h3 className="text-xl font-semibold text-foreground">
                Professional Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Occupation */}
            {occupation ? (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-md">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Occupation
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {occupation}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ProfessionalInfoItem
                icon={Briefcase}
                label="Occupation"
                message="No occupation specified."
              />
            )}

            {/* Place of Work */}
            {placeOfWork ? (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-md">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Company
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {placeOfWork}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ProfessionalInfoItem
                icon={Building2}
                label="Company"
                message="No company specified."
              />
            )}

            {/* Designation */}
            {designation ? (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-md">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Designation
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {designation}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ProfessionalInfoItem
                icon={User}
                label="Designation"
                message="No designation specified."
              />
            )}

            {/* Official Address */}
            {officialAddress ? (
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-md">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Official Address
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {officialAddress}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ProfessionalInfoItem
                icon={MapPin}
                label="Official Address"
                message="No official address provided."
              />
            )}
          </div>

          {/* Empty state for the entire card if all fields are empty */}
          {!occupation && !placeOfWork && !designation && !officialAddress && (
            <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-green-50 mt-4">
              <div className="w-8 h-8 bg-green-100 text-green-600 mx-auto mb-3 flex items-center justify-center rounded-full">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-foreground font-semibold text-sm">
                No Professional Information Available
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                This alumni hasn't shared their career details yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Helper component for consistent empty states in display view
function ProfessionalInfoItem({ icon: Icon, label, message }) {
  return (
    <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md opacity-70">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-md">
          <Icon className="h-4 w-4" />
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
