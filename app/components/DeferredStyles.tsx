'use client';

import { useEffect, useState } from 'react';

/**
 * Ce composant charge FontAwesome et Flatpickr CSS de manière asynchrone
 * APRÈS le premier rendu de la page, au lieu de bloquer l'affichage.
 * Cela améliore drastiquement le FCP et le LCP sur mobile.
 */
export function DeferredStyles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* FontAwesome - chargé après le rendu initial */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                crossOrigin="anonymous"
            />
            {/* Flatpickr - chargé après le rendu initial */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
            />
        </>
    );
}
