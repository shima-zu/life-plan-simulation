import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get a field from user document in Firestore
 * Structure: users/{userId} document with fields like {familyData: {...}}
 */
export const getDocument = async <T = DocumentData>(
  userId: string,
  fieldName: string,
): Promise<T | null> => {
  try {
    const docRef = doc(db, `users/${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return (data[fieldName] as T) || null;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document field ${fieldName}:`, error);
    throw error;
  }
};

/**
 * Set a field in user document in Firestore
 * Structure: users/{userId} document with fields like {familyData: {...}}
 */
export const setDocument = async <T = DocumentData>(
  userId: string,
  fieldName: string,
  data: T,
): Promise<void> => {
  try {
    const docRef = doc(db, `users/${userId}`);
    await setDoc(
      docRef,
      { [fieldName]: data },
      { merge: true }, // Merge with existing document fields
    );
  } catch (error) {
    console.error(`Error setting document field ${fieldName}:`, error);
    throw error;
  }
};

/**
 * Update a field in user document in Firestore (partial update)
 * Structure: users/{userId} document with fields like {familyData: {...}}
 */
export const updateDocument = async <T = Partial<DocumentData>>(
  userId: string,
  fieldName: string,
  data: T,
): Promise<void> => {
  try {
    const docRef = doc(db, `users/${userId}`);
    await updateDoc(docRef, { [fieldName]: data } as DocumentData);
  } catch (error) {
    console.error(`Error updating document field ${fieldName}:`, error);
    throw error;
  }
};

/**
 * Delete a field from user document in Firestore
 * Structure: users/{userId} document
 */
export const deleteDocument = async (
  userId: string,
  fieldName: string,
): Promise<void> => {
  try {
    const docRef = doc(db, `users/${userId}`);
    await updateDoc(docRef, {
      [fieldName]: null,
    });
  } catch (error) {
    console.error(`Error deleting document field ${fieldName}:`, error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates of a field in user document
 * Returns an unsubscribe function
 * Structure: users/{userId} document with fields like {familyData: {...}}
 */
export const subscribeToDocument = <T = DocumentData>(
  userId: string,
  fieldName: string,
  callback: (data: T | null) => void,
  onError?: (error: FirestoreError) => void,
): (() => void) => {
  const docRef = doc(db, `users/${userId}`);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const fieldData = data[fieldName];
        callback(fieldData ? (fieldData as T) : null);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Error subscribing to document field ${fieldName}:`, error);
      if (onError) {
        onError(error);
      }
    },
  );
};

/**
 * Helper to get user document path
 */
export const getUserDocumentPath = (documentName: string): string => {
  return documentName;
};
