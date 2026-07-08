interface EmailTemplateProps {
    otp: string
}

export default function EmailTemplate({ otp }: EmailTemplateProps) {
    return (
        <div>
            <h1>Your verification code is: {otp}</h1>
        </div>
    )
}
