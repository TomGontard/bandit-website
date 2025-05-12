// src/pages/mint.tsx
import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import Layout from '../components/Layout'
import { useWeb3Context } from '../context/Web3Context'
import { Contract } from 'ethers'
import { SIMPLE_MINT_ABI } from '../utils/abi'
import placeholder from '../../public/assets/images/connectWallet.png'

// Adresse et prix du mint
const CONTRACT_ADDRESS = "0xF1fD630E3eAe258a38730ce751E7a2f9Dd58ec9e"
const PRICE = 1_000_000_000_000_000_000n // 1 MON en wei

const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20vw;
  justify-content: center;
  margin: 2.5vh 10vw;

  @media (min-width: 1024px) {
    flex-wrap: nowrap;
  }
`

const InfoCard = styled.div`
  flex: 1;
  min-width: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 1rem;
  border-bottom-left-radius: 10vw;
  border-bottom-right-radius: 10vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const InfoContent = styled.div`
  padding: 2rem;
  color: #fff;
  flex: 1;
`

const InfoTitle = styled.h1`
  font-family: 'Bangers', cursive;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`

const InfoText = styled.p`
  font-size: 1.1rem;
  line-height: 1.4;
`

const MintButton = styled.button`
  margin: 2rem;
  padding: 1rem 2rem;
  font-family: 'Bangers', cursive;
  font-size: 1.25rem;
  background: #dd1a1b;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

const MintStatusContainer = styled.div`
  background: #6b4bf5;
  padding: 1.5rem 0;
  text-align: center;
  border-bottom-left-radius: 50vw;
  border-bottom-right-radius: 50vw;
`

const MintStatus = styled.div`
  font-family: 'Permanent Marker', cursive;
  font-size: 1.5rem;
  color: #fff;
`

const NFTPreview = styled.div`
  flex: 1;
  min-width: 200px;
  min-height: 200px;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PreviewImage = styled.img`
  max-width: 50vw;
  height: auto;
`

export default function MintPage() {
  const { provider, signer, account, connect } = useWeb3Context()
  const [totalMinted, setTotalMinted] = useState<number | null>(null)
  const [isMinting, setIsMinting]     = useState(false)

  // 1️⃣ Memoize les instances de contrat pour garder la référence stable
  const readOnlyContract = useMemo(() => {
    return provider
      ? new Contract(CONTRACT_ADDRESS, SIMPLE_MINT_ABI, provider)
      : null
  }, [provider])

  const writeContract = useMemo(() => {
    return signer
      ? new Contract(CONTRACT_ADDRESS, SIMPLE_MINT_ABI, signer)
      : null
  }, [signer])

  // 2️⃣ Lecture de nextTokenId() dès que le readOnlyContract change
  useEffect(() => {
    if (!readOnlyContract) return
    let cancelled = false

    readOnlyContract.nextTokenId()
      .then((bn: bigint) => {
        if (!cancelled) setTotalMinted(Number(bn))
      })
      .catch(console.error)

    return () => { cancelled = true }
  }, [readOnlyContract])

  // 3️⃣ Fonction de mint
  const handleMint = async () => {
    if (!account) {
      await connect(false)
      return
    }
    if (!writeContract || !readOnlyContract) return

    try {
      setIsMinting(true)
      const tx = await writeContract.mint({ value: PRICE })
      await tx.wait()

      // après confirmation, on relit nextTokenId
      const newId = await readOnlyContract.nextTokenId()
      setTotalMinted(Number(newId))

      alert('✅ Mint réussi !')
    } catch (err: unknown) {
      console.error(err)
      // type‐guard pour récupérer le message
      const message = err instanceof Error
        ? err.message
        : String(err)
      alert('❌ Erreur pendant le mint : ' + message)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <Layout>
      <PageContainer>
        <InfoCard>
          <InfoContent>
            <InfoTitle>GENESIS MINT</InfoTitle>
            <InfoText>Chaque adresse peut minter son quota.</InfoText>

            <MintButton
              onClick={handleMint}
              disabled={isMinting || (totalMinted ?? 0) >= 999}
            >
              {!account
                ? 'Connectez votre wallet'
                : isMinting
                  ? 'Mint en cours…'
                  : (totalMinted ?? 0) >= 999
                    ? 'Sold out'
                    : 'Mint maintenant (1 MON)'
              }
            </MintButton>
          </InfoContent>

          <MintStatusContainer>
            <MintStatus>
              TOTAL MINTED<br />
              {totalMinted !== null
                ? `${totalMinted}/999`
                : '…/…'}
            </MintStatus>
          </MintStatusContainer>
        </InfoCard>

        <NFTPreview>
          <PreviewImage src={placeholder.src} alt="Aperçu du NFT" />
        </NFTPreview>
      </PageContainer>
    </Layout>
  )
}
