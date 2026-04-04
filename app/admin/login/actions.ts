'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession, deleteSession } from '@/lib/auth'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }

  try {
    // Vérifier si un admin existe déjà
    const adminCount = await prisma.admin.count()
    
    if (adminCount === 0) {
      // PREMIÈRE CONNEXION: Création du compte maître ultra-sécurisée
      const salt = await bcrypt.genSalt(12) // Salt puissant
      const hashedPassword = await bcrypt.hash(password, salt)

      const newAdmin = await prisma.admin.create({
        data: {
          email,
          hashedPassword
        }
      })

      // Création de la session
      await createSession(newAdmin.id, newAdmin.email)
      return { success: true, message: "Premier administrateur créé !" }
    }

    // CONNEXION NORMALE
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      // Message d'erreur générique pour éviter l'énumération d'utilisateurs
      return { error: "Identifiants invalides." } 
    }

    // Vérification cryptographique
    const passwordMatch = await bcrypt.compare(password, admin.hashedPassword)
    if (!passwordMatch) {
      return { error: "Identifiants invalides." } 
    }

    // Succès: Établir la session avec JWT et cookies HTTPS Only
    await createSession(admin.id, admin.email)
    return { success: true }

  } catch (error) {
    console.error("Erreur de connexion:", error)
    return { error: "Une erreur est survenue lors de la connexion." }
  }
}

export async function logoutAction() {
  await deleteSession()
  return { success: true }
}
