import SignInByGithub from '@/app/(auth)/login/_components/SignInByGithub'
import SignInByEmail from '@/app/(auth)/login/_components/SignInByEmail'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export default function LoginForm() {
    return (
        <Card className='gap-4'>
            <CardHeader>
                <CardTitle className='text-center text-2xl font-bold'>Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <SignInByGithub />
                <SignInByEmail />
            </CardContent>
        </Card>
    )
}
