"use client";

import { useTranslations, useLocale } from 'next-intl';
import { getTranslatedField } from '@/lib/translate';

export function ServicesSection({ services }: { services: any[] }) {
    const t = useTranslations('services');
    const locale = useLocale();
    if (!services || services.length === 0) return null;

    return (
        <section className="services-section">
            <h2>{t('title')}</h2>
            <div className="services-grid">
                {services.map((service, index) => (
                    <div key={index} className="service-card">
                        <i className={`fas ${service.icon} service-icon`}></i>
                        <h3>{getTranslatedField(service, 'title', locale)}</h3>
                        <p>{getTranslatedField(service, 'description', locale)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
