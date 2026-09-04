import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">Email Address</label>
      <Input type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "seu@email.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter a number...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "This input is disabled",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: "Pre-filled value",
    placeholder: "Enter text...",
  },
};

export const Variants = () => (
  <div className="space-y-4 max-w-md">
    <div>
      <label className="block text-sm font-semibold mb-2">Normal Input</label>
      <Input placeholder="Type something..." />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">With Focus (auto focus)</label>
      <Input placeholder="This has focus" autoFocus />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">Disabled Input</label>
      <Input placeholder="Disabled" disabled />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">Password Input</label>
      <Input type="password" placeholder="Enter password..." />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">Email Input</label>
      <Input type="email" placeholder="email@example.com" />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">Number Input</label>
      <Input type="number" placeholder="123" />
    </div>
  </div>
);

export const WithHelper = () => (
  <div className="space-y-2 max-w-md">
    <label className="block text-sm font-semibold">Username</label>
    <Input placeholder="Choose a username" />
    <p className="text-xs text-gray-400">Must be between 3-20 characters</p>
  </div>
);

export const WithError = () => (
  <div className="space-y-2 max-w-md">
    <label className="block text-sm font-semibold">Email</label>
    <Input
      type="email"
      placeholder="Email address"
      className="border-red-500 focus:border-red-500 focus:ring-red-500"
    />
    <p className="text-xs text-red-500">Email is invalid</p>
  </div>
);

export const WithSuccess = () => (
  <div className="space-y-2 max-w-md">
    <label className="block text-sm font-semibold">Email</label>
    <Input
      type="email"
      placeholder="Email address"
      value="valid@email.com"
      className="border-green-500 focus:border-green-500 focus:ring-green-500"
    />
    <p className="text-xs text-green-500">Email verified</p>
  </div>
);

export const SearchInput = () => (
  <div className="space-y-2 max-w-md">
    <label className="block text-sm font-semibold">Search Talents</label>
    <div className="relative">
      <Input
        type="search"
        placeholder="Search by name, skill, or location..."
        className="pl-10"
      />
      <span className="absolute left-3 top-3 text-gray-400">🔍</span>
    </div>
  </div>
);

export const Textarea = () => (
  <div className="space-y-2 max-w-md">
    <label className="block text-sm font-semibold">Message</label>
    <textarea
      placeholder="Enter your message..."
      className="flex min-h-24 w-full rounded-lg border-2 bg-dark-800 px-4 py-2 text-base text-dark-50 placeholder:text-dark-400 transition-all duration-200 border-dark-600 focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/20"
      rows={4}
    />
  </div>
);

export const ControlledInput = () => {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2 max-w-md">
      <label className="block text-sm font-semibold">Controlled Input</label>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p className="text-xs text-gray-400">Characters: {value.length}</p>
    </div>
  );
};
