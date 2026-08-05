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
                // Mobile kết thúc ở 639.98px; từ 640px trở lên ưu tiên dùng cùng
                // layout non-mobile, chỉ tách tablet khi thật sự có lỗi bố cục.
                lg: '1024px',
                md: '1024px',
                sm: '640px',
                // Giữ các alias lớn hơn cùng một mốc desktop để không vô tình
                // tạo thêm layout mới ở màn hình rộng.
                xl: '1024px',
                '2xl': '1024px',
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
