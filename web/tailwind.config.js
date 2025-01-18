//@ts-check

import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: { screens: { tablet: { max: "720px" }, sp: { max: "480px" }, forFilter: { max: "570px" } } },
	},
	plugins: [
		plugin(({ addVariant }) => {
			addVariant("hover", "@media(any-hover:hover){ &:where(:any-link, :enabled, summary):hover }");
		}),
	],
};
