import Link from 'next/link';
import '../globals.css';
import "../../styles/home/reservations.css";
import "./admin.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
            </head>
            <body>
                <div className="admin-main">
                    {/* Main Content */}
                    <main>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
