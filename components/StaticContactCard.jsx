"use client";

import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";

export default function StaticContactCard({ email, contactNo, address }) {
  return (
    <Card className="relative bg-card border border-blue-500/20 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-black" />
              <h3 className="text-xl font-semibold text-foreground">
                Contact Information
              </h3>
            </div>
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
              <StaticContactInfoItem
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
              <StaticContactInfoItem
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
              <StaticContactInfoItem
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
                No Contact Information Available
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Contact details are not publicly available for this alumni.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Helper component for consistent empty states in display view
function StaticContactInfoItem({ icon: Icon, label, message }) {
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
