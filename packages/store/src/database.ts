import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref } from "firebase/database";
import config from "@qnaplus/env";


const firebaseConfig = JSON.parse(config.getenv("FIREBASE_CONFIG"));
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default {
    ref(query: string) {
        return ref(database, query)
    },
    get(query: string) {
        return get(ref(database, query))
    }
}