module.exports = {
    theme: {
        extend: {
            boxShadow: {
                theme: '0 1px 9px rgba(203, 208, 228, .19)'
            },
            fontFamily: {
                brand: "'Open Sans', sans-serif"
            },
            fontSize: {
                '7xl': '5rem',
                '8xl': '6rem',
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
            wrapper: 'flex px-0 justify-between list-none',

            link: 'bg-gray-200 py-3 px-8 block text-gray-600 no-underline',
            linkHover: 'text-white bg-indigo-600'

            // Costumize styling using CSS-in-JS. (optional)
            // wrapper: {
            //     'display': 'flex',
            //     '@apply px-0 justify-between list-none': {},
            // }
        }),

        // ...
    ],
}
