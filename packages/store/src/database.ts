import config from "@qnaplus/env";
import { initializeApp } from 'firebase/app';
import { DocumentData, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { Logger } from "pino";
import { partitionSettledPromises } from "./util";


const firebaseConfig = JSON.parse(config.getenv("FIREBASE_CONFIG"));
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

type Options = {
    logger?: Logger;
}

type CollectionList = {
    values: string[];
}

const updateCollectionList = async (collectionName: string, opts?: Options): Promise<void> => {
    return updateDoc(doc(firestore, "metadata", "collections"), {
        values: arrayUnion(collectionName)
    })
}

const getCollectionList = async (opts?: Options): Promise<string[] | null> => {
    const logger = opts?.logger?.child({ label: "getCollectionList" });
    const result = await getDocument<CollectionList>("metadata", "collections");
    if (result === null) {
        logger?.warn("No collections list found")
        return null;
    }
    return result.values;
}

export const getAllDocuments = async (opts?: Options): Promise<DocumentData[] | null> => {
    const logger = opts?.logger?.child({ label: "getAllDocuments" });

    const collections = await getCollectionList();

    if (collections === null) {
        logger?.warn("No collections list found")
        return null;
    }

    const jobs = collections.flatMap(async collectionName => {
        const snapshot = await getDocs(collection(firestore, collectionName));
        return snapshot.docs;
    });

    const results = await Promise.allSettled(jobs);
    const [resolved] = partitionSettledPromises(collections, results, logger);
    const docs = resolved.flat().map(d => d.data());

    logger?.trace(`Fetched ${docs.length} documents.`);
    return docs;
}

export const getDocument = async <T extends DocumentData = DocumentData>(collectionName: string, documentName: string, opts?: Options): Promise<T | null> => {
    const logger = opts?.logger?.child({ label: "getDocument" });
    const ref = doc(firestore, collectionName, documentName);
    const result = await getDoc(ref);
    if (!result.exists()) {
        logger?.warn(`No document found at ${ref.path}`)
        return null;
    }
    return result.data() as T;
}

export const addDocument = async <T extends DocumentData>(collectionName: string, documentName: string, data: T, opts?: Options) => {
    await updateCollectionList(collectionName);
    return setDoc(doc(firestore, collectionName, documentName), data);
}

export type RefStrategy<T> = {
    collectionName: (data: T) => string;
    documentName: (data: T) => string;
}

export const addDocuments = async <T extends DocumentData>(data: T[], refStrategy: RefStrategy<T>, opts?: Options) => {
    const logger = opts?.logger;
    const batch = writeBatch(firestore);

    const jobs = data.map(async d => {
        const collectionName = refStrategy.collectionName(d);
        const documentName = refStrategy.documentName(d);
        const ref = doc(firestore, collectionName, documentName);
        await updateCollectionList(collectionName);
        batch.set(ref, d)
    });

    const results = await Promise.allSettled(jobs);
    partitionSettledPromises(data, results, logger);

    return batch.commit();
}
