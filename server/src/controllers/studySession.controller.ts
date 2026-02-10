import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await prisma.studySession.findMany({
            include: {
                resource: true
            },
            orderBy: {
                startTime: 'asc'
            }
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
};

export const createSession = async (req: Request, res: Response) => {
    const { title, startTime, endTime, resourceId } = req.body;
    try {
        const session = await prisma.studySession.create({
            data: {
                title,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                resourceId
            }
        });
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create session' });
    }
};

export const updateSession = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, startTime, endTime, resourceId, isCompleted } = req.body;
    try {
        const session = await prisma.studySession.update({
            where: { id },
            data: {
                title,
                startTime: startTime ? new Date(startTime) : undefined,
                endTime: endTime ? new Date(endTime) : undefined,
                resourceId,
                isCompleted
            }
        });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update session' });
    }
};

export const updateSessionStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isCompleted } = req.body;
    try {
        const session = await prisma.studySession.update({
            where: { id },
            data: { isCompleted }
        });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update session status' });
    }
};

export const deleteSession = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.studySession.delete({
            where: { id }
        });
        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete session' });
    }
};
