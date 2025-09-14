import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: 'PhysioCare - All-in-One Telehealth & Therapy Platform',
    description: 'Deliver seamless, high-quality healthcare and physiotherapy experiences to every Indian home and hospital—where expert consults, therapy, and recovery are democratized, personalized, and always a tap away.',
    keywords: ['physiotherapy', 'telehealth', 'healthcare', 'therapy', 'online consultation', 'home visit'],
    authors: [{ name: 'PhysioCare Team' }],
    creator: 'PhysioCare',
    publisher: 'PhysioCare',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001'),
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001',
        title: 'PhysioCare - All-in-One Telehealth & Therapy Platform',
        description: 'Deliver seamless, high-quality healthcare and physiotherapy experiences to every Indian home and hospital.',
        siteName: 'PhysioCare',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PhysioCare - All-in-One Telehealth & Therapy Platform',
        description: 'Deliver seamless, high-quality healthcare and physiotherapy experiences to every Indian home and hospital.',
        creator: '@physiocare',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body className="font-sans antialiased">
                <Providers>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#22c55e',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 5000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}
