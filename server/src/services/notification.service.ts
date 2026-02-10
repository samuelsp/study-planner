import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure transporter (using a fake Ethereal account/mock for now)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'fake_user@ethereal.email', // Replace with real credentials in production
        pass: 'fake_pass'
    }
});

export const checkAndSendReminders = async () => {
    console.log('Checking for upcoming study sessions...');

    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);

    try {
        const upcomingSessions = await prisma.studySession.findMany({
            where: {
                startTime: {
                    gte: now,
                    lte: fifteenMinutesFromNow
                },
                reminderSent: false,
                isCompleted: false
            },
            include: {
                resource: true
            }
        });

        if (upcomingSessions.length === 0) return;

        for (const session of upcomingSessions) {
            console.log(`Sending reminder for session: ${session.title}`);

            // In a real app, you would have the user's email
            // For now, we simulate sending to a default address
            const mailOptions = {
                from: '"Study Planner" <noreply@studyplanner.com>',
                to: 'student@example.com',
                subject: `🔔 Lembrete: Sua sessão "${session.title}" começa em breve!`,
                text: `Olá! Sua sessão de estudo "${session.title}" começa em 15 minutos. 
                       ${session.resource ? `Recurso vinculado: ${session.resource.title}` : ''}
                       Foco total!`,
                html: `
                    <div style="font-family: sans-serif; background: #09090b; color: #fafafa; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #8b5cf6;">🔔 Hora de Focar!</h2>
                        <p>Sua sessão <b>"${session.title}"</b> começa em 15 minutos.</p>
                        ${session.resource ? `<p style="color: #a1a1aa;">Recurso: ${session.resource.title}</p>` : ''}
                        <hr style="border-top: 1px solid #27272a; margin: 20px 0;">
                        <p style="font-size: 12px; color: #71717a;">Este é um lembrete automático do seu Study Planner.</p>
                    </div>
                `
            };

            // Simulating send (uncomment real send in production)
            // await transporter.sendMail(mailOptions);
            console.log('Email content (Simulated):', mailOptions.subject);

            // Mark as sent
            await prisma.studySession.update({
                where: { id: session.id },
                data: { reminderSent: true }
            });
        }
    } catch (error) {
        console.error('Error in reminder service:', error);
    }
};
