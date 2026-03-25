import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

export async function GET() {
    try {
        const fileContents = await fs.readFile(settingsFilePath, 'utf8');
        const settings = JSON.parse(fileContents);
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error reading settings:', error);
        // Return default settings if file doesn't exist or is invalid
        return NextResponse.json({ logoUrl: null, phoneNumber: "+212 6 00 00 00 00" });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const phoneNumber = formData.get('phoneNumber') as string;
        const logoFile = formData.get('logo') as File | null;

        // Read current settings
        let currentSettings = { logoUrl: null as string | null, phoneNumber: "+212 6 00 00 00 00" };
        try {
            const fileContents = await fs.readFile(settingsFilePath, 'utf8');
            currentSettings = JSON.parse(fileContents);
        } catch (e) {
            // Ignore error, use default constructed above
        }

        let newLogoUrl = currentSettings.logoUrl;

        if (logoFile && logoFile.size > 0) {
            // Ensure uploads directory exists
            await fs.mkdir(uploadsDir, { recursive: true });

            // Create a unique filename
            const ext = logoFile.name.substring(logoFile.name.lastIndexOf('.'));
            const filename = `logo-${Date.now()}${ext}`;
            const filePath = path.join(uploadsDir, filename);

            // Convert file to buffer and save
            const buffer = Buffer.from(await logoFile.arrayBuffer());
            await fs.writeFile(filePath, buffer);

            newLogoUrl = `/uploads/${filename}`;
        }

        const newSettings = {
            logoUrl: newLogoUrl,
            phoneNumber: phoneNumber || currentSettings.phoneNumber,
        };

        // Write to settings.json
        await fs.writeFile(settingsFilePath, JSON.stringify(newSettings, null, 2), 'utf8');

        return NextResponse.json({ success: true, settings: newSettings });

    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
