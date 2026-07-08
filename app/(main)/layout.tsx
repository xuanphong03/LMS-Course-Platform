import Header from '@/layouts/main/Header'
import Footer from '@/layouts/main/Footer'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
