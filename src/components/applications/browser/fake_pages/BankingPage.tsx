import React, { useState } from "react";
import { CaptchaMain } from "./captcha/CaptchaMain";

type BankingVariant = "modern" | "corporate" | "dark" | "colorful" | "classic";

const BankingPage: React.FC = () => {
  const defaultEmail = "hlaoutaris@gmail.com";
  const defaultPassword = "123456432957824";
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [currentVariant, setCurrentVariant] =
    useState<BankingVariant>("modern");

  const variants = [
    { key: "dark" as BankingVariant, name: "Dark Theme" },

    { key: "modern" as BankingVariant, name: "Modern Minimalist" },
    { key: "corporate" as BankingVariant, name: "Corporate Traditional" },
    // { key: "colorful" as BankingVariant, name: "Colorful Modern" },
    // { key: "classic" as BankingVariant, name: "Classic Banking" },
  ];

  const handleVariantChange = (variant: BankingVariant) => {
    setCurrentVariant(variant);
    console.log("currentVariant in handleVariantChange: ", variant);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === defaultEmail && password === defaultPassword) {
      console.log("Login successful");
    } else {
      console.log("Login failed");
    }
  };

  const ModernMinimalistVariant = () => (
    <div className="bg-gray-50 flex flex-col items-center justify-center p-4 h-full">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Secure Bank</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );

  const CorporateTraditionalVariant = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-blue-900 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">First National Bank</h1>
          <p className="text-blue-200">Trusted Banking Since 1925</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Online Banking Login
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-blue-900 focus:outline-none"
                placeholder="Enter User ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-blue-900 focus:outline-none"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm text-gray-600">Remember User ID</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors"
            >
              LOG IN
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm">
            <a href="#" className="text-blue-900 hover:underline">
              Forgot Password?
            </a>
            <a href="#" className="text-blue-900 hover:underline">
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const DarkThemeVariant = () => (
    <div className="bg-gray-900 flex flex-col items-center justify-center p-4 h-full">
      <div className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">NB</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Neo Bank</h1>
          <p className="text-gray-400 mt-2">Digital banking reimagined</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Access Account
          </button>
        </form>

        <div className="mt-6 flex justify-center space-x-6 text-sm">
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Reset Password
          </a>
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Help Center
          </a>
        </div>
      </div>
    </div>
  );

  const renderCurrentVariant = () => {
    switch (currentVariant) {
      case "modern":
        return <ModernMinimalistVariant />;
      case "corporate":
        return <CorporateTraditionalVariant />;
      case "dark":
        return <DarkThemeVariant />;
      // case "colorful":
      //   return <ColorfulModernVariant />;
      // case "classic":
      //   return <ClassicBankingVariant />;
      default:
        return <ModernMinimalistVariant />;
    }
  };

  return (
    <div className="relative w-full h-full bg-red-100">
      {/* Variant Controller */}
      <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 border w-1/8">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          Banking Variations
        </h3>
        <div className="space-y-2 w-full h-full">
          {variants.map((variant) => (
            <button
              key={variant.key}
              onClick={() => handleVariantChange(variant.key)}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                currentVariant === variant.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute h-full w-full flex flex-col justify-center items-center bg-blue-100/10">
        <CaptchaMain />
      </div>

      {/* Current Variant Display */}
      {renderCurrentVariant()}
    </div>
  );
};

export default BankingPage;
