import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-poppins',
})

export const metadata: Metadata = {
    title: 'PhysioCare - Your Health, Our Priority',
    description: 'Connect with India\'s top doctors and physiotherapists for personalized care, right from your home or at our clinics.',
    keywords: 'physiotherapy, healthcare, online consultation, home visits, doctors, medical care',
    authors: [{ name: 'PhysioCare Team' }],
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body className="font-inter antialiased">
                {children}
            </body>
        </html>
    )
}
