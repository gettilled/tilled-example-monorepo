/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  important: true,
  theme: {
    fontSize: {
      xs: "0.625rem",
      sm: "0.75rem",
      md: "0.8125rem",
      base: "0.875rem",
      lg: "1rem",
      xl: "1.125rem",
      "2xl": "1.25rem",
      "3xl": "1.5rem",
      "4xl": "2rem",
      "5xl": "2.25rem",
      "6xl": "2.5rem",
      "7xl": "3rem",
      "8xl": "4rem",
      "9xl": "6rem",
      "10xl": "8rem",
      h1: [
        "32px",
        {
          lineHeight: "40px",
        },
      ],
      h2: [
        "28px",
        {
          lineHeight: "40px",
        },
      ],
      h3: [
        "22px",
        {
          lineHeight: "24px",
        },
      ],
      h4: [
        "18px",
        {
          lineHeight: "20px",
        },
      ],
      h5: [
        "16px",
        {
          lineHeight: "16px",
        },
      ],
      h6: [
        "14px",
        {
          lineHeight: "16px",
        },
      ],
      p1: [
        "18px",
        {
          lineHeight: "27px",
        },
      ],
      p2: [
        "16px",
        {
          lineHeight: "24px",
        },
      ],
      p3: [
        "14px",
        {
          lineHeight: "20px",
        },
      ],
      p4: [
        "12px",
        {
          lineHeight: "16px",
        },
      ],
    },
    borderColor:
      (theme) => ({
        ...theme("colors"),
        DEFAULT: theme("colors.secondary.100", "currentColor"),
      }),
    colors: {
      default: {
        50: "#eff9ff",
        100: "#def2ff",
        200: "#b7e7ff",
        300: "#77d5ff",
        400: "#2ec1ff",
        500: "#03a9f4",
        600: "#0087d1",
        700: "#006ba9",
        800: "#015b8b",
        900: "#074b73",
        950: "#05304c",
      },
      secondary: {
        50: "#f6f7f9",
        100: "#edeef1",
        200: "#d6dae1",
        300: "#b2bac7",
        400: "#8995a7",
        500: "#677489",
        600: "#556074",
        700: "#454e5f",
        800: "#3c4350",
        900: "#353a45",
        950: "#23272e",
      },
      accent: {
        50: "#f2f7fc",
        100: "#e1edf8",
        200: "#cadff3",
        300: "#a5cceb",
        400: "#7bb0df",
        500: "#5b94d6",
        600: "#477bc9",
        700: "#3d67b8",
        800: "#375596",
        900: "#314977",
        950: "#1b253b",
      },
      warn: {
        50: "#fff3f1",
        100: "#ffe5e0",
        200: "#ffcfc6",
        300: "#ffae9f",
        400: "#ff7f68",
        500: "#fb5638",
        600: "#ea4628",
        700: "#c42d11",
        800: "#a22812",
        900: "#862716",
        950: "#491006",
      },
      white: "#FFFFFF",
    },
    extend: {
      borderWidth: {
        "1/2": "0.5px",
      },
    },
    corePlugins: {
      appearance: false,
      container: false,
      float: true,
      clear: false,
      placeholderColor: false,
      placeholderOpacity: false,
      verticalAlign: true,
    },
    plugins: [require('@tailwindcss/typography')({ modifiers: ['sm', 'lg'] }), require('@tailwindcss/aspect-ratio')],
  },
};
