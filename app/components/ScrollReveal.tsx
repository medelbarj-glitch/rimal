'use client';

import React, { useEffect, useRef, useState } from 'react';
import '../../styles/animations.css'; // Ensure styles are loaded

interface ScrollRevealProps {
    children: React.ReactNode;
    threshold?: number; // 0.0 to 1.0 (how much of the element must vary)
    className?: string; // Additional classes
    delay?: string; // 'delay-100', etc.
    id?: string;
}

export function ScrollReveal({
    children,
    threshold = 0.15,
    className = '',
    delay = '',
    id
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the element is visible, set state and unobserve
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before bottom
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    return (
        <div
            id={id}
            ref={ref}
            className={`reveal-wrapper ${isVisible ? 'is-visible' : ''} ${className} ${delay}`}
        >
            {children}
        </div>
    );
}
