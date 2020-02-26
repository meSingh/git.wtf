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
            width: {
                80: '20rem'
            },
            colors: {

                // brand: '#e84545',
                brand: '#2D3748',
                'brand-alt': '#303133'
                // brand: colors.indigo[600]
            }
        },
        pagination: theme => ({
            // Costumize the color only. (optional)
            // color: colors['teal-dark'],

            // Costumize styling using @apply. (optional)
            wrapper: 'flex px-0 py-6 justify-center list-none w-screen -mx-2 overflow-x-scroll',

            link: 'bg-gray-200 py-2 px-5 block text-gray-600 no-underline',
            linkActive: 'text-white bg-brand',
            linkHover: 'text-white bg-brand',
            linkDisabled: 'bg-gray-100 py-2 px-5 block text-gray-500 no-underline'

            // Costumize styling using CSS-in-JS. (optional)
            // wrapper: {
            //     'display': 'flex',
            //     '@apply px-0 justify-between list-none': {},
            // }
        })
    },
    variants: {
        margin: ['responsive', 'hover', 'focus'],
        textColor: ['responsive', 'hover', 'focus', 'group-hover'],
        width: ['responsive', 'hover', 'focus', 'focus-within'],
    },
    plugins: [
        require('tailwindcss-plugins/pagination'),

        // ...
    ],
}
