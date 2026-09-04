import type { Meta } from "@storybook/react";

const meta = {
  title: "Design System/Colors",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

export const ColorPalette = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold mb-4">Primary Colors</h2>
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        <ColorSwatch name="Primary 50" hex="#f0f5ff" />
        <ColorSwatch name="Primary 100" hex="#e0e7ff" />
        <ColorSwatch name="Primary 200" hex="#c7d2fe" />
        <ColorSwatch name="Primary 300" hex="#a5b4fc" />
        <ColorSwatch name="Primary 400" hex="#818cf8" />
        <ColorSwatch name="Primary 500" hex="#6366f1" />
        <ColorSwatch name="Primary 600" hex="#4f46e5" />
        <ColorSwatch name="Primary 700" hex="#4338ca" />
        <ColorSwatch name="Primary 800" hex="#3730a3" />
        <ColorSwatch name="Primary 900" hex="#312e81" />
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-bold mb-4">Secondary Colors</h2>
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        <ColorSwatch name="Secondary 50" hex="#f5f3ff" />
        <ColorSwatch name="Secondary 100" hex="#ede9fe" />
        <ColorSwatch name="Secondary 200" hex="#ddd6fe" />
        <ColorSwatch name="Secondary 300" hex="#c4b5fd" />
        <ColorSwatch name="Secondary 400" hex="#a78bfa" />
        <ColorSwatch name="Secondary 500" hex="#8b5cf6" />
        <ColorSwatch name="Secondary 600" hex="#7c3aed" />
        <ColorSwatch name="Secondary 700" hex="#6d28d9" />
        <ColorSwatch name="Secondary 800" hex="#5b21b6" />
        <ColorSwatch name="Secondary 900" hex="#4c1d95" />
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-bold mb-4">Status Colors</h2>
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        <ColorSwatch name="Success 500" hex="#10b981" />
        <ColorSwatch name="Error 500" hex="#ef4444" />
        <ColorSwatch name="Warning 500" hex="#f59e0b" />
        <ColorSwatch name="Info 500" hex="#06b6d4" />
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-bold mb-4">Dark Mode Colors</h2>
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        <ColorSwatch name="Dark 50" hex="#f9fafb" />
        <ColorSwatch name="Dark 100" hex="#f3f4f6" />
        <ColorSwatch name="Dark 200" hex="#e5e7eb" />
        <ColorSwatch name="Dark 400" hex="#9ca3af" />
        <ColorSwatch name="Dark 600" hex="#4b5563" />
        <ColorSwatch name="Dark 700" hex="#374151" />
        <ColorSwatch name="Dark 800" hex="#1f2937" />
        <ColorSwatch name="Dark 900" hex="#0f172a" />
      </div>
    </div>
  </div>
);

function ColorSwatch({
  name,
  hex,
}: {
  name: string;
  hex: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-24 h-24 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: hex }}
      />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500 font-mono">{hex}</p>
      </div>
    </div>
  );
}
