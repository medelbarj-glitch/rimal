// Script to seed existing services from JSON to DB
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const filePath = path.join(__dirname, 'data', 'services.json');
    
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const services = JSON.parse(data);

        // Check if services already exist in DB
        const existingCount = await prisma.service.count();
        if (existingCount > 0) {
            console.log(`${existingCount} services already exist in the database. Skipping seed.`);
            return;
        }

        for (let i = 0; i < services.length; i++) {
            const svc = services[i];
            await prisma.service.create({
                data: {
                    icon: svc.icon || 'fa-star',
                    title: svc.title,
                    title_en: svc.title_en || null,
                    title_es: svc.title_es || null,
                    title_ar: svc.title_ar || null,
                    title_ma: svc.title_ma || null,
                    description: svc.description,
                    description_en: svc.description_en || null,
                    description_es: svc.description_es || null,
                    description_ar: svc.description_ar || null,
                    description_ma: svc.description_ma || null,
                    ordre: i,
                },
            });
            console.log(`Created service: ${svc.title}`);
        }

        console.log(`\nDone! ${services.length} services seeded.`);
    } catch (e) {
        console.error('Error:', e);
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
