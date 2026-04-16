import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslatedField } from '@/lib/translate';
import { useLocale } from 'next-intl';
import { VehiclePrice } from '@/app/components/VehiclePrice';

export const dynamic = 'force-dynamic';

export default async function VehiclePage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id)) return notFound();

    const vehicle = await prisma.modeleVoiture.findUnique({
        where: { id },
    });

    if (!vehicle) return notFound();

    const locale = useLocale();

    return (
        <div className="vehicle-page-container" style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '20px', color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>
                <i className="fas fa-arrow-left" style={{ marginRight: '10px' }}></i> Retour
            </Link>

            <div className="vehicle-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {/* Left: Image */}
                <div className="vehicle-image-wrapper">
                    <img
                        src={vehicle.imageUrl || '/images/placeholder.jpg'}
                        alt={vehicle.nom}
                        style={{ width: '100%', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                    />
                </div>

                {/* Right: Info */}
                <div className="vehicle-info">
                    <h1 style={{ fontSize: '3rem', fontFamily: 'Oswald, sans-serif', marginBottom: '10px' }}>{vehicle.nom}</h1>
                    <p className="vehicle-category" style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        {vehicle.transmission} / {vehicle.fuelType}
                    </p>

                    <div className="vehicle-specs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' }}>
                        <div className="spec-item">
                            <i className="fas fa-users" style={{ marginRight: '10px' }}></i> {vehicle.nbPlaces} Places
                        </div>
                        {/* Valises not in schema, removing or hardcoding for now */}
                        <div className="spec-item">
                            <i className="fas fa-suitcase" style={{ marginRight: '10px' }}></i> 2 Valises
                        </div>
                        <div className="spec-item">
                            <i className="fas fa-cog" style={{ marginRight: '10px' }}></i> {vehicle.transmission}
                        </div>
                        <div className="spec-item">
                            <i className="fas fa-gas-pump" style={{ marginRight: '10px' }}></i> {vehicle.fuelType}
                        </div>
                        <div className="spec-item">
                            <i className="fas fa-snowflake" style={{ marginRight: '10px' }}></i> Climatisation
                        </div>
                        <div className="spec-item">
                            <i className="fas fa-music" style={{ marginRight: '10px' }}></i> Bluetooth/Audio
                        </div>
                    </div>

                    <div className="vehicle-price" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                        <VehiclePrice prixParJour={vehicle.prixParJour} />
                    </div>

                    <div className="vehicle-actions">
                        <Link
                            href={`/?vehicleId=${vehicle.id}#reservation`}
                            className="btn-reserve"
                            scroll={false}
                            style={{
                                display: 'inline-block',
                                background: 'black',
                                color: 'white',
                                padding: '15px 40px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}
                        >
                            Réserver ce véhicule <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Description Text */}
            <div className="vehicle-description" style={{ marginTop: '60px' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Description</h3>
                <p style={{ lineHeight: '1.8', color: '#444' }}>
                    {getTranslatedField(vehicle, 'description', locale) || (
                        <>
                            Profitez d'une expérience de conduite exceptionnelle avec la {vehicle.nom}.
                            Idéale pour vos séjours à Marrakech, ce véhicule allie confort, sécurité et performance.
                            Disponible avec options kilométrage illimité et livraison à l'aéroport.
                            Réservez dès maintenant pour garantir la disponibilité.
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
