import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
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

export const fetchAllDestinations = async () => {
  const snapshot = await getDocs(collection(db, DESTINATIONS_COLLECTION));
  return snapshot.docs.map(mapDestinationDoc);
};

export const createDestination = async (data) => {
  const ref = await addDoc(collection(db, DESTINATIONS_COLLECTION), {
    ...data,
    isActive: true,
    isArchived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateDestination = async (id, data) => {
  await setDoc(
    doc(db, DESTINATIONS_COLLECTION, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
};

export const archiveDestination = async (id) => {
  await setDoc(
    doc(db, DESTINATIONS_COLLECTION, id),
    { isArchived: true, isActive: false, updatedAt: serverTimestamp() },
    { merge: true },
  );
};

export const fetchDestinationById = async (destinationId) => {
  if (!destinationId) {
    return null;
  }

  const snapshot = await getDoc(doc(db, DESTINATIONS_COLLECTION, destinationId));
  return snapshot.exists() ? mapDestinationDoc(snapshot) : null;
};
