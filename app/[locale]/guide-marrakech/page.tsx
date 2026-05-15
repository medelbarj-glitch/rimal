import React from 'react';
import { prisma } from '../../../lib/prisma';
import { NavbarAndMenu } from '../../components/Menu';
import '../../../styles/guide.css';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'guide' });
    return {
        title: t('meta_title') + ' | Bouderba Rental Cars',
        description: t('meta_desc'),
        alternates: {
            canonical: `https://www.bouderba-rental.com/${locale}/guide-marrakech`,
            languages: {
                fr: 'https://www.bouderba-rental.com/fr/guide-marrakech',
                en: 'https://www.bouderba-rental.com/en/guide-marrakech',
                es: 'https://www.bouderba-rental.com/es/guide-marrakech',
                ar: 'https://www.bouderba-rental.com/ar/guide-marrakech',
            },
        },
    };
}

export default async function GuideMarrakechPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();
    const settings = await prisma.setting.findUnique({ where: { id: 1 } });
    const t = await getTranslations({ locale, namespace: 'guide' });

    const places = [
        { icon: 'fas fa-star', nameKey: 'place_1_name', descKey: 'place_1_desc', tipKey: 'place_1_tip' },
        { icon: 'fas fa-leaf', nameKey: 'place_2_name', descKey: 'place_2_desc', tipKey: 'place_2_tip' },
        { icon: 'fas fa-archway', nameKey: 'place_3_name', descKey: 'place_3_desc', tipKey: 'place_3_tip' },
        { icon: 'fas fa-mosque', nameKey: 'place_4_name', descKey: 'place_4_desc', tipKey: 'place_4_tip' },
        { icon: 'fas fa-store', nameKey: 'place_5_name', descKey: 'place_5_desc', tipKey: 'place_5_tip' },
        { icon: 'fas fa-tree', nameKey: 'place_6_name', descKey: 'place_6_desc', tipKey: 'place_6_tip' },
    ];

    const gastro = [
        { emoji: '🍲', nameKey: 'gastro_1_name', descKey: 'gastro_1_desc' },
        { emoji: '🥘', nameKey: 'gastro_2_name', descKey: 'gastro_2_desc' },
        { emoji: '🥧', nameKey: 'gastro_3_name', descKey: 'gastro_3_desc' },
        { emoji: '🍵', nameKey: 'gastro_4_name', descKey: 'gastro_4_desc' },
    ];

    const activities = [
        { icon: 'fas fa-cloud-sun', nameKey: 'act_1_name', descKey: 'act_1_desc' },
        { icon: 'fas fa-motorcycle', nameKey: 'act_2_name', descKey: 'act_2_desc' },
        { icon: 'fas fa-spa', nameKey: 'act_3_name', descKey: 'act_3_desc' },
        { icon: 'fas fa-utensils', nameKey: 'act_4_name', descKey: 'act_4_desc' },
        { icon: 'fas fa-sun', nameKey: 'act_5_name', descKey: 'act_5_desc' },
        { icon: 'fas fa-shopping-bag', nameKey: 'act_6_name', descKey: 'act_6_desc' },
    ];

    return (
        <div className="guide-page">
            <NavbarAndMenu voitures={voitures} locations={locations} isOtherPage={true} logoUrl={settings?.logoUrl || '/default-logo.png'} />

            {/* HERO */}
            <section className="guide-hero">
                <div className="guide-hero-content">
                    <span className="guide-hero-label">{t('hero_label')}</span>
                    <h1 className="guide-hero-title">{t('hero_title')}</h1>
                    <p className="guide-hero-subtitle">{t('hero_subtitle')}</p>
                </div>
            </section>

            {/* INCONTOURNABLES */}
            <section className="guide-section">
                <div className="guide-section-header">
                    <h2 className="guide-section-title">{t('section_incontournables')}</h2>
                </div>
                <div className="guide-grid">
                    {places.map((place, i) => (
                        <div key={i} className="guide-card">
                            <div className="guide-card-icon">
                                <i className={place.icon}></i>
                            </div>
                            <h3>{t(place.nameKey as any)}</h3>
                            <p>{t(place.descKey as any)}</p>
                            <div className="guide-card-tip">
                                <i className="fas fa-lightbulb"></i>
                                <span><strong>{t('tip_label')} :</strong> {t(place.tipKey as any)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* GASTRONOMIE */}
            <section className="guide-section" style={{ background: '#fafafa' }}>
                <div className="guide-section-header">
                    <h2 className="guide-section-title">{t('section_gastronomie')}</h2>
                    <p className="guide-section-intro">{t('gastro_intro')}</p>
                </div>
                <div className="guide-gastro-grid">
                    {gastro.map((item, i) => (
                        <div key={i} className="guide-gastro-card">
                            <span className="gastro-emoji">{item.emoji}</span>
                            <h4>{t(item.nameKey as any)}</h4>
                            <p>{t(item.descKey as any)}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ACTIVITÉS */}
            <section className="guide-section">
                <div className="guide-section-header">
                    <h2 className="guide-section-title">{t('section_activites')}</h2>
                </div>
                <div className="guide-activity-grid">
                    {activities.map((act, i) => (
                        <div key={i} className="guide-activity-card">
                            <div className="guide-activity-icon">
                                <i className={act.icon}></i>
                            </div>
                            <div>
                                <h4>{t(act.nameKey as any)}</h4>
                                <p>{t(act.descKey as any)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="guide-cta">
                <h2>{t('cta_title')}</h2>
                <p>{t('cta_desc')}</p>
                <a href={`/${locale}/reservation`} className="guide-cta-btn">
                    <i className="fas fa-calendar-check"></i>
                    {t('cta_btn')}
                </a>
            </section>
        </div>
    );
}
