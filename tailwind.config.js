/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"    
  ],
  theme: {
    extend:{
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      }       
    }    
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

