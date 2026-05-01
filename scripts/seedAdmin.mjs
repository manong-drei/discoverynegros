import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/seedAdmin.mjs <email>");
  console.error("Example: node scripts/seedAdmin.mjs eds.surio@gmail.com");
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();
const auth = admin.auth();

try {
  const userRecord = await auth.getUserByEmail(email);
  await db.collection("users").doc(userRecord.uid).set(
    { isAdmin: true },
    { merge: true }
  );
  console.log(`Admin access granted to ${email} (uid: ${userRecord.uid})`);
} catch (error) {
  if (error.code === "auth/user-not-found") {
    console.error(`No account found for "${email}". The user must sign up in the app first.`);
  } else {
    console.error("Failed:", error.message);
  }
  process.exit(1);
}
