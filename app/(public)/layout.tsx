import Header from '@/layouts/public/Header'
import Footer from '@/layouts/public/Footer'

export default function PublicLayout({
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
