import React from 'react'
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'

const authToken = atomWithStorage('journal-token', '')

export function useAuth() {
  const [token, setToken] = useAtom(authToken)

  return { token, setToken }
}
