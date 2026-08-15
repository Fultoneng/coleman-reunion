import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ═══ Collection References ═══
const membersRef = collection(db, "familyMembers");
const prefsRef = collection(db, "reunionPreferences");
const attendanceRef = collection(db, "attendance");
const hotelsRef = collection(db, "hotelInfo");
const tshirtRef = collection(db, "tshirtOrders");
const budgetRef = collection(db, "reunionBudget");

// ═══ Family Members ═══
export async function addFamilyMember(member) {
  return addDoc(membersRef, { ...member, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export async function updateFamilyMember(docId, updates) {
  return updateDoc(doc(db, "familyMembers", docId), { ...updates, updatedAt: serverTimestamp() });
}
export async function deleteFamilyMember(docId) {
  return deleteDoc(doc(db, "familyMembers", docId));
}
export function subscribeFamilyMembers(callback) {
  return onSnapshot(membersRef, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ═══ Reunion Preferences ═══
export async function addReunionPreference(pref) {
  return addDoc(prefsRef, { ...pref, submittedAt: serverTimestamp() });
}
export function subscribeReunionPreferences(callback) {
  return onSnapshot(prefsRef, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ═══ RSVP / Attendance ═══
export async function updateRsvp(memberId, status) {
  const rsvpDoc = doc(db, "rsvps", memberId);
  const { setDoc } = await import("firebase/firestore");
  return setDoc(rsvpDoc, { status, updatedAt: serverTimestamp() }, { merge: true });
}
export function subscribeRsvps(callback) {
  const rsvpRef = collection(db, "rsvps");
  return onSnapshot(rsvpRef, (snapshot) => {
    const rsvps = {};
    snapshot.docs.forEach(d => { rsvps[d.id] = d.data().status; });
    callback(rsvps);
  });
}

// ═══ Budget ═══
export async function saveBudget(budgetData) {
  const { setDoc } = await import("firebase/firestore");
  return setDoc(doc(db, "config", "budget"), { ...budgetData, updatedAt: serverTimestamp() });
}
export function subscribeBudget(callback) {
  const budgetDoc = doc(db, "config", "budget");
  const { onSnapshot: snap } = require("firebase/firestore");
  return onSnapshot(budgetDoc, (doc) => {
    if (doc.exists()) callback(doc.data());
  });
}

// ═══ Hotel Info (Phase 2) ═══
export async function addHotel(hotel) {
  return addDoc(hotelsRef, { ...hotel, createdAt: serverTimestamp() });
}
export function subscribeHotels(callback) {
  return onSnapshot(hotelsRef, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ═══ T-Shirt Orders (Phase 3) ═══
export async function addTshirtOrder(order) {
  return addDoc(tshirtRef, { ...order, submittedAt: serverTimestamp() });
}
export function subscribeTshirtOrders(callback) {
  return onSnapshot(tshirtRef, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export { db };
