'use client'

import React, { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'
import './login.css' // We will create this

const initialState: { error?: string, success?: boolean, message?: string } = {}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      // On success, redirect to admin dashboard
      router.push('/admin')
      router.refresh() // Force refresh to ensure layout updates with new auth state
    }
  }, [state.success, router])

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <i className="fas fa-car-side"></i>
          </div>
          <h2>Bouderba Rental Cars</h2>
          <p>Espace d'Administration Sécurisé</p>
        </div>

        <form action={formAction} className="login-form">
          {state.error && (
            <div className="alert-error">
               <i className="fas fa-exclamation-circle"></i> {state.error}
            </div>
          )}
          {state.message && (
             <div className="alert-success">
               <i className="fas fa-check-circle"></i> {state.message}
             </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Adresse E-mail</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="admin@domaine.com" 
                required 
                disabled={isPending}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de Passe</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                disabled={isPending}
              />
            </div>
          </div>

          <div className="session-info">
             <i className="fas fa-shield-alt"></i> Connexion sécurisée maintenue pendant 30 jours
          </div>

          <button type="submit" className="login-btn" disabled={isPending}>
            {isPending ? (
              <><i className="fas fa-circle-notch fa-spin"></i> Connexion...</>
            ) : (
              <><i className="fas fa-sign-in-alt"></i> Se connecter</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
