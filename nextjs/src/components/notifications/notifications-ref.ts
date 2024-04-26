import { firestore } from "@/lib/firebase";
import { collection } from "firebase/firestore";

export const notificationRef = collection(firestore, "notifications");
