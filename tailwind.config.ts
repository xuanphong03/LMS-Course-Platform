import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './hooks/**/*.{js,ts,jsx,tsx,mdx}',
        './layouts/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            screens: {
                lg: '1025px',
                sm: '640px',
                xlg: {
                    max: '1023.98px',
                },
                xsm: {
                    max: '639.98px',
                },
                tablet: {
                    min: '640px',
                    max: '1023.98px',
                },
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.flex-center': {
                    '@apply flex items-center justify-center': {},
                },
                '.absolute-center': {
                    '@apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2': {},
                },
            })
        }),
    ],
}
export default config
