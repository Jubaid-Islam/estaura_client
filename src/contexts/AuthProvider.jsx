import { auth } from '../firebase/firebase.init'
import { AuthContext } from './AuthContext'
import LoaderUi from '../components/loading/LoaderUi'
import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const exchangeServerJWT = async currentUser => {
    if (!currentUser) return

    const idToken = await currentUser.getIdToken()

    await axios.post(
      `${import.meta.env.VITE_URL}/users/jwt`,
      {},
      {
        headers: { Authorization: `Bearer ${idToken}` },
        withCredentials: true,
      }
    )
  }

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const updateUser = updatedData => {
    return updateProfile(auth.currentUser, updatedData)
  }

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    await exchangeServerJWT(result?.user)
    return result
  }

  const logOut = () => {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser)

      if (currentUser) {
        try {
          await exchangeServerJWT(currentUser)
        } catch (error) {
          console.error('Failed to get server JWT:', error)
        }
      }

      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const authData = {
    user,
    setUser,
    createUser,
    logOut,
    signIn,
    loading,
    setLoading,
    updateUser,
    loginWithGoogle
  }

  return <AuthContext value={authData}>{children}</AuthContext>
}

export default AuthProvider






