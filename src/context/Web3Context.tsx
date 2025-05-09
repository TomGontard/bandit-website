// src/context/Web3Context.tsx
import React, { createContext, useContext, ReactNode } from 'react'
import { useWeb3 } from '../hooks/useWeb3'

type Web3Hook = ReturnType<typeof useWeb3>
const Web3Context = createContext<Web3Hook | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const web3 = useWeb3()
  return (
    <Web3Context.Provider value={web3}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3Context(): Web3Hook {
  const ctx = useContext(Web3Context)
  if (!ctx) throw new Error("useWeb3Context must be used inside Web3Provider")
  return ctx
}
