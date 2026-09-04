import type { Meta } from "@storybook/react";

const meta = {
  title: "Components/Icons",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

const iconList = [
  "🏠 Home",
  "👤 User",
  "👥 Users",
  "🔐 Lock",
  "🔓 Unlock",
  "🔎 Search",
  "🔔 Bell",
  "💬 Message",
  "📧 Mail",
  "⭐ Star",
  "❤️ Heart",
  "✓ Check",
  "✕ Close",
  "⚙️ Settings",
  "📊 Chart",
  "📈 Trending",
  "💰 Money",
  "🎤 Microphone",
  "🎵 Music",
  "🎬 Video",
  "📸 Camera",
  "🎨 Palette",
  "✏️ Edit",
  "🗑️ Trash",
  "📥 Download",
  "📤 Upload",
  "🔗 Link",
  "🌍 Globe",
  "📍 Location",
  "🕐 Clock",
  "📅 Calendar",
  "⚡ Lightning",
  "🚀 Rocket",
  "🏆 Trophy",
  "🎯 Target",
  "🔥 Fire",
  "💎 Diamond",
  "🌟 Star",
  "✨ Sparkles",
  "🎁 Gift",
];

export const AllIcons = () => (
  <div className="space-y-6">
    <p className="text-sm text-gray-400">
      Using emoji icons from the system. In production, replace these with your SVG icon library.
    </p>
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {iconList.map((icon) => (
        <div
          key={icon}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
        >
          <span className="text-2xl mb-2">{icon.split(" ")[0]}</span>
          <span className="text-xs text-gray-400 text-center">{icon.split(" ")[1]}</span>
        </div>
      ))}
    </div>
  </div>
);

export const IconSizes = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-semibold mb-4">Small (16px)</h3>
      <div className="flex gap-4">
        <span className="text-base">🎤</span>
        <span className="text-base">🎵</span>
        <span className="text-base">🎬</span>
        <span className="text-base">📸</span>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Medium (24px)</h3>
      <div className="flex gap-4">
        <span className="text-2xl">🎤</span>
        <span className="text-2xl">🎵</span>
        <span className="text-2xl">🎬</span>
        <span className="text-2xl">📸</span>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Large (32px)</h3>
      <div className="flex gap-4">
        <span className="text-4xl">🎤</span>
        <span className="text-4xl">🎵</span>
        <span className="text-4xl">🎬</span>
        <span className="text-4xl">📸</span>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Extra Large (48px)</h3>
      <div className="flex gap-4">
        <span className="text-6xl">🎤</span>
        <span className="text-6xl">🎵</span>
        <span className="text-6xl">🎬</span>
        <span className="text-6xl">📸</span>
      </div>
    </div>
  </div>
);

export const IconsWithText = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <span className="text-xl">🎤</span>
      <span>Voice Acting</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">🎵</span>
      <span>Music Production</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">🎬</span>
      <span>Video Editing</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">📸</span>
      <span>Photography</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">⭐</span>
      <span>Featured Project</span>
    </div>
  </div>
);

export const StatusIcons = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <span className="text-xl">✓</span>
      <span className="text-green-500">Completed</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">⚡</span>
      <span className="text-yellow-500">In Progress</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">✕</span>
      <span className="text-red-500">Failed</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">🕐</span>
      <span className="text-blue-500">Waiting</span>
    </div>
  </div>
);

export const NavigationIcons = () => (
  <div className="flex gap-6 p-4 bg-dark-800 rounded-lg">
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80">
      <span className="text-2xl">🏠</span>
      <span className="text-xs">Home</span>
    </div>
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80">
      <span className="text-2xl">🔎</span>
      <span className="text-xs">Search</span>
    </div>
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80">
      <span className="text-2xl">💬</span>
      <span className="text-xs">Messages</span>
    </div>
    <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80">
      <span className="text-2xl">👤</span>
      <span className="text-xs">Profile</span>
    </div>
  </div>
);
