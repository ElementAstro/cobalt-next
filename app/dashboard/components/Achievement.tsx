import { AchievementList } from "@/components/achievement/achievement-list";
import { AchievementStats } from "@/components/achievement/achievement-stats";
import { AchievementManager } from "@/components/achievement/achievement-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Achievement System</h1>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Achievement List</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="manager">Manager</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <AchievementList />
        </TabsContent>
        <TabsContent value="stats">
          <AchievementStats />
        </TabsContent>
        <TabsContent value="manager">
          <AchievementManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
