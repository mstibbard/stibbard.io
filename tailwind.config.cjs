const { spacing } = require('tailwindcss/defaultTheme');

const config = {
  mode: 'jit',
  darkMode: 'class',
  purge: {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    safelist: [
      'bg-green-50',
      'text-green-700',
      'text-green-800',
      'hover:text-green-900',
      'focus:ring-green-400',
      'bg-red-50',
      'text-red-700',
      'text-red-800',
      'hover:text-red-900',
      'focus:ring-red-400',
      'bg-yellow-50',
      'text-yellow-700',
      'text-yellow-800',
      'hover:text-yellow-900',
      'focus:ring-yellow-400',
      'bg-blue-50',
      'text-blue-700',
      'text-blue-800',
      'hover:text-blue-900',
      'focus:ring-blue-400'
    ]
  },
  theme: {
    extend: {
      colors: {
        'blue-opaque': 'rgb(13 42 148 / 18%)'
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif']
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.blue.500'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.blue.700'),
                textDecoration: 'underline'
              },
              code: { color: theme('colors.blue.400') }
            },
            blockquote: {
              borderLeftColor: theme('colors.green.600')
            },
            'h2,h3,h4': {
              'scroll-margin-top': spacing[32]
            },
            ol: {
              li: {
                '&:before': { color: theme('colors.green.600') }
              }
            },
            ul: {
              li: {
                '&:before': { backgroundColor: theme('colors.green.600') }
              }
            },
            code: {
              color: theme('colors.pink.500')
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
            'code::before': false,
            'code::after': false
          }
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.600')
              },
              code: { color: theme('colors.blue.400') }
            },
            blockquote: {
              borderLeftColor: theme('colors.yellow.600'),
              color: theme('colors.gray.300')
            },
            'h2,h3,h4': {
              color: theme('colors.gray.100'),
              'scroll-margin-top': spacing[32]
            },
            hr: { borderColor: theme('colors.gray.700') },
            ol: {
              li: {
                '&:before': { color: theme('colors.yellow.600') }
              }
            },
            ul: {
              li: {
                '&:before': { backgroundColor: theme('colors.yellow.600') }
              }
            },
            strong: { color: theme('colors.gray.300') },
            thead: {
              color: theme('colors.gray.100')
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700')
              }
            },
            pre: {
              backgroundColor: theme('colors.gray.700')
            }
          }
        }
      })
    }
  },
  variants: {
    typography: ['dark']
  },
  plugins: [require('@tailwindcss/typography')]
};

module.exports = config;
