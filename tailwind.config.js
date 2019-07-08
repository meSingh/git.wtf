const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
    theme: {
        extend: {
            boxShadow: {
                theme: '0 1px 9px rgba(203, 208, 228, .19)',
                custom: '0 1px 1px 0 rgba(0,0,0,.05)'
            },
            fontFamily: {
                brand: "'Open Sans', sans-serif"
            },
            fontSize: {
                '7xl': '5rem',
                '8xl': '6rem',
            },

            colors: {
                gray: {
                    ...colors.gray,
                    100: '#fcfbfb',
                    // '200': '#F2F6FB'
                    // '200': '#f7f7f7',
                    // 200: '#f9f7f7',
                    200: '#F9F9F9',
                    // '200': '#f2f4f6',
                    300: '#e0dede',
                    // 300: '#f6f6f6',
                    400: '#f3f3f3',
                    // '500': '#ECECEC'
                    500: '#979899',
                    600: '#6e6e70'
                },
                brand: '#e84545',
                'brand-alt': '#303133'
                // brand: colors.indigo[600]
            }
        }
    },
    variants: {
        margin: ['responsive', 'hover', 'focus']
    },
    plugins: [
        require('tailwindcss-plugins/pagination')({
            // Costumize the color only. (optional)
            // color: colors['teal-dark'],

            // Costumize styling using @apply. (optional)
            wrapper: 'flex px-0 py-6 justify-between list-none',

            link: 'bg-gray-200 py-2 px-5 block text-gray-600 no-underline',
            linkHover: 'text-white bg-brand',
            linkDisabled: 'bg-gray-100 py-2 px-5 block text-gray-500 no-underline'

            // Costumize styling using CSS-in-JS. (optional)
            // wrapper: {
            //     'display': 'flex',
            //     '@apply px-0 justify-between list-none': {},
            // }
        }),

        // ...
    ],
}
