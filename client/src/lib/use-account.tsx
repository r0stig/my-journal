import { atom, useAtom } from 'jotai'
import React from 'react'

const isSignedInAtom = atom(false)

export const useAccount = () => {
  const [isSignedIn, setIsSignedIn] = useAtom(isSignedInAtom)

  const signIn = () => {
    setIsSignedIn(true)
  }

  const signOut = () => {
    setIsSignedIn(false)
  }

  const changePassword = () => {

  }

  return {
    signIn,
    signOut,
    changePassword,
    isSignedIn
  }
}
