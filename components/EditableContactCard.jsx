"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Edit, Save, X, Sparkles } from "lucide-react"; // Added Save, X, Sparkles for consistency
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"; // Using Textarea for address for better UX
export default function EditableContactCard({ email, contactNo, address }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: email || "",
    contactNo: contactNo || "",
    address: address || "",
  });
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    setStatus("Saving...");
    try {
      const response = await fetch("/api/profile", {
        method: "PUT", // Changed to PATCH for partial updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save changes.");

      setIsEditing(false);
      setStatus("Saved!");
      router.refresh(); // This tells Next.js to re-fetch the server data to show updates
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      console.error(error);
      setStatus("Error saving.");
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
                Edit Contact Information
              </h3>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-black" />
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your.email@example.com"
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="contactNo"
                className="text-xs font-medium text-muted-foreground flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-black" />
                Phone Number
              </Label>
              <Input
                id="contactNo"
                value={formData.contactNo}
                onChange={(e) =>
                  setFormData({ ...formData, contactNo: e.target.value })
                }
                placeholder="e.g., +1 (555) 123-4567"
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-xs font-medium text-muted-foreground flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-black" />
                Address
              </Label>
              <Textarea // Using Textarea for address for multi-line support
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Your full address, city, state, zip"
                rows={2}
                className="resize-none font-medium"
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
                <Mail className="h-5 w-5 text-black" />
                <h3 className="text-xl font-semibold text-foreground">
                  Contact Information
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
              {/* Email */}
              {email ? (
                <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                      <Mail className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Email
                      </p>
                      <p className="text-base font-medium text-foreground leading-tight">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyContactInfoItem
                  icon={Mail}
                  label="Email"
                  message="No email provided."
                />
              )}

              {/* Phone Number */}
              {contactNo ? (
                <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                      <Phone className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="text-base font-medium text-foreground leading-tight">
                        {contactNo}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyContactInfoItem
                  icon={Phone}
                  label="Phone"
                  message="No phone number provided."
                />
              )}

              {/* Address */}
              {address ? (
                <div className="border rounded-lg p-4 bg-background transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded-md">
                      <MapPin className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Address
                      </p>
                      <p className="text-base font-medium text-foreground leading-tight">
                        {address}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyContactInfoItem
                  icon={MapPin}
                  label="Address"
                  message="No address provided."
                />
              )}
            </div>

            {/* Empty state for the entire card if all fields are empty */}
            {!email && !contactNo && !address && (
              <div className="text-center py-6 px-4 border border-dashed rounded-lg bg-secondary/50 mt-4">
                <div className="w-8 h-8 bg-secondary text-secondary-foreground mx-auto mb-3 flex items-center justify-center rounded-full">
                  <Sparkles className="h-4 w-4 text-black" />
                </div>
                <p className="text-foreground font-semibold text-sm">
                  Add Your Contact Information
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Keep your network updated with your latest contact details.
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
function EmptyContactInfoItem({ icon: Icon, label, message }) {
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
