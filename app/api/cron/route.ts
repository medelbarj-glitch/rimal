import { NextResponse } from 'next/server';
import { checkExpiredReservations } from '../../actions/checkExpiredReservations';

export async function GET(request: Request) {
  // Optionnel : Vous pouvez ajouter ici une vérification d'un Header "Authorization"
  // pour vous assurer que seul votre service de Cron peut appeler cette route.
  // Exemple: si (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) ...

  try {
    await checkExpiredReservations();
    return NextResponse.json({ success: true, message: "Vérification des réservations expirées effectuée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'exécution du cron :", error);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}
