/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    light: "hsl(var(--primary-light))",
                    dark: "hsl(var(--primary-dark))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    light: "hsl(var(--secondary-light))",
                    dark: "hsl(var(--secondary-dark))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                    light: "hsl(var(--accent-light))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                success: "hsl(var(--success))",
                warning: "hsl(var(--warning))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'fade-up-delay-1': 'fadeUp 0.6s ease-out 0.1s forwards',
                'fade-up-delay-2': 'fadeUp 0.6s ease-out 0.2s forwards',
                'fade-up-delay-3': 'fadeUp 0.6s ease-out 0.3s forwards',
                'float': 'float 3s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    'to': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px hsl(212 100% 48% / 0.3)' },
                    '50%': { boxShadow: '0 0 30px hsl(212 100% 48% / 0.5)' },
                },
            },
            boxShadow: {
                'soft': '0 4px 6px -1px hsl(212 100% 48% / 0.1)',
                'card': '0 10px 25px -3px hsl(212 100% 48% / 0.1)',
                'glow': '0 0 20px hsl(212 100% 48% / 0.3)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};