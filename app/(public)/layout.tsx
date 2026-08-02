import Header from '@/layouts/public/Header'

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}
