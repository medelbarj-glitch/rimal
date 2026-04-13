import React from 'react';
import { NavbarAndMenu } from '../../components/Menu';
import { prisma } from '../../../lib/prisma';
import '../../../styles/legal.css';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
    const t = await getTranslations({ locale, namespace: 'legal' });
    return {
        title: `${t('title')} | Bouderba Rental Cars`,
        description: t('subtitle'),
    };
}

export default async function LegalPage({ params: { locale } }: { params: { locale: string } }) {
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();
    const t = await getTranslations({ locale, namespace: 'legal' });

    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} />
            <div className="legal-page">
                {/* Hero */}
                <div className="legal-hero">
                    <h1 className="legal-hero-title">{t('title')}</h1>
                    <p className="legal-hero-subtitle">{t('subtitle')}</p>
                    <div className="legal-toc">
                        <a href="#conditions" className="legal-toc-item">
                            <i className="fas fa-file-contract"></i>
                            <span>{t('toc_conditions')}</span>
                        </a>
                        <a href="#confidentialite" className="legal-toc-item">
                            <i className="fas fa-shield-alt"></i>
                            <span>{t('toc_privacy')}</span>
                        </a>
                        <a href="#mentions" className="legal-toc-item">
                            <i className="fas fa-balance-scale"></i>
                            <span>{t('toc_mentions')}</span>
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
                                <h2>{t('cond_title')}</h2>
                                <span className="legal-section-date">{t('cond_updated')}</span>
                            </div>
                        </div>

                        <div className="legal-content">
                            <div className="legal-block">
                                <h3>{t('cond_1_title')}</h3>
                                <p>{t('cond_1_desc')}</p>
                                <ul>
                                    <li>{t.rich('cond_1_li1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('cond_1_li2', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t('cond_1_li3')}</li>
                                    <li>{t('cond_1_li4')}</li>
                                </ul>
                            </div>

                            <div className="legal-block">
                                <h3>{t('cond_2_title')}</h3>
                                <p>{t('cond_2_desc1')}</p>
                                <p>{t.rich('cond_2_desc2', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('cond_3_title')}</h3>
                                <p>{t('cond_3_desc')}</p>
                                <ul>
                                    <li>{t('cond_3_li1')}</li>
                                    <li>{t('cond_3_li2')}</li>
                                    <li>{t('cond_3_li3')}</li>
                                </ul>
                            </div>

                            <div className="legal-block">
                                <h3>{t('cond_4_title')}</h3>
                                <p>{t('cond_4_desc')}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('cond_5_title')}</h3>
                                <p>{t('cond_5_desc')}</p>
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
                                <h2>{t('priv_title')}</h2>
                                <span className="legal-section-date">{t('priv_updated')}</span>
                            </div>
                        </div>

                        <div className="legal-content">
                            <div className="legal-block">
                                <h3>{t('priv_1_title')}</h3>
                                <p>{t('priv_1_desc')}</p>
                                <ul>
                                    <li>{t('priv_1_li1')}</li>
                                    <li>{t('priv_1_li2')}</li>
                                    <li>{t('priv_1_li3')}</li>
                                </ul>
                            </div>

                            <div className="legal-block">
                                <h3>{t('priv_2_title')}</h3>
                                <p>{t('priv_2_desc')}</p>
                                <ul>
                                    <li>{t('priv_2_li1')}</li>
                                    <li>{t('priv_2_li2')}</li>
                                    <li>{t('priv_2_li3')}</li>
                                    <li>{t('priv_2_li4')}</li>
                                </ul>
                                <p>{t('priv_2_desc2')}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('priv_3_title')}</h3>
                                <p>{t.rich('priv_3_desc', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('priv_4_title')}</h3>
                                <p>{t('priv_4_desc')}</p>
                                <ul>
                                    <li>{t.rich('priv_4_li1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('priv_4_li2', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('priv_4_li3', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                                    <li>{t.rich('priv_4_li4', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                                </ul>
                                <p>{t('priv_4_desc2')}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('priv_5_title')}</h3>
                                <p>{t('priv_5_desc')}</p>
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
                                <h2>{t('ment_title')}</h2>
                                <span className="legal-section-date">{t('ment_updated')}</span>
                            </div>
                        </div>

                        <div className="legal-content">
                            <div className="legal-block">
                                <h3>{t('ment_1_title')}</h3>
                                <p><strong>{t('ment_1_desc1')}</strong></p>
                                <p>{t('ment_1_desc2')}</p>
                                <p>{t('ment_1_desc3')}</p>
                                <p>{t('ment_1_desc4')} <a href="tel:+212667332834">+212 6 67 33 28 34</a></p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('ment_2_title')}</h3>
                                <p>{t('ment_2_desc')}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('ment_3_title')}</h3>
                                <p>{t('ment_3_desc')}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('ment_4_title')}</h3>
                                <p>{t('ment_4_desc')}</p>
                            </div>

                            <div className="legal-block">
                                <h3>{t('ment_5_title')}</h3>
                                <p>{t('ment_5_desc')}</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
