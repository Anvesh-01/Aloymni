"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  User,
  Calendar,
  BookOpen,
  Building2,
  Edit,
  Save,
  X,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EditableBioCard({
  name,
  yearOfPassing, // Changed from passingYear
  course,
  department,
  bio,
  occupation,
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    name: name || "",
    yearOfPassing: yearOfPassing || "", // Updated
    course: course || "",
    department: department || "",
    bio: bio || "",
    occupation: occupation || "",
  });

  // Debug: Log props to see what's being received
  console.log("EditableBioCard props:", {
    name,
    yearOfPassing,
    course,
    department,
    bio,
    occupation,
  });

  const handleSave = async () => {
    setStatus("Saving...");

    try {
      const dbUpdatePromise = fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yearOfPassing: formData.yearOfPassing, // Updated
          course: formData.course,
          department: formData.department,
          bio: formData.bio,
          occupation: formData.occupation, // Added
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
    <Card className="relative bg-card border rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        {isEditing ? (
          // --- EDITING VIEW ---
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <Edit className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold text-foreground">
                Edit Personal Info
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="yearOfPassing"
                  className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Year of Passing
                </Label>
                <Input
                  id="yearOfPassing"
                  type="number"
                  value={formData.yearOfPassing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearOfPassing: e.target.value,
                    })
                  }
                  placeholder="e.g., 2022"
                  className="font-medium"
                />
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="course"
                  className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Course
                </Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  placeholder="e.g., B.Tech"
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="department"
                  className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Department
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="e.g., Computer Science"
                  className="font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-xs font-medium text-muted-foreground"
              >
                Bio / Description
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={4}
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
            {/* Header section */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  Personal Info
                </Badge>
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

            {/* Bio section */}
            <div className="mb-6 p-4 border rounded-lg bg-secondary/50">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                About
              </h4>
              <p className="text-foreground leading-relaxed">
                {bio || (
                  <span className="italic text-muted-foreground">
                    "Click the edit button to add your story and let others know
                    who you are!"
                  </span>
                )}
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Year of Passing
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {yearOfPassing || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Occupation
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {occupation || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Course
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {course || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Department
                    </p>
                    <p className="text-base font-medium text-foreground leading-tight">
                      {department || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug info - Remove this in production */}
            <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
              Debug: {name && `Name: ${name}, `}
              {yearOfPassing && `Year: ${yearOfPassing}, `}
              {course && `Course: ${course}, `}
              {department && `Dept: ${department}`}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
