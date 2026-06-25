import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';

try {
    if (!getApps().length) {
        const serviceAccountPath = path.join(__dirname, '../../firebase-adminsdk.json');
        let credential;
        
        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            credential = cert(serviceAccount);
            console.log('Firebase Admin initialized using service account key.');
        } else {
            credential = applicationDefault();
            console.log('Firebase Admin initialized using application default credentials.');
        }

        initializeApp({ credential });
    }
} catch (error) {
    console.warn('Advertencia: No se pudo inicializar Firebase Admin:', error);
}

export const enviarNotificacionFCM = async (
    tokens: string[], 
    titulo: string, 
    cuerpo: string, 
    reporteId?: string
) => {
    if (!tokens || tokens.length === 0) return;

    try {
        const message: MulticastMessage = {
            notification: {
                title: titulo,
                body: cuerpo
            },
            data: reporteId ? { reportId: reporteId.toString() } : {},
            tokens: tokens
        };

        const response = await getMessaging().sendEachForMulticast(message);
        console.log(`FCM Notifications sent: ${response.successCount} successful, ${response.failureCount} failed.`);
    } catch (error) {
        console.error('Error enviando notificaciones FCM:', error);
    }
};
