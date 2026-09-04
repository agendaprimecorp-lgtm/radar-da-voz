import type { Meta } from "@storybook/react";

const meta = {
  title: "Design System/Typography",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

export const Headings = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-5xl font-bold tracking-tight">Heading 1 - 48px Bold</h1>
      <p className="text-sm text-gray-500 mt-2">font-size: 48px | font-weight: 700</p>
    </div>

    <div>
      <h2 className="text-4xl font-bold tracking-tight">Heading 2 - 36px Bold</h2>
      <p className="text-sm text-gray-500 mt-2">font-size: 36px | font-weight: 700</p>
    </div>

    <div>
      <h3 className="text-3xl font-bold">Heading 3 - 30px Bold</h3>
      <p className="text-sm text-gray-500 mt-2">font-size: 30px | font-weight: 700</p>
    </div>

    <div>
      <h4 className="text-2xl font-semibold">Heading 4 - 24px Semibold</h4>
      <p className="text-sm text-gray-500 mt-2">font-size: 24px | font-weight: 600</p>
    </div>

    <div>
      <h5 className="text-xl font-semibold">Heading 5 - 20px Semibold</h5>
      <p className="text-sm text-gray-500 mt-2">font-size: 20px | font-weight: 600</p>
    </div>

    <div>
      <h6 className="text-lg font-semibold">Heading 6 - 18px Semibold</h6>
      <p className="text-sm text-gray-500 mt-2">font-size: 18px | font-weight: 600</p>
    </div>
  </div>
);

export const BodyText = () => (
  <div className="space-y-8">
    <div>
      <p className="text-base leading-relaxed">
        Body Text - 16px Regular. This is the default text size used for body copy and general content.
        It has a line-height of 1.5 for optimal readability.
      </p>
      <p className="text-sm text-gray-500 mt-2">font-size: 16px | font-weight: 400 | line-height: 1.5</p>
    </div>

    <div>
      <p className="text-sm leading-relaxed">
        Small Text - 14px Regular. This is used for secondary information, captions, and metadata.
        It maintains readability while taking up less space.
      </p>
      <p className="text-xs text-gray-500 mt-2">font-size: 14px | font-weight: 400 | line-height: 1.5</p>
    </div>

    <div>
      <p className="text-xs leading-relaxed">
        Extra Small Text - 12px Regular. Used for very small details and helper text.
      </p>
      <p className="text-xs text-gray-500 mt-2">font-size: 12px | font-weight: 400</p>
    </div>
  </div>
);

export const TextStyles = () => (
  <div className="space-y-8">
    <div>
      <p className="text-base font-semibold">Semibold Text - 600 weight</p>
      <p className="text-sm text-gray-500 mt-2">Used for emphasis and important information</p>
    </div>

    <div>
      <p className="text-base font-bold">Bold Text - 700 weight</p>
      <p className="text-sm text-gray-500 mt-2">Used for strong emphasis and highlights</p>
    </div>

    <div>
      <p className="text-base italic">Italic Text - Emphasis and citations</p>
      <p className="text-sm text-gray-500 mt-2">Used sparingly for emphasis</p>
    </div>

    <div>
      <p className="text-base">
        <span className="underline">Underlined Text</span> - Links and important emphasis
      </p>
      <p className="text-sm text-gray-500 mt-2">Used for hyperlinks and visual emphasis</p>
    </div>
  </div>
);

export const FontFamilies = () => (
  <div className="space-y-8">
    <div>
      <p className="font-sans text-lg">
        Sans Serif Font - Used for all UI text and body content
      </p>
      <p className="text-sm text-gray-500 mt-2">Default font family: system-ui, -apple-system, sans-serif</p>
    </div>

    <div>
      <p className="font-mono text-base">
        Monospace Font - Used for code and technical content
      </p>
      <p className="text-sm text-gray-500 mt-2">Font family: ui-monospace, SFMono-Regular, monospace</p>
    </div>
  </div>
);
