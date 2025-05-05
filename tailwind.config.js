// tailwind.config.js
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Gray shades used in backgrounds and borders
          gray: {
            100: "#f3f4f6", // Light text
            300: "#d1d5db", // Label text
            400: "#9ca3af", // Secondary text
            600: "#4b5563", // Input borders
            700: "#374151", // Input background
            800: "#1f2937", // Main background
          },
          // Indigo colors for primary buttons and focus states
          indigo: {
            300: "#a5b4fc", // Hover states
            400: "#818cf8", // Links
            500: "#6366f1", // Loading state
            600: "#4f46e5", // Primary button
            700: "#4338ca", // Hover state for buttons
          },
          // Green for success states
          green: {
            300: "#86efac", // Success text
            400: "#4ade80", // Success icon
            700: "#047857", // Success border
            900: "#064e3b", // Success background (with opacity)
          },
          // Red for error states
          red: {
            200: "#fecaca", // Error text
            400: "#f87171", // Error icon
            700: "#b91c1c", // Error border
            900: "#7f1d1d", // Error background (with opacity)
          },
        },
        // Additional theme extensions can be added here
        boxShadow: {
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    plugins: [],
  };