"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Sparkles,
  GraduationCap,
  Calendar,
  Building2,
  School,
  Award,
} from "lucide-react"; // Added Save, X, Sparkles for consistency
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"; // Using Textarea for address for better UX
export default function EditableAcademicCard({
  highestDegree,
  institution,
  yearOfCompletion,
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    highestDegree: highestDegree || "",
    institution: institution || "",
    yearOfCompletion: yearOfCompletion || "",
  });
  const [status, setStatus] = useState("");

  // Debug: Log props to see what's being received
  console.log("EditableAcademicCard props:", {
    highestDegree,
    institution,
    yearOfCompletion,
  });

  const handleSave = async () => {
    setStatus("Saving...");
    try {
      // Format data to match the database schema
      const educationData = {
        highestDegree: {
          specify: formData.highestDegree,
          year: parseInt(formData.yearOfCompletion) || null,
        },
        higherEducation: {
          institution: formData.institution,
        },
      };

      console.log("Sending education data:", educationData);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(educationData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", errorData);
        throw new Error("Failed to save changes.");
      }

      setIsEditing(false);
      setStatus("Saved!");
      router.refresh();
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      console.error("Save error:", error);
      setStatus("Error saving.");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <Card className="relative bg-card border border-blue-500/20 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        {isEditing ? (
          // --- EDITING VIEW (Styled to match BioCard) ---
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <Edit className="h-5 w-5 text-black" />
              <h3 className="text-xl font-semibold text-foreground">
                Edit Education Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="highestDegree"
                  className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                >
                  <Award className="h-4 w-4 text-black" />
                  Highest Degree
                </Label>
                <Input
                  id="highestDegree"
                  value={formData.highestDegree}
                  onChange={(e) =>
                    setFormData({ ...formData, highestDegree: e.target.value })
                  }
                  placeholder="e.g., Master's, PhD, Bachelor's"
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="yearOfCompletion"
                  className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-black" />
                  Year of Completion
                </Label>
                <Input
                  id="yearOfCompletion"
                  type="number"
                  value={formData.yearOfCompletion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearOfCompletion: e.target.value,
                    })
                  }
                  placeholder="e.g., 2025"
                  className="font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="institution"
                className="text-xs font-medium text-muted-foreground flex items-center gap-2"
              >
                <School className="h-4 w-4 text-black" />
                Institution
              </Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="e.g., University Name, College Name"
                className="font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2 text-black" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2 text-white" />
                {status || "Save"}
              </Button>
            </div>
          </div>
        ) : (
          // --- DISPLAY VIEW (Styled to match BioCard) ---
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-black" />
                <h3 className="text-xl font-semibold text-foreground">
                  Education Information
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
              {/* Highest Degree */}
              {highestDegree ? (
                <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                      <Award className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Highest Degree
                      </p>
                      <p className="text-base font-medium text-foreground leading-tight">
                        {highestDegree}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyInfoItem
                  icon={Award}
                  label="Highest Degree"
                  message="No degree specified."
                />
              )}

              {/* Institution */}
              {institution ? (
                <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                      <School className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Institution
                      </p>
                      <p className="text-base font-medium text-foreground leading-tight">
                        {institution}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyInfoItem
                  icon={School}
                  label="Institution"
                  message="No institution provided."
                />
              )}

              {/* Year of Completion */}
              {yearOfCompletion ? (
                <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                      <Calendar className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Year of Completion
                      </p>
                      <p className="text-base font-medium text-foreground leading-tight">
                        {yearOfCompletion}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyInfoItem
                  icon={Calendar}
                  label="Year of Completion"
                  message="No completion year provided."
                />
              )}
            </div>

            {/* Empty state for the entire card if all fields are empty */}
            {!highestDegree && !institution && !yearOfCompletion && (
              <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-secondary/50 mt-4">
                <div className="w-8 h-8 bg-secondary text-secondary-foreground mx-auto mb-3 flex items-center justify-center rounded-full">
                  <Sparkles className="h-4 w-4 text-black" />
                </div>
                <p className="text-foreground font-semibold text-sm">
                  Add Your Education Information
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Share your highest educational qualifications.
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
function EmptyInfoItem({ icon: Icon, label, message }) {
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
