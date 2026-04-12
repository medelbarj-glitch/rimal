"use client";

import React from 'react';
import { getTranslatedField } from '@/lib/translate';
import { useLocale } from 'next-intl';

export function ExperienceSection({ experiences }: { experiences: any[] }) {
    const locale = useLocale();
    if (!experiences || experiences.length === 0) return null;

    return (
        <>
            {experiences.map((exp: any, index: number) => (
                <section key={exp.id || index} className="experience-section">
                    <div className="experience-content">
                        <h2>{getTranslatedField(exp, 'title', locale)}</h2>
                        <p style={{ whiteSpace: 'pre-line' }}>
                            {getTranslatedField(exp, 'description', locale)}
                        </p>
                        {exp.buttonText && <a href={"/agency"}>{getTranslatedField(exp, 'buttonText', locale)}</a>}
                    </div>
                    <div className="experience-image">
                        <img
                            src={exp.imageUrl}
                            alt={exp.title}
                        />
                    </div>
                </section>
            ))}
        </>
    );
}
