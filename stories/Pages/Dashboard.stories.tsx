import type { Meta } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Pages/Dashboard",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

export const TalentDashboard = () => (
  <div className="min-h-screen bg-dark-900">
    {/* Header */}
    <header className="bg-dark-800 border-b border-dark-700 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Welcome back, João Silva</p>
      </div>
    </header>

    {/* Main Content */}
    <main className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Total Earnings</p>
                <p className="text-3xl font-bold">R$ 12,540</p>
                <p className="text-xs text-green-500 mt-2">↑ 8% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Projects Completed</p>
                <p className="text-3xl font-bold">24</p>
                <p className="text-xs text-gray-400 mt-2">In the last 90 days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Active Projects</p>
                <p className="text-3xl font-bold">3</p>
                <p className="text-xs text-gray-400 mt-2">Awaiting delivery</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Rating</p>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-xs text-yellow-500 mt-2">⭐⭐⭐⭐⭐</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Active Projects</h2>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Commercial Voice Over</CardTitle>
                    <CardDescription>Tech Product Launch</CardDescription>
                  </div>
                  <Badge variant="success">In Progress</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Progress</p>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                <p className="text-sm">Deliver by: September 10, 2026</p>
                <Button className="w-full">View Details</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Audiobook Narration</CardTitle>
                    <CardDescription>Mystery Novel - Chapter 5-8</CardDescription>
                  </div>
                  <Badge variant="primary">Recording</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Progress</p>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
                <p className="text-sm">Deliver by: September 15, 2026</p>
                <Button className="w-full">View Details</Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Quick Actions</h2>

            <Button className="w-full">Submit New Project</Button>
            <Button variant="outline" className="w-full">
              View Messages
            </Button>
            <Button variant="ghost" className="w-full">
              Edit Profile
            </Button>

            <h2 className="text-xl font-bold pt-4">Recent Reviews</h2>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span className="text-sm font-semibold">5.0</span>
                  </div>
                  <p className="text-sm">Excellent voice quality and professionalism!</p>
                  <p className="text-xs text-gray-400 mt-1">By: Maria Souza</p>
                </div>
                <hr className="border-dark-700" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>⭐⭐⭐⭐</span>
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                  <p className="text-sm">Great work, very professional</p>
                  <p className="text-xs text-gray-400 mt-1">By: Carlos Lima</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export const ClientDashboard = () => (
  <div className="min-h-screen bg-dark-900">
    {/* Header */}
    <header className="bg-dark-800 border-b border-dark-700 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="text-gray-400">Manage your projects and team</p>
      </div>
    </header>

    {/* Main Content */}
    <main className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Total Spent</p>
              <p className="text-3xl font-bold">R$ 45,230</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Projects Launched</p>
              <p className="text-3xl font-bold">8</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Talent Hired</p>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>
        </div>

        {/* Browse Talent */}
        <div>
          <h2 className="text-xl font-bold mb-4">Find Talent</h2>
          <Button>Browse Talent Directory</Button>
        </div>

        {/* Recent Projects */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Projects</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project {i}: Commercial Campaign</CardTitle>
                      <CardDescription>Budget: R$ 5,000 - Deadline: Sept 20</CardDescription>
                    </div>
                    <Badge variant="primary">Active</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);
