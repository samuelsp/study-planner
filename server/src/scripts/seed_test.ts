import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');
    const r1 = await prisma.resource.create({
        data: {
            title: 'Clean Code',
            type: 'BOOK',
            totalUnits: 17,
            completedUnits: 3
        }
    });
    console.log('Created resource:', r1);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
