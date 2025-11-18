"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  MapPin,
  Edit,
  Save,
  X,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EditableProfessionalCard({
  occupation,
  placeOfWork,
  designation,
  officialAddress,
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    occupation: occupation || "",
    placeOfWork: placeOfWork || "",
    designation: designation || "",
    officialAddress: officialAddress || "",
  });

  // Debug: Log props to see what's being received
  console.log("EditableProfessionalCard props:", {
    occupation,
    placeOfWork,
    designation,
    officialAddress,
  });

  const handleSave = async () => {
    setStatus("Saving...");

    try {
      const dbUpdatePromise = fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occupation: formData.occupation,
          placeOfWork: formData.placeOfWork,
          designation: formData.designation,
          officialAddress: formData.officialAddress,
        }),
      });

      await dbUpdatePromise;

      setIsEditing(false);
      setStatus("Saved!");
      router.refresh();
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      console.error(error);
      setStatus("Error saving.");
    }
  };

  return (
    <Card className="relative bg-card border border-green-500/20 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        {isEditing ? (
          // --- EDITING VIEW ---
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <Edit className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold text-foreground">
                Edit Professional Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="occupation"
                  className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData({ ...formData, occupation: e.target.value })
                  }
                  placeholder="e.g., Software Engineer"
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="designation"
                  className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Designation
                </Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="e.g., Senior Developer, Team Lead"
                  className="font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="placeOfWork"
                className="text-xs font-medium text-muted-foreground flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Company / Place of Work
              </Label>
              <Input
                id="placeOfWork"
                value={formData.placeOfWork}
                onChange={(e) =>
                  setFormData({ ...formData, placeOfWork: e.target.value })
                }
                placeholder="e.g., Google, Microsoft, Startup XYZ"
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="officialAddress"
                className="text-xs font-medium text-muted-foreground flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Official Address
              </Label>
              <Textarea
                id="officialAddress"
                value={formData.officialAddress}
                onChange={(e) =>
                  setFormData({ ...formData, officialAddress: e.target.value })
                }
                placeholder="Your office address"
                rows={3}
                className="resize-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {status || "Save"}
              </Button>
            </div>
          </div>
        ) : (
          // --- DISPLAY VIEW ---
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-semibold text-foreground">
                  Professional Information
                </h3>
              </div>
              <Button
                variant="default"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
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
            {!occupation &&
              !placeOfWork &&
              !designation &&
              !officialAddress && (
                <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-green-50 mt-4">
                  <div className="w-8 h-8 bg-green-100 text-green-600 mx-auto mb-3 flex items-center justify-center rounded-full">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-foreground font-semibold text-sm">
                    Add Your Professional Information
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Share your career details with the alumni network.
                  </p>
                </div>
              )}
          </div>
        )}
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
