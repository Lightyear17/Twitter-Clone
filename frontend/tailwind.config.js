import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
// /** @type {import('tailwindcss').Config} */
export default {
	mode: 'jit', 
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/daisyui/**/*.js", 
	],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		base: true,
		themes: [
			"light",
			{
				black: {
					...daisyUIThemes["black"],
					primary: "rgb(29, 155, 240)",
					secondary: "rgb(24, 24, 24)",
				},
			},
		],
	},
};