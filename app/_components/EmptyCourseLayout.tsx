import { buttonVariants } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface EmptyCourseLayoutProps {
    title: string
    description: string
    buttonLink: string
    buttonText: string
}
export default function EmptyCourseLayout({ title, description, buttonLink, buttonText }: EmptyCourseLayoutProps) {
    return (
        <div className='relative w-full'>
            <Image
                alt='Empty course'
                width={1024}
                height={920}
                src='/images/empty-image.png'
                className='mx-auto h-auto w-140'
            />
            <div className='absolute top-1/2 left-1/2 -translate-1/2 p-2 backdrop-blur-[1px]'>
                <div className='flex flex-col items-center space-y-2'>
                    <p className='text-2xl font-bold uppercase'>{title}</p>
                    <p className='text-foreground text-sm'>{description}</p>
                    <Link
                        href={buttonLink}
                        className={buttonVariants()}
                    >
                        <PlusIcon /> {buttonText}
                    </Link>
                </div>
            </div>
        </div>
    )
}
