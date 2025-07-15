import React, { useState, useEffect } from "react";
import { CaptchaMain } from "./captcha/CaptchaMain";

const BankingPage: React.FC = () => {
  const defaultEmail = "hlaoutaris@gmail.com";
  const defaultPassword = "123456432957824";
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // Show captcha after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCaptcha(true);
      console.log("showCaptcha in BankingPage timer: ", true);
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === defaultEmail && password === defaultPassword) {
      console.log("Login successful");
    } else {
      console.log("Login failed");
    }
  };

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

  return (
    <div className="relative w-full h-full p-4">
      {/* Banking Login Display with conditional opacity */}
      <div
        className={`relative w-full h-full transition-opacity duration-1000 ${
          showCaptcha ? "opacity-30" : "opacity-100"
        }`}
      >
        <DarkThemeVariant />
      </div>

      {/* Captcha overlay - appears after delay */}
      {showCaptcha && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-transparent z-10">
          <CaptchaMain />
        </div>
      )}
    </div>
  );
};

export default BankingPage;
