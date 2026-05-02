import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export const fetchAllUsers = async () => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deactivateUser = async (uid) => {
  await setDoc(doc(db, 'users', uid), { isDeactivated: true }, { merge: true });
};

export const reactivateUser = async (uid) => {
  await setDoc(doc(db, 'users', uid), { isDeactivated: false }, { merge: true });
};
