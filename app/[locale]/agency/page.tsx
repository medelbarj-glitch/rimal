import React from 'react';
import { prisma } from '../../../lib/prisma';
import { NavbarAndMenu } from '../../components/Menu';
import '../../../styles/agency.css';
import { getSettings } from '@/app/actions/settingsActions';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
    const t = await getTranslations({ locale, namespace: 'agency' });
    return {
        title: `${t('title')} | Bouderba Rental Cars`,
        description: t('subtitle'),
    };
}

export default async function AgencePage({ params: { locale } }: { params: { locale: string } }) {
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();

    const dbSettings = await getSettings();
    const phoneNumber = dbSettings?.phoneNumber || "+212 6 67 33 28 34";
    const phoneNumber2 = dbSettings?.phoneNumber2;
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const cleanPhoneNumber2 = phoneNumber2 ? phoneNumber2.replace(/[^0-9+]/g, '') : null;
    const whatsappMessage = encodeURIComponent("Bonjour, je suis intéressé par la location d'une voiture.");

    const t = await getTranslations({ locale, namespace: 'agency' });

    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={dbSettings?.logoUrl || '/default-logo.png'} />
            <div className="agency-page">

                {/* ============ HERO ============ */}
                <section className="agency-hero">
                    <div className="agency-hero-content">
                        <span className="agency-hero-label">Bouderba Rental Cars</span>
                        <h1 className="agency-hero-title">{t('title')}</h1>
                        <p className="agency-hero-subtitle">
                            {t('subtitle')}
                        </p>
                        <div className="agency-hero-actions">
                            <a href={`tel:${cleanPhoneNumber}`} className="agency-btn agency-btn-gold">
                                <i className="fas fa-phone-alt"></i>
                                {t('call_us')}
                            </a>
                            <a href={`https://wa.me/${cleanPhoneNumber}?text=${whatsappMessage}`}
                                target="_blank" rel="noopener noreferrer"
                                className="agency-btn agency-btn-outline">
                                <i className="fab fa-whatsapp"></i>
                                {t('whatsapp')}
                            </a>
                        </div>
                    </div>
                </section>

                {/* ============ STATS BAR ============ */}
                <section className="agency-stats-bar">
                    <div className="agency-stat">
                        <span className="agency-stat-number">+7</span>
                        <span className="agency-stat-label">{t('available_vehicles')}</span>
                    </div>
                    <div className="agency-stat-divider"></div>
                    <div className="agency-stat">
                        <span className="agency-stat-number">+5</span>
                        <span className="agency-stat-label">{t('pickup_points')}</span>
                    </div>
                    <div className="agency-stat-divider"></div>
                    <div className="agency-stat">
                        <span className="agency-stat-number">24/7</span>
                        <span className="agency-stat-label">{t('customer_support')}</span>
                    </div>
                </section>

                {/* ============ ABOUT SECTION ============ */}
                <section className="agency-section">
                    <div className="agency-section-header">
                        <h2 className="agency-section-title">{t('about_title')}</h2>
                    </div>
                    <div className="agency-about-grid">
                        <div className="agency-about-text">
                            <p>
                                {t.rich('about_text_1', {
                                    strong1: (chunks) => <strong>{chunks}</strong>,
                                    strong2: (chunks) => <strong>{chunks}</strong>
                                })}
                            </p>
                            <p>
                                {t('about_text_2')}
                            </p>
                        </div>
                        <div className="agency-values-grid">
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-gem"></i></div>
                                <h4>{t('val_quality_title')}</h4>
                                <p>{t('val_quality_desc')}</p>
                            </div>
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-handshake"></i></div>
                                <h4>{t('val_trust_title')}</h4>
                                <p>{t('val_trust_desc')}</p>
                            </div>
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-headset"></i></div>
                                <h4>{t('val_avail_title')}</h4>
                                <p>{t('val_avail_desc')}</p>
                            </div>
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-map-marker-alt"></i></div>
                                <h4>{t('val_flex_title')}</h4>
                                <p>{t('val_flex_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ CONTACT + HOURS ============ */}
                <section className="agency-section">
                    <div className="agency-section-header">
                        <h2 className="agency-section-title">{t('contact_title')}</h2>
                    </div>
                    <div className="agency-contact-grid">

                        {/* Contact details card */}
                        <div className="agency-card">
                            <div className="agency-card-icon-row">
                                <div className="agency-card-icon"><i className="fas fa-address-card"></i></div>
                                <h3>{t('contact_details')}</h3>
                            </div>
                            <div className="agency-contact-list">
                                <a href={`mailto:contact@bouderba-rental.com`} className="agency-contact-item">
                                    <div className="agency-ci-icon"><i className="fas fa-envelope"></i></div>
                                    <div>
                                        <span className="agency-ci-label">{t('contact_email')}</span>
                                        <span className="agency-ci-value">contact@bouderba-rental.com</span>
                                    </div>
                                </a>
                                <a href={`tel:${cleanPhoneNumber}`} className="agency-contact-item">
                                    <div className="agency-ci-icon"><i className="fas fa-phone-alt"></i></div>
                                    <div>
                                        <span className="agency-ci-label">{t('contact_phone')}</span>
                                        <span className="agency-ci-value">{phoneNumber}</span>
                                    </div>
                                </a>
                                {phoneNumber2 && (
                                    <a href={`tel:${cleanPhoneNumber2}`} className="agency-contact-item">
                                        <div className="agency-ci-icon"><i className="fas fa-phone-alt"></i></div>
                                        <div>
                                            <span className="agency-ci-label">{t('contact_phone')} 2</span>
                                            <span className="agency-ci-value">{phoneNumber2}</span>
                                        </div>
                                    </a>
                                )}
                                <a href={`https://wa.me/${cleanPhoneNumber}?text=${whatsappMessage}`}
                                    target="_blank" rel="noopener noreferrer" className="agency-contact-item">
                                    <div className="agency-ci-icon whatsapp"><i className="fab fa-whatsapp"></i></div>
                                    <div>
                                        <span className="agency-ci-label">{t('whatsapp')}</span>
                                        <span className="agency-ci-value">{t('contact_whatsapp')}</span>
                                    </div>
                                </a>
                                <div className="agency-contact-item">
                                    <div className="agency-ci-icon"><i className="fas fa-map-marked-alt"></i></div>
                                    <div>
                                        <span className="agency-ci-label">{t('contact_address')}</span>
                                        <span className="agency-ci-value">{t('contact_address_val')}</span>
                                    </div>
                                </div>
                                <a href="https://www.instagram.com/bouderba.rental.cars" target="_blank" rel="noopener noreferrer" className="agency-contact-item">
                                    <div className="agency-ci-icon instagram"><i className="fab fa-instagram"></i></div>
                                    <div>
                                        <span className="agency-ci-label">{t('contact_ig')}</span>
                                        <span className="agency-ci-value">@bouderba.rental.cars</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Hours card */}
                        <div className="agency-card agency-card-dark">
                            <div className="agency-card-icon-row">
                                <div className="agency-card-icon gold"><i className="fas fa-clock"></i></div>
                                <h3>{t('hours_title')}</h3>
                            </div>
                            <div className="agency-hours-list">
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">{t('monday')}</span>
                                    <span className="agency-hours-time">{dbSettings?.hoursMonday || '09:00 — 20:00'}</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">{t('tuesday')}</span>
                                    <span className="agency-hours-time">{dbSettings?.hoursTuesday || '09:00 — 20:00'}</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">{t('wednesday')}</span>
                                    <span className="agency-hours-time">{dbSettings?.hoursWednesday || '09:00 — 20:00'}</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">{t('thursday')}</span>
                                    <span className="agency-hours-time">{dbSettings?.hoursThursday || '09:00 — 20:00'}</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">{t('friday')}</span>
                                    <span className="agency-hours-time">{dbSettings?.hoursFriday || '09:00 — 20:00'}</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">{t('saturday')}</span>
                                    <span className="agency-hours-time">{dbSettings?.hoursSaturday || '10:00 — 18:00'}</span>
                                </div>
                                <div className="agency-hours-row special">
                                    <span className="agency-hours-day">{t('sunday')}</span>
                                    <span className="agency-badge">{dbSettings?.hoursSunday || 'Sur rendez-vous'}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ============ LOCATION MAP ============ */}
                <section className="agency-section">
                    <div className="agency-section-header">
                        <h2 className="agency-section-title">{t('find_us')}</h2>
                    </div>
                    <div className="agency-map-container" style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=place_id:ChIJwfaToHDvrw0RLA_AGyBS4n0`}
                        ></iframe>
                    </div>
                </section>

                {/* ============ HOW IT WORKS ============ */}
                <section className="agency-section">
                    <div className="agency-section-header">
                        <h2 className="agency-section-title">{t('how_it_works_title')}</h2>
                    </div>
                    <div className="agency-steps">
                        <div className="agency-step">
                            <div className="agency-step-number">01</div>
                            <h4>{t('step_1_title')}</h4>
                            <p>{t('step_1_desc')}</p>
                        </div>
                        <div className="agency-step-arrow"><i className="fas fa-chevron-right"></i></div>
                        <div className="agency-step">
                            <div className="agency-step-number">02</div>
                            <h4>{t('step_2_title')}</h4>
                            <p>{t('step_2_desc')}</p>
                        </div>
                        <div className="agency-step-arrow"><i className="fas fa-chevron-right"></i></div>
                        <div className="agency-step">
                            <div className="agency-step-number">03</div>
                            <h4>{t('step_3_title')}</h4>
                            <p>{t('step_3_desc')}</p>
                        </div>
                    </div>
                </section>

                {/* ============ CTA ============ */}
                <section className="agency-cta">
                    <h2>{t('cta_title')}</h2>
                    <p>{t('cta_desc')}</p>
                    <div className="agency-cta-actions">
                        <a href="/reservation" className="agency-btn agency-btn-gold">
                            <i className="fas fa-calendar-check"></i>
                            {t('cta_btn')}
                        </a>
                        <a href={`tel:${cleanPhoneNumber}`} className="agency-btn agency-btn-white">
                            <i className="fas fa-phone-alt"></i>
                            {phoneNumber}
                        </a>
                    </div>
                </section>

            </div>
        </>
    );
}
