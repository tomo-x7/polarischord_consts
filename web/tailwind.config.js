/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
			screens: {
				tablet: { max: "720px" },
				sp: { max: "480px" },
				forFilter: { max: "570px" },
			},
		},
	},
};
