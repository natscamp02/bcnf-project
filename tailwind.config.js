module.exports = {
	content: ['./views/**/*.ejs'],
	theme: {
		container: {
			center: true,
			padding: '3rem',
		},

		extend: {
			fontFamily: {
				poppins: ["'Poppins'", 'sans-serif'],
				'open-sans': ["'Open Sans'", 'sans-serif'],
			},

			gridTemplateColumns: {
				layout: 'max-content minmax(0, 1fr)',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
