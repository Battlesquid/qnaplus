import config from "@qnaplus/env";
import { initializeApp } from 'firebase/app';
import { DocumentChangeType, DocumentData, WhereFilterOp, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, where, writeBatch } from 'firebase/firestore';
import { Logger } from "pino";
import { categorize, partitionSettledPromises } from "./util";


const firebaseConfig = JSON.parse(config.getenv("FIREBASE_CONFIG"));
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

type Options = {
    logger?: Logger;
}

export const getDocumentsFromCollection = async (collectionName: string, opts?: Options): Promise<DocumentData[] | null> => {
    const logger = opts?.logger?.child({ label: "getCollectionDocuments" });
    const ref = collection(firestore, collectionName);
    const snapshot = await getDocs(collection(firestore, collectionName));
    if (snapshot.empty) {
        logger?.warn(`No collection found at ${ref.path}`)
        return null;
    }
    return snapshot.docs;
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
    return setDoc(doc(firestore, collectionName, documentName), data);
}

export type RefStrategy<T> = {
    collectionName: (data: T) => string;
    documentName: (data: T) => string;
}

export const addDocuments = async <T extends DocumentData>(data: T[], refStrategy: RefStrategy<T>, opts?: Options) => {
    const logger = opts?.logger?.child({ label: "addDocuments" });
    const batch = writeBatch(firestore);

    const jobs = data.map(async d => {
        const collectionName = refStrategy.collectionName(d);
        const documentName = refStrategy.documentName(d);
        const ref = doc(firestore, collectionName, documentName);
        batch.set(ref, d);
    });

    const results = await Promise.allSettled(jobs);
    partitionSettledPromises(data, results, logger);

    return batch.commit();
}

export type OnChangeOptions<T extends DocumentData> = {
    collectionName: string;
    where: {
        field: string;
        op: WhereFilterOp;
        value: unknown;
    }
    event: DocumentChangeType;
    ignoreInitial?: boolean;
    logger?: Logger;
    condition?: (doc: T) => boolean;
    callback: (docs: T[]) => void
}

const DEFAULT_MODIFIED_OPTIONS_CONDITION: OnChangeOptions<DocumentData>["condition"] = () => true;

export const onChange = <T extends DocumentData>(options: OnChangeOptions<T>) => {
    const { collectionName, where: { field, op, value }, event, ignoreInitial, logger } = options;
    let initialized = false;
    const condition = options.condition ?? DEFAULT_MODIFIED_OPTIONS_CONDITION;
    const callback = options.callback;
    const q = query(collection(firestore, collectionName), where(field, op, value));
    return onSnapshot(q, snapshot => {
        if (ignoreInitial && !initialized) {
            logger?.trace("Skipping initial snapshot event");
            initialized = true;
            return;
        }
        const changes = categorize(snapshot.docChanges().map(c => c.type))
            .map(c => `${c.count} ${c.value}`)
            .join();
        logger?.trace(`${snapshot.docChanges().length} changes occurred on ${collectionName}`);
        logger?.trace(changes);
        const modified = snapshot.docChanges()
            .filter(change => change.type === event && condition(change.doc.data() as T))
            .map(change => change.doc.data() as T);
        callback(modified);
    });
}
