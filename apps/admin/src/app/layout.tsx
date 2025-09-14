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
    title: 'PhysioCare Admin - Platform Management Dashboard',
    description: 'Comprehensive admin dashboard for managing the PhysioCare telehealth platform',
    keywords: ['admin', 'dashboard', 'physiotherapy', 'telehealth', 'management', 'platform'],
    authors: [{ name: 'PhysioCare Team' }],
    creator: 'PhysioCare',
    publisher: 'PhysioCare',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3002'),
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3002',
        title: 'PhysioCare Admin - Platform Management Dashboard',
        description: 'Comprehensive admin dashboard for managing the PhysioCare telehealth platform',
        siteName: 'PhysioCare Admin',
    },
    robots: {
        index: false, // Admin dashboard should not be indexed
        follow: false,
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
                                    primary: '#10B981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 5000,
                                iconTheme: {
                                    primary: '#EF4444',
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
