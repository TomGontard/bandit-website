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
const MONAD_TESTNET_RPC            = 'https://testnet-rpc.monad.xyz'

export function useWeb3() {
  const [provider, setProvider]   = useState<BrowserProvider | null>(null)
  const [signer,   setSigner]     = useState<JsonRpcSigner  | null>(null)
  const [account,  setAccount]    = useState<string          | null>(null)
  const [chainId,  setChainId]    = useState<number          | null>(null)
  const [correct,  setCorrect]    = useState<boolean         >(false)

  // Provider en lecture seule, toujours sur ton RPC Testnet
  const readOnlyProvider = new JsonRpcProvider(
    MONAD_TESTNET_RPC,
    MONAD_TESTNET_CHAIN_ID
  )

  /** Ajoute/switch la chaîne Monad Testnet dans MetaMask */
  const switchNetwork = useCallback(
    async (raw: Eip1193Provider) => {
      const hex = '0x' + MONAD_TESTNET_CHAIN_ID.toString(16)
  
      // payload complet (servira aussi à l’ajout)
      const params = [{
        chainId: hex,
        chainName: 'Monad Testnet',
        rpcUrls: [MONAD_TESTNET_RPC],
        nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
        blockExplorerUrls: ['https://testnet.monadexplorer.com/']
      }]
  
      // 1) tentative de switch
      try {
        await raw.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] })
        return                      // ► succès, on s’arrête là
      } catch { /* on ignore l’erreur */ }
  
      // 2) ajout (ou re-ajout) de la chaîne puis nouveau switch
      await raw.request({ method: 'wallet_addEthereumChain', params })
      await raw.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] })
    },
    []
  )

  /** Se connecte (MetaMask ou WalletConnect), demande l’accès et switch/add la chaîne */
  const connect = useCallback(
    async (useWalletConnect = false) => {
      let raw: Eip1193Provider

      if (useWalletConnect) {
        const wc = new WalletConnectProvider({
          rpc: { [MONAD_TESTNET_CHAIN_ID]: MONAD_TESTNET_RPC }
        })
        await wc.enable()
        raw = wc as unknown as Eip1193Provider
      } else {
        if (!window.ethereum) {
          throw new Error('MetaMask non détecté')
        }
        raw = window.ethereum
        // on demande la permission de se connecter
        await raw.request({ method: 'eth_requestAccounts' })
      }

      // switch ou ajoute la chaîne
      await switchNetwork(raw)

      // on wrappe dans un BrowserProvider et hydrate le state
      const web3    = new BrowserProvider(raw, MONAD_TESTNET_CHAIN_ID)
      const s       = await web3.getSigner()
      const addr    = await s.getAddress()
      const network = await web3.getNetwork()

      setProvider(web3)
      setSigner(   s)
      setAccount(  addr)
      setChainId(  Number(network.chainId))
      setCorrect(  Number(network.chainId) === MONAD_TESTNET_CHAIN_ID)
    },
    [switchNetwork]
  )

  /** Déconnexion */
  const disconnect = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)
    setCorrect(false)
  }, [])

  /** Écoute les événements de MetaMask pour mettre à jour account & chainId */
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

    // hydrate l’état initial
    eth.request({ method: 'eth_chainId'   }).then(handleChain).catch(() => {})
    eth.request({ method: 'eth_accounts'  }).then(handleAccounts).catch(() => {})

    eth.on('chainChanged',    handleChain)
    eth.on('accountsChanged', handleAccounts)
    return () => {
      eth.removeListener('chainChanged',    handleChain)
      eth.removeListener('accountsChanged', handleAccounts)
    }
  }, [])

  return {
    // pour lecture/écriture sur le Testnet
    provider,
    signer,
    // en lecture seule si besoin ailleurs
    readOnlyProvider,
    // connexion
    account,
    chainId,
    isCorrectNetwork: correct,
    connect,
    switchNetwork,
    disconnect,
  }
}
