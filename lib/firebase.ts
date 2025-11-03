"use client"

import { getApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import "./firebase-config" // ensures the config side-effect runs

// Since firebase-config initializes the app, we can safely get the default app.
const app = getApps().length ? getApp() : undefined

export const auth = app ? getAuth(app) : getAuth()
export const db = app ? getFirestore(app) : getFirestore()
export const storage = app ? getStorage(app) : getStorage()
