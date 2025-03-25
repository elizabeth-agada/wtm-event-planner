/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
      "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "#2480F0", // WTM bright blue
            foreground: "#FFFFFF",
          },
          secondary: {
            DEFAULT: "#54A7ED", // WTM blue
            foreground: "#FFFFFF",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "#CAE6FF", // WTM light blue
            foreground: "#165185", // WTM dark blue
          },
          accent: {
            DEFAULT: "#00B698", // WTM teal
            foreground: "#FFFFFF",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          // WTM brand colors
          wtm: {
            "light-blue": "#CAE6FF",
            blue: "#54A7ED",
            "bright-blue": "#2480F0",
            "dark-blue": "#165185",
            navy: "#20344B",
            "light-mint": "#D1ECE3",
            green: "#00DBA2",
            teal: "#00B698",
            "dark-teal": "#0F7C67",
            "dark-green": "#1A3E38",
            black: "#202124",
            gold: "#E4C472",
            white: "#FFFFFF",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  
  