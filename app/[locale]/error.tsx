'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#1a1a1a', 
        color: '#fff', 
        textAlign: 'center', 
        padding: '20px' 
    }}>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <h1 style={{ 
            fontSize: '8rem', 
            margin: 0, 
            color: '#d4af37', 
            fontFamily: 'Anton, sans-serif',
            lineHeight: 1,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>500</h1>
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '2px',
            backgroundColor: '#fff',
            opacity: 0.1,
            zIndex: 0
        }}></div>
      </div>
      
      <h2 style={{ fontSize: '2rem', marginBottom: '15px', fontWeight: 600 }}>Erreur Serveur</h2>
      
      <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '40px', maxWidth: '500px', lineHeight: 1.6 }}>
        Oups, notre moteur a eu un petit raté. Une erreur inattendue s'est produite de notre côté. 
        Veuillez réessayer ou retourner à l'accueil.
      </p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => reset()} 
          style={{ 
              backgroundColor: 'transparent', 
              border: '2px solid #d4af37', 
              color: '#d4af37', 
              padding: '13px 30px', 
              borderRadius: '50px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <i className="fas fa-sync-alt" style={{ marginRight: '10px' }}></i>
          Réessayer
        </button>
        
        <Link href="/" style={{ 
            backgroundColor: '#d4af37', 
            color: '#1a1a1a', 
            padding: '15px 35px', 
            borderRadius: '50px', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <i className="fas fa-home" style={{ marginRight: '10px' }}></i>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
