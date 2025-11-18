"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Brain,
  Code,
  Users,
  Edit,
  Save,
  X,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EditableExpertiseCard({
  areaOfExpertise,
  willingToContact,
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");

  // Parse expertise areas from comma-separated string
  const parseExpertise = (expertise) => {
    if (!expertise) return [];
    return expertise
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  };

  const [formData, setFormData] = useState({
    expertiseAreas: parseExpertise(areaOfExpertise),
    willingToContact: willingToContact || false,
  });

  // Debug: Log props to see what's being received
  console.log("EditableExpertiseCard props:", {
    areaOfExpertise,
    willingToContact,
  });

  const addExpertiseArea = () => {
    setFormData({
      ...formData,
      expertiseAreas: [...formData.expertiseAreas, ""],
    });
  };

  const removeExpertiseArea = (index) => {
    const newAreas = formData.expertiseAreas.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      expertiseAreas: newAreas,
    });
  };

  const updateExpertiseArea = (index, value) => {
    const newAreas = [...formData.expertiseAreas];
    newAreas[index] = value;
    setFormData({
      ...formData,
      expertiseAreas: newAreas,
    });
  };

  const handleSave = async () => {
    setStatus("Saving...");

    try {
      // Format data to match the database schema
      const expertiseData = {
        areaOfExpertise: formData.expertiseAreas
          .filter((area) => area.trim() !== "")
          .join(", "),
        willingToContact: formData.willingToContact,
      };

      console.log("Sending expertise data:", expertiseData);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expertiseData),
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
    <Card className="relative bg-card border p-8 border-purple-500/20 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        {isEditing ? (
          // --- EDITING VIEW ---
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <Edit className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold text-foreground">
                Edit Expertise & Collaboration
              </h3>
            </div>

            {/* Areas of Expertise */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Areas of Expertise
              </Label>

              {formData.expertiseAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={area}
                    onChange={(e) => updateExpertiseArea(index, e.target.value)}
                    placeholder="e.g., Machine Learning, Full-Stack Development"
                    className="flex-1 font-medium"
                  />
                  {formData.expertiseAreas.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeExpertiseArea(index)}
                      className="shrink-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addExpertiseArea}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Expertise Area
              </Button>
            </div>

            {/* Willing to Collaborate */}
            <div className="space-y-3 p-4 border rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Willing to Collaborate
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow other alumni to contact you for collaboration
                    opportunities
                  </p>
                </div>
                <Switch
                  checked={formData.willingToContact}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, willingToContact: checked })
                  }
                />
              </div>
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
            {/* Header section */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="text-xl font-semibold text-foreground">
                  Expertise & Collaboration
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

            {/* Areas of Expertise */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Areas of Expertise
                </h4>
              </div>

              {parseExpertise(areaOfExpertise).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parseExpertise(areaOfExpertise).map((area, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 border-purple-200"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No expertise areas specified.
                </p>
              )}
            </div>

            {/* Collaboration Status */}
            <div className="p-4 border rounded-lg bg-background transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    willingToContact
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Collaboration Status
                  </p>
                  <p
                    className={`text-base font-medium leading-tight ${
                      willingToContact ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {willingToContact
                      ? "Open to Collaboration"
                      : "Not Available for Collaboration"}
                  </p>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {!areaOfExpertise && willingToContact === undefined && (
              <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-purple-50 mt-4">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 mx-auto mb-3 flex items-center justify-center rounded-full">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-foreground font-semibold text-sm">
                  Share Your Expertise
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Let others know your skills and if you're open to collaborate.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
