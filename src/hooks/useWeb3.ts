// src/hooks/useWeb3.ts
import { useState, useCallback } from 'react'
import { BrowserProvider, type JsonRpcSigner, type Eip1193Provider } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

declare global {
  interface Window { ethereum?: Eip1193Provider }
}

// Remplacez 123 par l’ID numérique de votre testnet Monad
const MONAD_TESTNET_CHAIN_ID = 10143

// petit alias pour typer l’erreur RPC
interface RpcError extends Error {
  code?: number
}

export function useWeb3() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer,   setSigner]   = useState<JsonRpcSigner | null>(null)
  const [account,  setAccount]  = useState<string | null>(null)
  const [chainId,  setChainId]  = useState<number | null>(null)

  const ensureMonadTestnet = useCallback(
    async (raw: Eip1193Provider) => {
      const target = {
        chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
        chainName: 'Monad Testnet',
        rpcUrls: ['https://testnet-rpc.monad.xyz'],
        nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
        blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
      }

      try {
        await raw.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: target.chainId }],
        })
      } catch (err: unknown) {
        const rpcErr = err as RpcError
        if (rpcErr.code === 4902) {
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
          rpc: { [MONAD_TESTNET_CHAIN_ID]: 'https://testnet-rpc.monad.xyz' }
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

      await ensureMonadTestnet(rawProvider)

      const web3 = new BrowserProvider(rawProvider)
      const s = await web3.getSigner()
      const address = await s.getAddress()
      const network = await web3.getNetwork()

      setProvider(web3)
      setSigner(s)
      setAccount(address)
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

  return { provider, signer, account, chainId, connect, disconnect }
}
