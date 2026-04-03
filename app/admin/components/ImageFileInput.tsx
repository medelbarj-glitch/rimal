'use client';

import React, { useRef, useState } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
}

export function ImageFileInput({ name, required, accept = "image/png, image/jpeg, image/webp", className = "custom-file-input", onChange, ...props }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [hasFile, setHasFile] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasFile(!!e.target.files?.length);
        if (onChange) onChange(e);
    };

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            setHasFile(false);
            
            // Trigger onChange so that if a parent is listening, it updates
            if (onChange) {
                // Fake event for the prop
                const event = {
                    target: inputRef.current,
                    currentTarget: inputRef.current
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
            }
        }
    };

    return (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
            <input 
                ref={inputRef}
                type="file" 
                name={name} 
                accept={accept} 
                required={required} 
                className={className}
                onChange={handleChange}
                style={{ flex: 1 }}
                {...props}
            />
            {hasFile && (
                <button 
                    type="button" 
                    onClick={handleClear}
                    style={{ 
                        padding: '6px 14px', 
                        background: '#ffebee', 
                        color: '#c62828', 
                        border: '1px solid #ffcdd2',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s'
                    }}
                    title="Retirer l'image sélectionnée"
                >
                    <i className="fas fa-trash"></i>
                </button>
            )}
        </div>
    );
}
