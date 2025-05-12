// src/hooks/useWeb3.ts
import { useState, useCallback } from 'react'
import {
  BrowserProvider,
  JsonRpcProvider,
  type JsonRpcSigner,
  type Eip1193Provider
} from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

declare global {
  interface Window { ethereum?: Eip1193Provider }
}

const MONAD_TESTNET_CHAIN_ID = 10143
const MONAD_TESTNET_RPC      = 'https://testnet-rpc.monad.xyz'

// Alias pour typer proprement les erreurs JSON-RPC
interface RpcError extends Error { code?: number }

export function useWeb3() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer,   setSigner]   = useState<JsonRpcSigner  | null>(null)
  const [account,  setAccount]  = useState<string          | null>(null)
  const [chainId,  setChainId]  = useState<number          | null>(null)

  // Un provider lecture seule, sur ton RPC privé
  const readOnlyProvider = new JsonRpcProvider(
    MONAD_TESTNET_RPC,
    MONAD_TESTNET_CHAIN_ID
  )

  const ensureMonadTestnet = useCallback(
    async (raw: Eip1193Provider) => {
      const chainIdHex = `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`
      const target = {
        chainId: chainIdHex,
        chainName: 'Monad Testnet',
        rpcUrls: [MONAD_TESTNET_RPC],
        nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
        blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
      }

      try {
        await raw.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }]
        })
      } catch (err: unknown) {
        const rpcErr = err as RpcError
        if (rpcErr.code === 4902) {
          // la chaîne n’existe pas dans MetaMask → on l’ajoute
          await raw.request({
            method: 'wallet_addEthereumChain',
            params: [target],
          })
        } else {
          throw err
        }
      }
    },
    []
  )

  const connect = useCallback(
    async (useWalletConnect = false) => {
      let rawProvider: Eip1193Provider

      if (useWalletConnect) {
        const wc = new WalletConnectProvider({
          rpc: { [MONAD_TESTNET_CHAIN_ID]: MONAD_TESTNET_RPC }
        })
        await wc.enable()
        rawProvider = wc as unknown as Eip1193Provider
      } else {
        const { ethereum } = window
        if (!ethereum) {
          throw new Error('MetaMask non détecté')
        }
        rawProvider = ethereum
      }

      // on est sûr d’être sur la bonne chaîne
      await ensureMonadTestnet(rawProvider)

      // on "wrap" dans un BrowserProvider, en précisant juste le chainId
      const web3 = new BrowserProvider(rawProvider, MONAD_TESTNET_CHAIN_ID)
      const s    = await web3.getSigner()
      const address = await s.getAddress()
      const network = await web3.getNetwork()

      setProvider(web3)
      setSigner(s)
      setAccount(address)
      // network.chainId est un bigint → conversion en number
      setChainId(Number(network.chainId))
    },
    [ensureMonadTestnet]
  )

  const disconnect = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)
  }, [])

  return {
    provider,
    signer,
    readOnlyProvider,  // si tu en as besoin ailleurs
    account,
    chainId,
    connect,
    disconnect,
  }
}
