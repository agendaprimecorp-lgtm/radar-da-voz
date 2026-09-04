import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. You can add any content here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card has a footer with action buttons.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const TalentCard = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle>João Silva</CardTitle>
          <CardDescription>Voice Talent</CardDescription>
        </div>
        <span className="text-yellow-400">⭐ 4.8</span>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">Skills</p>
        <p className="text-sm">Voice Acting, Dubbing, Narration</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
        <p className="text-sm">São Paulo, Brazil</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">Rate</p>
        <p className="text-sm">R$ 500 - R$ 2000 per project</p>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">View Profile</Button>
    </CardFooter>
  </Card>
);

export const MetricsCard = () => (
  <Card className="max-w-xs">
    <CardContent className="pt-6">
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">Total Views</p>
        <p className="text-4xl font-bold">12,543</p>
        <p className="text-xs text-green-500 mt-2">↑ 12% from last month</p>
      </div>
    </CardContent>
  </Card>
);

export const MultipleCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Total Talent</p>
          <p className="text-3xl font-bold">1,234</p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Active Projects</p>
          <p className="text-3xl font-bold">42</p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold">R$ 125K</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const ImageCard = () => (
  <Card className="max-w-sm overflow-hidden">
    <div className="w-full h-40 bg-gradient-to-br from-primary-500 to-secondary-500" />
    <CardHeader>
      <CardTitle>Featured Project</CardTitle>
    </CardHeader>
    <CardContent>
      <p>An amazing voice talent marketplace project that connects creators with professional voice actors.</p>
    </CardContent>
  </Card>
);

export const Interactive = () => (
  <Card className="max-w-md cursor-pointer hover:scale-105 transition-transform">
    <CardHeader>
      <CardTitle>Hover me!</CardTitle>
      <CardDescription>This card has hover effects</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Try hovering over this card to see the interactive effects.</p>
    </CardContent>
  </Card>
);
