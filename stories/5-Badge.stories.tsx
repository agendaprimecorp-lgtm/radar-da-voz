import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "error", "warning", "default"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Error: Story = {
  args: {
    children: "Error",
    variant: "error",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const AllVariants = () => (
  <div className="space-y-4">
    <div>
      <p className="text-sm font-semibold mb-2">Medium Size</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="default">Default</Badge>
      </div>
    </div>

    <div>
      <p className="text-sm font-semibold mb-2">Small Size</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary" size="sm">Primary</Badge>
        <Badge variant="secondary" size="sm">Secondary</Badge>
        <Badge variant="success" size="sm">Success</Badge>
        <Badge variant="error" size="sm">Error</Badge>
        <Badge variant="warning" size="sm">Warning</Badge>
      </div>
    </div>

    <div>
      <p className="text-sm font-semibold mb-2">Large Size</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary" size="lg">Primary</Badge>
        <Badge variant="secondary" size="lg">Secondary</Badge>
        <Badge variant="success" size="lg">Success</Badge>
        <Badge variant="error" size="lg">Error</Badge>
        <Badge variant="warning" size="lg">Warning</Badge>
      </div>
    </div>
  </div>
);

export const StatusBadges = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <span>Profile Status:</span>
      <Badge variant="success">✓ Active</Badge>
    </div>
    <div className="flex items-center gap-2">
      <span>Verification:</span>
      <Badge variant="warning">⚠ Pending</Badge>
    </div>
    <div className="flex items-center gap-2">
      <span>Payment:</span>
      <Badge variant="error">✗ Failed</Badge>
    </div>
  </div>
);

export const SkillBadges = () => (
  <div className="space-y-2">
    <p className="text-sm font-semibold mb-3">Skills & Tags</p>
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Voice Acting</Badge>
      <Badge variant="primary">Dubbing</Badge>
      <Badge variant="secondary">Narration</Badge>
      <Badge variant="secondary">Commercial</Badge>
      <Badge variant="primary">Portuguese</Badge>
      <Badge variant="primary">English</Badge>
    </div>
  </div>
);

export const CategoryBadges = () => (
  <div className="space-y-2">
    <p className="text-sm font-semibold mb-3">Project Categories</p>
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" size="sm">Podcast</Badge>
      <Badge variant="secondary" size="sm">Audiobook</Badge>
      <Badge variant="secondary" size="sm">Commercial</Badge>
      <Badge variant="secondary" size="sm">Anime</Badge>
      <Badge variant="secondary" size="sm">Documentary</Badge>
      <Badge variant="secondary" size="sm">Audiovisual</Badge>
    </div>
  </div>
);

export const WithIcon = () => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">✓ Verified</Badge>
      <Badge variant="error">✗ Blocked</Badge>
      <Badge variant="warning">⚠ Review Needed</Badge>
      <Badge variant="primary">⭐ Featured</Badge>
    </div>
  </div>
);
