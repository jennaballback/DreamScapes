/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          primary: '#030014',
          secondary: '#151312',
          buttonText: '#364153', //gray-700
          buttonBackground: '#f3f4f6',//gray-100
          buttonBorder: '#d1d5dc', //gray-300

          subText: '#4a5565', //gray-600
          
          postBackground: '#dbeafe', //blue-100
          appBackground: '#ffffff', //entire App background white

          light: {
            100: '#D6C6FF', //purple-100 probably
            200: '#A8B5DB',
            300: '#9CA4AB',
            500: '#ad46ff', //purple-500
          },
          dark:{
            100: '#221f3d',
            200: '#0f0d23',
          },
          accent: '#AB8BFF'
        }
      },
    },
    plugins: [],
  }
