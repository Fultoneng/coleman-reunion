# Coleman Family Reunion — Build & Deploy Guide

## What You Need
- A Google account (any Gmail works)
- Node.js 18+ installed (you already have this from Claude Code)
- A GitHub account

## Quick Start (5 steps, ~20 minutes)

### Step 1: Firebase Project
1. Go to **https://console.firebase.google.com**
2. Click **Create a project** → name it `coleman-reunion` → disable Analytics → Create
3. Click the **web icon** `</>` → nickname `coleman-web` → **Register app**
4. **Copy the config values** (apiKey, authDomain, projectId, etc.) — keep this tab open
5. Click **Continue to console**

### Step 2: Enable Firestore
1. In Firebase sidebar → **Build** → **Firestore Database**
2. Click **Create database** → **Start in test mode** → pick `us-central1` → **Enable**

### Step 3: Connect Your Project
```bash
cd coleman-reunion
npm install
cp .env.example .env
```
Edit `.env` and paste your Firebase config values:
```
VITE_FIREBASE_API_KEY=AIzaSyB-xxxx
VITE_FIREBASE_AUTH_DOMAIN=coleman-reunion.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=coleman-reunion
VITE_FIREBASE_STORAGE_BUCKET=coleman-reunion.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Test Locally
```bash
npm run dev
```
Open **http://localhost:5173** — you should see the app.

### Step 5: Deploy to Vercel
1. Push to GitHub:
```bash
git init
git add .
git commit -m "Coleman Family Reunion app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/coleman-reunion.git
git push -u origin main
```
2. Go to **https://vercel.com** → sign up with GitHub
3. Click **Add New Project** → import `coleman-reunion`
4. Add **Environment Variables** (same values from your `.env` file):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Click **Deploy** — your site will be live in ~60 seconds

## After Deploy

### Custom Domain (optional, ~$12/year)
1. Buy a domain like `colemanreunion.com` from Namecheap or Google Domains
2. In Vercel → Project Settings → Domains → add your domain
3. Update DNS as instructed

### Firestore Security Rules
In Firebase Console → Firestore → Rules, replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
This is fine for a family app. Add Firebase Auth later if needed.

### Extract Data with Python
```bash
pip install firebase-admin pandas
```
```python
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Pull members
members = [doc.to_dict() for doc in db.collection("familyMembers").stream()]
df = pd.DataFrame(members)

# Pull reunion prefs
prefs = [doc.to_dict() for doc in db.collection("reunionPreferences").stream()]
df_prefs = pd.DataFrame(prefs)
```

## Current Status
The app uses `window.storage` (Claude's artifact storage) for the preview.
To wire it to Firebase for production, the storage calls need to be swapped
for the Firebase functions in `src/firebase.js`. This can be done incrementally —
one collection at a time.

## Firestore Collections
| Collection | Purpose |
|---|---|
| `familyMembers` | All family tree members |
| `reunionPreferences` | Planner survey responses |
| `rsvps` | Attendance confirmations |
| `config/budget` | Host family budget entry |
| `hotelInfo` | Hotel details (Phase 2) |
| `tshirtOrders` | T-shirt orders (Phase 3) |
