import { Body, Button, Container, Head, Hr, Html, Preview, Section, Text } from '@react-email/components'
import { env } from '@/lib/env'

interface EmailTemplateProps {
    otp: string
}

/**
 * Render email xác thực OTP với cấu trúc ưu tiên khả năng đọc trên email client.
 *
 * Giữ toàn bộ style ở dạng inline để Resend và các email client phổ biến không
 * loại bỏ layout khi xử lý CSS của email HTML.
 */
export default function EmailTemplate({ otp }: EmailTemplateProps) {
    return (
        <Html lang='en'>
            <Head />
            <Preview>Your Ph.Hub verification code is ready.</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Section style={styles.header}>
                        <Text style={styles.logo}>
                            <span style={styles.logoMark}>P</span>
                            <span style={styles.logoName}>Ph.Hub</span>
                        </Text>
                        <Text style={styles.headerLabel}>ACCOUNT SECURITY</Text>
                    </Section>

                    <Section style={styles.content}>
                        <Text style={styles.kicker}>Verify your email</Text>
                        <Text style={styles.heading}>One quick step to keep learning.</Text>
                        <Text style={styles.copy}>
                            Use the verification code below to finish signing in to your Ph.Hub account. This code is
                            valid for a limited time.
                        </Text>

                        <Section style={styles.codePanel}>
                            <Text style={styles.codeLabel}>YOUR VERIFICATION CODE</Text>
                            <Text style={styles.code}>{otp}</Text>
                            <Text style={styles.codeHint}>Enter this code in the verification window.</Text>
                        </Section>

                        <Button
                            href={env.BETTER_AUTH_URL}
                            style={styles.button}
                        >
                            Return to Ph.Hub
                        </Button>

                        <Text style={styles.securityNote}>
                            If you did not request this code, you can safely ignore this email. Never share your code
                            with anyone.
                        </Text>
                    </Section>

                    <Hr style={styles.divider} />

                    <Section style={styles.footer}>
                        <Text style={styles.footerTitle}>Learn with purpose.</Text>
                        <Text style={styles.footerCopy}>Practical courses for meaningful progress.</Text>
                        <Text style={styles.footerMeta}>
                            © {new Date().getFullYear()} Ph.Hub · All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

const styles = {
    body: {
        margin: 0,
        padding: '32px 16px',
        backgroundColor: '#f4f3f8',
        color: '#1c1b22',
        fontFamily: 'Arial, Helvetica, sans-serif',
    },
    container: {
        maxWidth: '560px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid #e7e4ee',
        borderRadius: '20px',
        overflow: 'hidden' as const,
    },
    header: {
        padding: '28px 36px 24px',
        backgroundColor: '#17151e',
    },
    logo: {
        margin: 0,
        color: '#ffffff',
        fontSize: '20px',
        lineHeight: '28px',
        fontWeight: 700,
    },
    logoMark: {
        display: 'inline-block',
        width: '28px',
        height: '28px',
        marginRight: '8px',
        borderRadius: '8px',
        backgroundColor: '#8b5cf6',
        color: '#ffffff',
        textAlign: 'center' as const,
        lineHeight: '28px',
    },
    logoName: {
        verticalAlign: 'middle' as const,
    },
    headerLabel: {
        margin: '18px 0 0',
        color: '#b9b2c9',
        fontSize: '10px',
        lineHeight: '14px',
        fontWeight: 700,
        letterSpacing: '1.6px',
    },
    content: {
        padding: '40px 36px 32px',
    },
    kicker: {
        margin: 0,
        color: '#7c4dce',
        fontSize: '12px',
        lineHeight: '18px',
        fontWeight: 700,
        letterSpacing: '1.3px',
        textTransform: 'uppercase' as const,
    },
    heading: {
        margin: '12px 0 0',
        color: '#191720',
        fontSize: '30px',
        lineHeight: '36px',
        fontWeight: 700,
        letterSpacing: '-0.7px',
    },
    copy: {
        margin: '16px 0 0',
        color: '#686472',
        fontSize: '15px',
        lineHeight: '24px',
    },
    codePanel: {
        margin: '28px 0 0',
        padding: '24px 20px',
        backgroundColor: '#f7f4ff',
        border: '1px solid #e8defd',
        borderRadius: '14px',
        textAlign: 'center' as const,
    },
    codeLabel: {
        margin: 0,
        color: '#806b9e',
        fontSize: '10px',
        lineHeight: '14px',
        fontWeight: 700,
        letterSpacing: '1.5px',
    },
    code: {
        margin: '10px 0 6px',
        color: '#6539b7',
        fontSize: '38px',
        lineHeight: '44px',
        fontWeight: 700,
        letterSpacing: '8px',
    },
    codeHint: {
        margin: 0,
        color: '#8d8798',
        fontSize: '12px',
        lineHeight: '18px',
    },
    button: {
        display: 'block',
        width: '100%',
        margin: '24px 0 0',
        padding: '14px 20px',
        backgroundColor: '#7c3aed',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 700,
        textAlign: 'center' as const,
        textDecoration: 'none',
    },
    securityNote: {
        margin: '24px 0 0',
        color: '#817d89',
        fontSize: '12px',
        lineHeight: '18px',
    },
    divider: {
        margin: 0,
        borderColor: '#eceaf0',
    },
    footer: {
        padding: '24px 36px 30px',
    },
    footerTitle: {
        margin: 0,
        color: '#312b3b',
        fontSize: '13px',
        lineHeight: '18px',
        fontWeight: 700,
    },
    footerCopy: {
        margin: '4px 0 0',
        color: '#8c8793',
        fontSize: '12px',
        lineHeight: '18px',
    },
    footerMeta: {
        margin: '16px 0 0',
        color: '#aaa6b0',
        fontSize: '11px',
        lineHeight: '16px',
    },
} as const
