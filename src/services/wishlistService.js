import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const getUserWishlistCollection = (userId) => collection(db, 'users', userId, 'wishlist');

export const fetchWishlist = async (userId) => {
  if (!userId) {
    return [];
  }

  const snapshot = await getDocs(getUserWishlistCollection(userId));
  return snapshot.docs.map((wishlistDoc) => wishlistDoc.id);
};

export const addToWishlist = async ({ destinationId, userId } = {}) => {
  if (!userId || !destinationId) {
    throw new Error('A user and destination are required to add a wishlist item.');
  }

  await setDoc(
    doc(db, 'users', userId, 'wishlist', destinationId),
    {
      destinationId,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const removeFromWishlist = async ({ destinationId, userId } = {}) => {
  if (!userId || !destinationId) {
    throw new Error('A user and destination are required to remove a wishlist item.');
  }

  await deleteDoc(doc(db, 'users', userId, 'wishlist', destinationId));
};
