import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            'AIzaSyAmCqNHMGR1PSVI-8Yg9-uZwAn7aX97JJE',
  authDomain:        'greenops-13329.firebaseapp.com',
  projectId:         'greenops-13329',
  storageBucket:     'greenops-13329.firebasestorage.app',
  messagingSenderId: '13802227872',
  appId:             '1:13802227872:web:c3b3de5482c76fce4a61c5',
  measurementId:     'G-6BT3DFVMR5',
}

const app  = initializeApp(firebaseConfig)
export const auth = getAuth(app)
