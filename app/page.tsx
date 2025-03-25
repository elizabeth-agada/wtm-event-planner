"use client"
import EventHeader from "@/components/event-header"
import TaskManager from "@/components/task-manager"
import Timeline from "@/components/timeline"
import BudgetTracker from "@/components/budget-tracker"
import TeamAssignments from "@/components/team-assignments"
import VendorTracker from "@/components/vendor-tracker"
import MarketingPlan from "@/components/marketing-plan"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventPlannerPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <EventHeader
        title="Women TechMakers IWD 2025"
        subtitle="Redefine Possible - Women Shaping AI's Future"
        date="April 19, 2025"
        location="Bauchi, Nigeria"
      />

      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="bg-white p-6 rounded-lg shadow-sm">
            <TaskManager />
          </TabsContent>

          <TabsContent value="timeline" className="bg-white p-6 rounded-lg shadow-sm">
            <Timeline />
          </TabsContent>

          <TabsContent value="budget" className="bg-white p-6 rounded-lg shadow-sm">
            <BudgetTracker />
          </TabsContent>

          <TabsContent value="team" className="bg-white p-6 rounded-lg shadow-sm">
            <TeamAssignments />
          </TabsContent>

          <TabsContent value="vendors" className="bg-white p-6 rounded-lg shadow-sm">
            <VendorTracker />
          </TabsContent>

          <TabsContent value="marketing" className="bg-white p-6 rounded-lg shadow-sm">
            <MarketingPlan />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

