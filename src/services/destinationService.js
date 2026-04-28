import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

const DESTINATIONS_COLLECTION = 'destinations';

const mapDestinationDoc = (snapshot) => ({
  id: snapshot.id,
  ...snapshot.data(),
});

export const fetchActiveDestinations = async () => {
  const q = query(collection(db, DESTINATIONS_COLLECTION), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDestinationDoc);
};

export const fetchDestinationById = async (destinationId) => {
  if (!destinationId) {
    return null;
  }

  const snapshot = await getDoc(doc(db, DESTINATIONS_COLLECTION, destinationId));
  return snapshot.exists() ? mapDestinationDoc(snapshot) : null;
};
