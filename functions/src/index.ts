import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const markAdsReserved = functions.pubsub.schedule('0 0 * * *') // A la medianoche de cada día
  .timeZone('Europe/Madrid') // Asegúrate de establecer la zona horaria correcta
  .onRun(async (context) => {
    const snapshot = await admin.firestore()
      .collection('aparcamiento')
      .get();

    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {reservado: true});
    });

    await batch.commit();
  });
