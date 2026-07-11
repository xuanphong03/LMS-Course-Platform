import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureProps {
    title: string
    description: string
    icon: string
}

const features: FeatureProps[] = [
    {
        title: 'Comprehensive Courses',
        description:
            'Access a wide range of courses covering various subjects and skill levels, designed to meet the needs of learners at every stage of their educational journey.',
        icon: '📚',
    },
    {
        title: 'Interactive Learning',
        description:
            'Engaging and interactive courses that incorporate multimedia elements, quizzes, and hands-on activities to enhance the learning experience and promote active participation.',
        icon: '🎮',
    },
    {
        title: 'Progress Tracking',
        description:
            'Monitor your learning progress with detailed analytics and insights, helping you stay on track and achieve your educational goals.',
        icon: '📊',
    },
    {
        title: 'Community Support',
        description:
            'Connect with fellow learners and educators in our vibrant community, sharing knowledge, experiences, and insights to enhance your learning journey.',
        icon: '👥',
    },
]

export default function FeaturesSection() {
    return (
        <section className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {features?.map((feature, index) => (
                <Card
                    key={index}
                    className='transition-shadow hover:shadow-lg'
                >
                    <CardHeader>
                        <div className='mb-4 text-4xl'>{feature.icon}</div>
                        <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground'>{feature.description}</p>
                    </CardContent>
                </Card>
            ))}
        </section>
    )
}
