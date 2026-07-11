import Footer from '@/layouts/public/Footer'
import Header from '@/layouts/public/Header'

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Header />
            <main className='relative mx-auto max-w-350'>{children}</main>
            <Footer />
        </>
    )
}
