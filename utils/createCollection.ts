import { CollectionReference, DocumentData, collection, getFirestore } from 'firebase/firestore';

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(getFirestore(), collectionName) as CollectionReference<T>;
};

export default createCollection;
