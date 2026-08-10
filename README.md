# ShipMate

ShipMate is a cruise-sailing social network for live shipmate conversations, sailing feeds, meetups, itineraries, and a shareable Cruise Pass.

## Firebase project

- Project: `shipmate-cruise-social-2026`
- Hosting: https://shipmate-cruise-social-2026.web.app
- Tier target: Firebase Spark

The app uses Firebase Authentication, Firestore, Firebase Hosting, and Firestore's browser offline cache. It intentionally does not use Cloud Functions, Extensions, or Firebase Storage so the core product remains Spark-compatible.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the Firebase web app values before running a different project locally.

## Firebase commands

```bash
npm exec firebase-tools -- use shipmate-cruise-social-2026
npm exec firebase-tools -- deploy --only firestore,hosting
```

Run the local emulators with:

```bash
npm exec firebase-tools -- emulators:start
```

## Spark safeguards

- Feed and chat listeners are limited to the active sailing or open group.
- Feed queries are capped at 50 documents.
- Messages are capped at 200 documents per open group.
- No high-frequency location heartbeat is used.
- User images are not uploaded to Firebase Storage in the Spark build.
