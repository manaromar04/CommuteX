import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Car,
  MapPin,
  Cloud,
  Settings,
  MessageCircle,
} from "lucide-react";
import { ReactNode } from "react";
import { UserRole } from "@shared/types";

interface TabLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: UserRole;
  passengerContent?: ReactNode;
  driverContent?: ReactNode;
  hubsContent?: ReactNode;
  forecastContent?: ReactNode;
  copilotContent?: ReactNode;
}

export function TabLayout({
  activeTab,
  onTabChange,
  userRole = "PASSENGER",
  passengerContent,
  driverContent,
  hubsContent,
  forecastContent,
  adminContent,
  copilotContent,
}: TabLayoutProps) {
  // Determine which tabs to show based on role
  const visibleTabs: string[] = ["hubs", "forecast", "copilot"];

  if (userRole === "PASSENGER") {
    visibleTabs.unshift("passenger");
  } else if (userRole === "DRIVER") {
    visibleTabs.unshift("driver");
  } else if (userRole === "ADMIN") {
    visibleTabs.unshift("admin");
  }

  // Fallback to default tab if current one is hidden
  const finalActiveTab = visibleTabs.includes(activeTab) ? activeTab : visibleTabs[0];

  const tabColCount = visibleTabs.length;

  return (
    <div className="w-full">
      <Tabs value={finalActiveTab} onValueChange={onTabChange} className="w-full">
        <TabsList
          className={`grid w-full gap-0 rounded-lg border border-border bg-card p-1`}
          style={{ gridTemplateColumns: `repeat(${Math.min(tabColCount, 6)}, minmax(0, 1fr))` }}
        >
          {/* Passenger Tab */}
          {visibleTabs.includes("passenger") && (
            <TabsTrigger
              value="passenger"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Passenger</span>
            </TabsTrigger>
          )}

          {/* Driver Tab */}
          {visibleTabs.includes("driver") && (
            <TabsTrigger
              value="driver"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Driver</span>
            </TabsTrigger>
          )}

          {/* Hubs Tab */}
          {visibleTabs.includes("hubs") && (
            <TabsTrigger
              value="hubs"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Hubs</span>
            </TabsTrigger>
          )}

          {/* Forecast Tab */}
          {visibleTabs.includes("forecast") && (
            <TabsTrigger
              value="forecast"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Forecast</span>
            </TabsTrigger>
          )}

          {/* Admin Tab */}
          {visibleTabs.includes("admin") && (
            <TabsTrigger
              value="admin"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          )}

          {/* Copilot Tab */}
          {visibleTabs.includes("copilot") && (
            <TabsTrigger
              value="copilot"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Copilot</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Content Sections */}
        {visibleTabs.includes("passenger") && (
          <TabsContent value="passenger" className="mt-4">
            {passengerContent || <div>Passenger content</div>}
          </TabsContent>
        )}

        {visibleTabs.includes("driver") && (
          <TabsContent value="driver" className="mt-4">
            {driverContent || <div>Driver content</div>}
          </TabsContent>
        )}

        {visibleTabs.includes("hubs") && (
          <TabsContent value="hubs" className="mt-4">
            {hubsContent || <div>Smart Hubs content</div>}
          </TabsContent>
        )}

        {visibleTabs.includes("forecast") && (
          <TabsContent value="forecast" className="mt-4">
            {forecastContent || <div>Forecast Map content</div>}
          </TabsContent>
        )}

        {visibleTabs.includes("admin") && (
          <TabsContent value="admin" className="mt-4">
            {adminContent || <div>Admin Dashboard content</div>}
          </TabsContent>
        )}

        {visibleTabs.includes("copilot") && (
          <TabsContent value="copilot" className="mt-4">
            {copilotContent || <div>AI Copilot content</div>}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
