import { Card } from "@/components/ui/card";
import { Brain, Code, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StaticExpertiseCard({
  areaOfExpertise,
  willingToContact,
}) {
  // Parse expertise areas from comma-separated string
  const parseExpertise = (expertise) => {
    if (!expertise) return [];
    return expertise
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  };

  return (
    <Card className="relative bg-card border border-purple-500/20 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        <div>
          {/* Header section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-foreground">
                Expertise & Collaboration
              </h3>
            </div>
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
                No Expertise Information Available
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                This alumni hasn't shared their skills and collaboration
                preferences yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
