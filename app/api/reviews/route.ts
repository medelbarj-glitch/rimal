import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const placeId = "ChIJJz-HVRfvrw0R0vAmKWsptso";

    if (!apiKey) {
        console.error("Erreur API Reviews: GOOGLE_MAPS_API_KEY est introuvable dans process.env");
        return NextResponse.json({ error: "Missing GOOGLE_MAPS_API_KEY", reviews: [] }, { status: 500 });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,url&language=fr&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            console.error("Erreur Google Places API:", data);
            return NextResponse.json({ error: data.error_message || "Failed to fetch from Google", reviews: [] }, { status: 500 });
        }

        // Return the Google URL of the place and the reviews
        return NextResponse.json({
            url: data.result.url,
            reviews: data.result.reviews || []
        });
    } catch (error) {
        console.error("Exception in GET /api/reviews:", error);
        return NextResponse.json({ error: "Internal server error", reviews: [] }, { status: 500 });
    }
}
