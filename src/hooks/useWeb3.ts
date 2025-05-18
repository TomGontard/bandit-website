// src/hooks/useWeb3.ts
import { useState, useCallback, useEffect } from 'react'
import {
  BrowserProvider,
  JsonRpcProvider,
  type JsonRpcSigner,
  type Eip1193Provider
} from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      on(event: 'chainChanged', listener: (chainId: string) => void): void
      on(event: 'accountsChanged', listener: (accounts: string[]) => void): void
      removeListener(event: 'chainChanged', listener: (chainId: string) => void): void
      removeListener(event: 'accountsChanged', listener: (accounts: string[]) => void): void
    }
  }
}


export const MONAD_TESTNET_CHAIN_ID = 10143
const MONAD_TESTNET_RPC      = 'https://testnet-rpc.monad.xyz'

interface RpcError extends Error {
  code?: number
}

export function useWeb3() {
  const [provider, setProvider]   = useState<BrowserProvider | null>(null)
  const [signer,   setSigner]     = useState<JsonRpcSigner  | null>(null)
  const [account,  setAccount]    = useState<string          | null>(null)
  const [chainId,  setChainId]    = useState<number          | null>(null)
  const [correct,  setCorrect]    = useState<boolean         >(false)

  const readOnlyProvider = new JsonRpcProvider(
    MONAD_TESTNET_RPC,
    MONAD_TESTNET_CHAIN_ID
  )

  const switchNetwork = useCallback(async () => {
    const raw = window.ethereum
    if (!raw) throw new Error('MetaMask non détecté')
    const hex = '0x' + MONAD_TESTNET_CHAIN_ID.toString(16)

    try {
      await raw.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex }]
      })
    } catch (err: unknown) {
      const rpcErr = err as RpcError
      if (rpcErr.code === 4902) {
        await raw.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId:    hex,
            chainName:  'Monad Testnet',
            rpcUrls:    [MONAD_TESTNET_RPC],
            nativeCurrency: {
              name:     'tMON',
              symbol:   'tMON',
              decimals: 18
            },
            blockExplorerUrls: ['https://testnet.monadexplorer.com/']
          }]
        })
      } else {
        throw err
      }
    }
  }, [])

  const connect = useCallback(async (useWalletConnect = false) => {
    let raw: Eip1193Provider

    if (useWalletConnect) {
      const wc = new WalletConnectProvider({
        rpc: { [MONAD_TESTNET_CHAIN_ID]: MONAD_TESTNET_RPC }
      })
      await wc.enable()
      raw = wc as unknown as Eip1193Provider
    } else {
      if (!window.ethereum) throw new Error('MetaMask non détecté')
      raw = window.ethereum
    }

    await switchNetwork()

    const web3    = new BrowserProvider(raw, MONAD_TESTNET_CHAIN_ID)
    const signer  = await web3.getSigner()
    const addr    = await signer.getAddress()
    const network = await web3.getNetwork()

    setProvider(web3)
    setSigner(signer)
    setAccount(addr)
    setChainId(Number(network.chainId))
    setCorrect(network.chainId === BigInt(MONAD_TESTNET_CHAIN_ID))
  }, [switchNetwork])

  const disconnect = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)
    setCorrect(false)
  }, [])

  useEffect(() => {
    const eth = window.ethereum
    if (!eth) return

    const handleChain    = (hex: string) => {
      const id = parseInt(hex, 16)
      setChainId(id)
      setCorrect(id === MONAD_TESTNET_CHAIN_ID)
    }
    const handleAccounts = (accs: string[]) => {
      setAccount(accs[0] || null)
    }

    // hydrate l’état
    eth.request({ method: 'eth_chainId' }).then(handleChain).catch(() => {})
    eth.request({ method: 'eth_accounts' }).then(handleAccounts).catch(() => {})

    eth.on('chainChanged',    handleChain)
    eth.on('accountsChanged', handleAccounts)
    return () => {
      eth.removeListener('chainChanged',    handleChain)
      eth.removeListener('accountsChanged', handleAccounts)
    }
  }, [])

  return {
    provider,
    signer,
    readOnlyProvider,
    account,
    chainId,
    isCorrectNetwork: correct,
    connect,
    switchNetwork,
    disconnect,
  }
}
