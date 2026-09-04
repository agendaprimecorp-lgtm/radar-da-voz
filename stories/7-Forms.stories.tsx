import type { Meta } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const meta = {
  title: "Components/Forms",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

export const BasicForm = () => (
  <form className="space-y-4 max-w-md">
    <div>
      <label className="block text-sm font-semibold mb-2">Name</label>
      <Input placeholder="Enter your name" />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">Email</label>
      <Input type="email" placeholder="your@email.com" />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">Message</label>
      <textarea
        placeholder="Your message..."
        className="w-full h-24 rounded-lg border-2 bg-dark-800 px-4 py-2 text-base text-dark-50 placeholder:text-dark-400 border-dark-600 focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/20"
      />
    </div>

    <div className="flex gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button>Submit</Button>
    </div>
  </form>
);

export const FormWithValidation = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(value));
  };

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-semibold mb-2">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="your@email.com"
          className={email && !isValid ? "border-red-500" : email && isValid ? "border-green-500" : ""}
        />
        {email && !isValid && (
          <p className="text-red-500 text-sm mt-1">Invalid email format</p>
        )}
        {email && isValid && (
          <p className="text-green-500 text-sm mt-1">✓ Valid email</p>
        )}
      </div>

      <Button disabled={!email || !isValid}>
        Continue
      </Button>
    </div>
  );
};

export const FormWithTabs = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="max-w-2xl">
      <div className="flex gap-4 border-b border-dark-700 mb-6">
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "account"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-gray-400"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "settings"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-gray-400"
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === "account" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <Input placeholder="João Silva" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input type="email" placeholder="joao@email.com" />
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span>Two-Factor Authentication</span>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      )}

      <Button className="mt-6">Save Changes</Button>
    </div>
  );
};

export const FormWithMultipleSteps = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-md">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step
                  ? "bg-primary-500 text-white"
                  : "bg-dark-700 text-gray-400"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex gap-2 h-1">
          <div className={`flex-1 rounded-full ${step >= 1 ? "bg-primary-500" : "bg-dark-700"}`} />
          <div className={`flex-1 rounded-full ${step >= 2 ? "bg-primary-500" : "bg-dark-700"}`} />
          <div className={`flex-1 rounded-full ${step >= 3 ? "bg-primary-500" : "bg-dark-700"}`} />
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Info</h3>
          <Input placeholder="First name" />
          <Input placeholder="Last name" />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Info</h3>
          <Input type="email" placeholder="Email" />
          <Input type="tel" placeholder="Phone" />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Confirmation</h3>
          <p className="text-gray-400">Review your information</p>
          <div className="bg-dark-800 p-4 rounded-lg space-y-2">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john@email.com</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-8">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setStep(Math.min(3, step + 1))}
          className="flex-1"
        >
          {step === 3 ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export const FormWithInlineValidation = () => {
  const [password, setPassword] = useState("");

  const isLongEnough = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-semibold mb-2">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Password Requirements:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={isLongEnough ? "success" : "default"} size="sm">
              {isLongEnough ? "✓" : "○"}
            </Badge>
            <span className="text-sm">At least 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={hasNumber ? "success" : "default"} size="sm">
              {hasNumber ? "✓" : "○"}
            </Badge>
            <span className="text-sm">Contains a number</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={hasSpecial ? "success" : "default"} size="sm">
              {hasSpecial ? "✓" : "○"}
            </Badge>
            <span className="text-sm">Contains special character</span>
          </div>
        </div>
      </div>

      <Button disabled={!isLongEnough || !hasNumber || !hasSpecial}>
        Create Account
      </Button>
    </div>
  );
};

export const SearchForm = () => (
  <div className="max-w-md">
    <div className="relative">
      <Input
        type="search"
        placeholder="Search talents by name, skill, or location..."
        className="pl-10"
      />
      <span className="absolute left-3 top-3 text-gray-400">🔍</span>
    </div>

    <div className="mt-4 space-y-2">
      <p className="text-sm font-semibold">Filters:</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">Voice Acting ✕</Badge>
        <Badge variant="secondary">Brazil ✕</Badge>
        <Badge variant="primary">⭐ 4+ Rating ✕</Badge>
      </div>
    </div>
  </div>
);
