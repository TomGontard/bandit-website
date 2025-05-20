// src/hooks/useWeb3.ts
import { useState, useCallback, useEffect } from 'react'
import {
  BrowserProvider, JsonRpcProvider,
  type JsonRpcSigner, type Eip1193Provider
} from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      on(event:'chainChanged',    l:(hex:string)=>void):void
      on(event:'accountsChanged', l:(a:string[])=>void):void
      removeListener(event:'chainChanged',    l:(hex:string)=>void):void
      removeListener(event:'accountsChanged', l:(a:string[])=>void):void
    }
  }
}

export const MONAD_TESTNET_CHAIN_ID = 10143
const MONAD_TESTNET_RPC            = 'https://testnet-rpc.monad.xyz'

export function useWeb3() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer  , setSigner  ] = useState<JsonRpcSigner  | null>(null)
  const [account , setAccount ] = useState<string | null>(null)
  const [chainId , setChainId ] = useState<number | null>(null)
  const [correct , setCorrect ] = useState<boolean>(false)

  /* ---- read-only provider -------------------------------------- */
  const readOnlyProvider = new JsonRpcProvider(
    MONAD_TESTNET_RPC,
    MONAD_TESTNET_CHAIN_ID
  )

  /* ---- helper qui hydrate tout à partir d’un provider brut ------ */
  const hydrateFromRaw = useCallback(async (raw:Eip1193Provider) => {
    const web3    = new BrowserProvider(raw, MONAD_TESTNET_CHAIN_ID)
    const s       = await web3.getSigner()
    const addr    = await s.getAddress()
    const network = await web3.getNetwork()

    setProvider(web3)
    setSigner(s)
    setAccount(addr)
    setChainId(Number(network.chainId))
    setCorrect(Number(network.chainId) === MONAD_TESTNET_CHAIN_ID)
  }, [])

  /* ---- switch / add Monad Testnet ------------------------------ */
  const switchNetwork = useCallback(async (raw:Eip1193Provider) => {
    const hex = '0x' + MONAD_TESTNET_CHAIN_ID.toString(16)
    const params = [{
      chainId: hex,
      chainName: 'Monad Testnet',
      rpcUrls: [MONAD_TESTNET_RPC],
      nativeCurrency: { name:'MON', symbol:'MON', decimals:18 },
      blockExplorerUrls: ['https://testnet.monadexplorer.com/']
    }]

    try {
      await raw.request({ method:'wallet_switchEthereumChain', params:[{ chainId:hex }] })
    } catch {
      await raw.request({ method:'wallet_addEthereumChain', params })
      await raw.request({ method:'wallet_switchEthereumChain', params:[{ chainId:hex }] })
    }
  }, [])

  /* ---- connexion via bouton (inchangé) -------------------------- */
  const connect = useCallback(async (useWC=false) => {
    let raw:Eip1193Provider
    if (useWC) {
      const wc = new WalletConnectProvider({ rpc:{[MONAD_TESTNET_CHAIN_ID]:MONAD_TESTNET_RPC}})
      await wc.enable()
      raw = wc as unknown as Eip1193Provider
    } else {
      if (!window.ethereum) throw new Error('MetaMask non détecté')
      raw = window.ethereum
      await raw.request({ method:'eth_requestAccounts' })
    }
    await switchNetwork(raw)
    await hydrateFromRaw(raw)
  }, [switchNetwork, hydrateFromRaw])

  const disconnect = useCallback(() => {
    setProvider(null); setSigner(null)
    setAccount(null);  setChainId(null)
    setCorrect(false)
  }, [])

  /* ---- auto-hydrate au chargement de la page -------------------- */
  useEffect(() => {
    const eth = window.ethereum
    if (!eth) return

    Promise.all([
      eth.request({ method:'eth_accounts'  }) as Promise<string[]>,
      eth.request({ method:'eth_chainId'   }) as Promise<string>
    ]).then(async ([accs, hex]) => {
      if (accs.length === 0) return                     // pas connecté
      if (parseInt(hex,16) === MONAD_TESTNET_CHAIN_ID) {
        await hydrateFromRaw(eth)                       // déjà bon réseau
      } else {
        try {
          await switchNetwork(eth)                      // tente switch
          await hydrateFromRaw(eth)
        } catch {/* l’utilisateur a pu refuser, on ignore */}
      }
    }).catch(()=>{})

    const handleChain    = (hex:string) => {
      const id = parseInt(hex,16)
      setChainId(id); setCorrect(id===MONAD_TESTNET_CHAIN_ID)
    }
    const handleAccounts = (accs:string[]) => setAccount(accs[0]||null)

    eth.on('chainChanged',    handleChain)
    eth.on('accountsChanged', handleAccounts)
    return () => {
      eth.removeListener('chainChanged',    handleChain)
      eth.removeListener('accountsChanged', handleAccounts)
    }
  }, [hydrateFromRaw, switchNetwork])

  /* ---- valeurs exposées ---------------------------------------- */
  return {
    provider, signer, readOnlyProvider,
    account, chainId, isCorrectNetwork: correct,
    connect, switchNetwork, disconnect,
  }
}
