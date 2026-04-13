import React from 'react';
import { NavbarAndMenu } from '../../components/Menu';
import { prisma } from '../../../lib/prisma';
import '../../../styles/legal.css';

export const metadata = {
    title: 'Informations Légales | Bouderba Rental Cars',
    description: 'Conditions Générales de Location, Politique de Confidentialité et Mentions Légales de Bouderba Rental Cars.',
};

export default async function LegalPage() {
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();

    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} />
            <div className="legal-page">
                {/* Hero */}
                <div className="legal-hero">
                    <h1 className="legal-hero-title">Informations Légales</h1>
                    <p className="legal-hero-subtitle">Tout ce que vous devez savoir sur nos conditions, confidentialité et mentions légales.</p>
                    <div className="legal-toc">
                        <a href="#conditions" className="legal-toc-item">
                            <i className="fas fa-file-contract"></i>
                            <span>Conditions de Location</span>
                        </a>
                        <a href="#confidentialite" className="legal-toc-item">
                            <i className="fas fa-shield-alt"></i>
                            <span>Confidentialité</span>
                        </a>
                        <a href="#mentions" className="legal-toc-item">
                            <i className="fas fa-balance-scale"></i>
                            <span>Mentions Légales</span>
                        </a>
                    </div>
                </div>

                <div className="legal-container">

                    {/* ===================== CONDITIONS GÉNÉRALES ===================== */}
                    <section id="conditions" className="legal-section">
                        <div className="legal-section-header">
                            <div className="legal-section-icon">
                                <i className="fas fa-file-contract"></i>
                            </div>
                            <div>
                                <h2>Conditions Générales de Location</h2>
                                <span className="legal-section-date">Dernière mise à jour : Avril 2026</span>
                            </div>
                        </div>

                        <div className="legal-content">
                            <div className="legal-block">
                                <h3>1. Conditions d'éligibilité</h3>
                                <p>Pour louer un véhicule auprès de Bouderba Rental Cars, le locataire doit :</p>
                                <ul>
                                    <li>Être âgé d'au moins <strong>21 ans</strong> à la date de prise en charge du véhicule.</li>
                                    <li>Être titulaire d'un permis de conduire valide depuis au moins <strong>2 ans</strong>.</li>
                                    <li>Présenter une pièce d'identité nationale ou un passeport en cours de validité.</li>
                                    <li>Disposer d'un moyen de paiement valide accepté par notre agence.</li>
                                </ul>
                            </div>

                            <div className="legal-block">
                                <h3>2. Réservation et paiement</h3>
                                <p>Toute réservation est soumise à la disponibilité du véhicule choisi. La réservation est confirmée à la réception de votre demande. Le paiement s'effectue directement à l'agence lors de la remise des clés. Nous acceptons les paiements en espèces et par virement bancaire.</p>
                                <p>En cas d'annulation, merci de nous prévenir au moins <strong>24 heures</strong> avant la prise en charge pour éviter toute pénalité.</p>
                            </div>

                            <div className="legal-block">
                                <h3>3. Utilisation du véhicule</h3>
                                <p>Le véhicule loué ne peut être conduit que par le locataire principal mentionné au contrat. Toute sous-location est strictement interdite. Le véhicule doit être restitué dans l'état dans lequel il a été remis, propre et avec le même niveau de carburant.</p>
                                <ul>
                                    <li>Usage personnel uniquement — pas de transport commercial.</li>
                                    <li>Respect du code de la route marocain en vigueur.</li>
                                    <li>Tout dommage survenu pendant la période de location est à la charge du locataire sauf accord contraire.</li>
                                </ul>
                            </div>

                            <div className="legal-block">
                                <h3>4. Assurance et responsabilité</h3>
                                <p>Tous nos véhicules sont assurés conformément à la réglementation marocaine. Une franchise peut s'appliquer en cas de sinistre. Bouderba Rental Cars décline toute responsabilité pour les objets personnels laissés dans le véhicule.</p>
                            </div>

                            <div className="legal-block">
                                <h3>5. Restitution du véhicule</h3>
                                <p>Le véhicule doit être restitué à la date, à l'heure et au lieu convenus dans le contrat. Tout retard non signalé à l'avance pourra être facturé. Une inspection conjointe sera effectuée à la restitution.</p>
                            </div>
                        </div>
                    </section>

                    {/* ===================== CONFIDENTIALITÉ ===================== */}
                    <section id="confidentialite" className="legal-section">
                        <div className="legal-section-header">
                            <div className="legal-section-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div>
                                <h2>Politique de Confidentialité</h2>
                                <span className="legal-section-date">Dernière mise à jour : Avril 2026</span>
                            </div>
                        </div>

                        <div className="legal-content">
                            <div className="legal-block">
                                <h3>1. Données collectées</h3>
                                <p>Dans le cadre de nos services, nous collectons les informations suivantes :</p>
                                <ul>
                                    <li>Informations d'identification : nom, prénom, numéro de pièce d'identité ou passeport.</li>
                                    <li>Coordonnées : adresse e-mail, numéro de téléphone.</li>
                                    <li>Informations de réservation : dates, lieux de prise en charge et restitution, véhicule choisi.</li>
                                </ul>
                            </div>

                            <div className="legal-block">
                                <h3>2. Utilisation des données</h3>
                                <p>Les données collectées sont utilisées exclusivement pour :</p>
                                <ul>
                                    <li>Traiter et confirmer vos demandes de réservation.</li>
                                    <li>Vous contacter concernant votre location.</li>
                                    <li>Améliorer notre service client.</li>
                                    <li>Respecter nos obligations légales et contractuelles.</li>
                                </ul>
                                <p>Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers à des fins commerciales.</p>
                            </div>

                            <div className="legal-block">
                                <h3>3. Conservation des données</h3>
                                <p>Vos données sont conservées pendant une durée de <strong>5 ans</strong> à compter de la fin de votre contrat de location, conformément à nos obligations légales.</p>
                            </div>

                            <div className="legal-block">
                                <h3>4. Vos droits</h3>
                                <p>Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez des droits suivants :</p>
                                <ul>
                                    <li><strong>Droit d'accès</strong> : obtenir une copie de vos données.</li>
                                    <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
                                    <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données.</li>
                                    <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données.</li>
                                </ul>
                                <p>Pour exercer ces droits, contactez-nous à l'adresse indiquée dans la section Mentions Légales.</p>
                            </div>

                            <div className="legal-block">
                                <h3>5. Cookies</h3>
                                <p>Notre site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de traçage ou publicitaire n'est utilisé sans votre consentement explicite.</p>
                            </div>
                        </div>
                    </section>

                    {/* ===================== MENTIONS LÉGALES ===================== */}
                    <section id="mentions" className="legal-section">
                        <div className="legal-section-header">
                            <div className="legal-section-icon">
                                <i className="fas fa-balance-scale"></i>
                            </div>
                            <div>
                                <h2>Mentions Légales</h2>
                                <span className="legal-section-date">Dernière mise à jour : Avril 2026</span>
                            </div>
                        </div>

                        <div className="legal-content">
                            <div className="legal-block">
                                <h3>Éditeur du site</h3>
                                <p><strong>Bouderba Rental Cars</strong></p>
                                <p>Agence de location de véhicules</p>
                                <p>Maroc</p>
                                <p>Téléphone : <a href="tel:+212667332834">+212 6 67 33 28 34</a></p>
                            </div>

                            <div className="legal-block">
                                <h3>Hébergement</h3>
                                <p>Ce site est hébergé par un prestataire tiers. Pour tout renseignement relatif à l'hébergement, veuillez nous contacter directement.</p>
                            </div>

                            <div className="legal-block">
                                <h3>Propriété intellectuelle</h3>
                                <p>L'ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété exclusive de Bouderba Rental Cars. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.</p>
                            </div>

                            <div className="legal-block">
                                <h3>Limitation de responsabilité</h3>
                                <p>Bouderba Rental Cars s'efforce de maintenir les informations de ce site à jour et exactes. Toutefois, nous ne saurions être tenus responsables des erreurs ou omissions, ni des conséquences de leur utilisation.</p>
                            </div>

                            <div className="legal-block">
                                <h3>Droit applicable</h3>
                                <p>Le présent site et les présentes mentions légales sont soumis au droit marocain. Tout litige relatif à l'utilisation du site sera soumis à la juridiction compétente au Maroc.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
