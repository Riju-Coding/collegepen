"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDSwHLFQgucXaEddUNRJc90RQ7nqQulDDs",
  authDomain: "collegepen-4f634.firebaseapp.com",
  projectId: "collegepen-4f634",
  storageBucket: "collegepen-4f634.firebasestorage.app",
  messagingSenderId: "160362362731",
  appId: "1:160362362731:web:aae63bdbc0e0de8c37be2e",
  measurementId: "G-BQ6YRQ6XH9",
}

// Initialize only once; this file is imported for its side-effect.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Guard analytics in case it's not supported or running in non-browser contexts.
if (typeof window !== "undefined") {
  isSupported()
    .then((ok) => {
      if (ok) getAnalytics(app)
    })
    .catch(() => {
      // analytics optional; ignore failures
    })
}
