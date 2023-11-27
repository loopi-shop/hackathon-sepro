import { doc, setDoc, getDoc, collection, getDocs, query, updateDoc } from "firebase/firestore";
import { database } from "../utils/firebase";

export class AbstractRepository {
  COLLECTION_NAME = '';

  firebaseTimeStampToDate(value) {
    if (!value?.seconds) return null;
    return new Date(value.seconds * 1000);
  }

  getCollection() {
    if (this.COLLECTION_NAME === '') {
      throw Error('Repository not configured');
    }

    if (!this.collection) {
      this.collection = collection(database, this.COLLECTION_NAME);
    }

    return this.collection;
  }

  async findById(id) {
    const docRef = doc(this.getCollection(), id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : undefined;
  }

  async create(id, data) {
    const docRef = doc(this.getCollection(), id);
    await setDoc(docRef, { ...data, id });

    return this.findById(id);
  }

  async update(id, data) {
    const docRef = doc(this.getCollection(), id);
    await updateDoc(docRef, data);

    return this.findById(id);
  }

  async list() {
    const q = query(this.getCollection());
    const docs = await getDocs(q);
    return docs.docs.map(docs => docs.data());
  }
}