import { auth, database } from "./firebase-config.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const userRef = ref(database, "users/123");
await update(userRef, { name: "John Doe" });
