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

interface TabLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
  passengerContent?: ReactNode;
  driverContent?: ReactNode;
  hubsContent?: ReactNode;
  forecastContent?: ReactNode;
  adminContent?: ReactNode;
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
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6 gap-0 rounded-lg border border-border bg-card p-1">
          <TabsTrigger
            value="passenger"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Passenger</span>
          </TabsTrigger>
          <TabsTrigger
            value="driver"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Driver</span>
          </TabsTrigger>
          <TabsTrigger
            value="hubs"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Hubs</span>
          </TabsTrigger>
          <TabsTrigger
            value="forecast"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">Forecast</span>
          </TabsTrigger>
          {userRole === "ADMIN" && (
            <TabsTrigger
              value="admin"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          )}
          <TabsTrigger
            value="copilot"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Copilot</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="passenger" className="mt-4">
          {passengerContent || <div>Passenger content</div>}
        </TabsContent>
        <TabsContent value="driver" className="mt-4">
          {driverContent || <div>Driver content</div>}
        </TabsContent>
        <TabsContent value="hubs" className="mt-4">
          {hubsContent || <div>Smart Hubs content</div>}
        </TabsContent>
        <TabsContent value="forecast" className="mt-4">
          {forecastContent || <div>Forecast Map content</div>}
        </TabsContent>
        {userRole === "ADMIN" && (
          <TabsContent value="admin" className="mt-4">
            {adminContent || <div>Admin Dashboard content</div>}
          </TabsContent>
        )}
        <TabsContent value="copilot" className="mt-4">
          {copilotContent || <div>AI Copilot content</div>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
