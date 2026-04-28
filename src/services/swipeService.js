import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const getUserSwipesCollection = (userId) => collection(db, 'users', userId, 'swipes');

export const fetchUserSwipes = async (userId) => {
  if (!userId) {
    return [];
  }

  const q = query(getUserSwipesCollection(userId), orderBy('clientCreatedAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((swipeDoc) => ({
    id: swipeDoc.id,
    ...swipeDoc.data(),
  }));
};

export const saveSwipeAction = async ({
  action,
  clientCreatedAt = Date.now(),
  destinationId,
  natureTypeKey,
  userId,
} = {}) => {
  if (!userId || !destinationId || !action) {
    throw new Error('A user, destination, and action are required to save a swipe.');
  }

  await setDoc(
    doc(db, 'users', userId, 'swipes', destinationId),
    {
      action,
      clientCreatedAt,
      destinationId,
      natureTypeKey: natureTypeKey || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const undoLatestSwipe = async ({ destinationId, userId } = {}) => {
  if (!userId || !destinationId) {
    throw new Error('A user and destination are required to undo a swipe.');
  }

  await deleteDoc(doc(db, 'users', userId, 'swipes', destinationId));
};
