import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "link", "destructive", "success"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
    size: "default",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
    size: "default",
  },
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
    size: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
    size: "default",
  },
};

export const Success: Story = {
  args: {
    children: "Confirm",
    variant: "success",
    size: "default",
  },
};

export const AllSizes = () => (
  <div className="space-y-4">
    <div>
      <p className="text-sm font-semibold mb-2">Small</p>
      <Button size="sm">Small Button</Button>
    </div>
    <div>
      <p className="text-sm font-semibold mb-2">Default</p>
      <Button size="default">Default Button</Button>
    </div>
    <div>
      <p className="text-sm font-semibold mb-2">Large</p>
      <Button size="lg">Large Button</Button>
    </div>
    <div>
      <p className="text-sm font-semibold mb-2">Extra Large</p>
      <Button size="xl">Extra Large Button</Button>
    </div>
  </div>
);

export const AllVariants = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
    <div className="flex items-center gap-3">
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
    <div className="flex items-center gap-3">
      <Button variant="success">Success</Button>
    </div>
  </div>
);

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const Loading = () => (
  <Button disabled>
    <span className="inline-block animate-spin mr-2">⏳</span>
    Loading...
  </Button>
);

export const WithIcon = () => (
  <div className="space-y-4">
    <Button>
      <span className="mr-2">✅</span>
      Success
    </Button>
    <Button>
      <span className="mr-2">❌</span>
      Delete
    </Button>
    <Button>
      <span className="mr-2">🔗</span>
      Share
    </Button>
  </div>
);
