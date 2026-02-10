import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getResources = async (req: Request, res: Response) => {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: {
                title: 'asc'
            },
            include: {
                _count: {
                    select: { sessions: true }
                }
            }
        });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
};

export const createResource = async (req: Request, res: Response) => {
    const { title, type, url, totalUnits } = req.body;
    try {
        const resource = await prisma.resource.create({
            data: {
                title,
                type, // BOOK, VIDEO, COURSE
                url,
                totalUnits: totalUnits ? parseInt(totalUnits) : null,
                completedUnits: 0
            }
        });
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create resource' });
    }
};

export const updateResourceProgress = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { completedUnits } = req.body;
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data: { completedUnits: parseInt(completedUnits) }
        });
        res.json(resource);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update resource progress' });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.resource.delete({
            where: { id }
        });
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete resource' });
    }
};
