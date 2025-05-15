// src/pages/mint.tsx
import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import Layout from '../components/Layout'
import { useWeb3Context } from '../context/Web3Context'
import { Contract, formatEther, parseEther } from 'ethers'
import { SIMPLE_MINT_ABI } from '../utils/abi'

// Adresse du contrat & supply max
const CONTRACT_ADDRESS = "0x6E344310B5B745abBA057607A9B0baa1C571c322"
const MAX_SUPPLY       = 999
const genesisNFT = 'https://bandit-website-vokv.vercel.app/assets/images/navigation_cards/genesisNFT.gif'

const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10vw;
  justify-content: center;
  margin: 2.5vh 0;
  @media (min-width: 1024px) { flex-wrap: nowrap; }
`
const InfoCard = styled.div`
  flex: 3;
  min-width: 40vw; min-height: 60vh;
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
const QuantityInput = styled.input`
  width: 4rem;
  padding: 0.25rem;
  font-size: 1rem;
  margin: 0.5rem 0;
  text-align: center;
`
const MintButton = styled.button`
  margin: 1rem 0;
  padding: 1rem 2rem;
  font-family: 'Bangers', cursive;
  font-size: 1.25rem;
  background: #dd1a1b;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.05); }
  &:disabled { opacity: 0.5; cursor: default; }
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
  flex: 2;
  min-width: 100px; min-height: 100px;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
`
const PreviewImage = styled.img`
  max-width: 50vw;
  max-height: 40vh;
`

export default function MintPage() {
  const { provider, signer, account, connect } = useWeb3Context()

  // états UI
  const [totalMinted,  setTotalMinted]   = useState<number | null>(null)
  const [mintPrice,    setMintPrice]     = useState<string>('0')
  const [availableQty, setAvailableQty]  = useState<number>(0)
  const [quantity,     setQuantity]      = useState<number>(1)
  const [isMinting,    setIsMinting]     = useState(false)

  // contrats memoized
  const readOnlyContract = useMemo(
    () => provider
          ? new Contract(CONTRACT_ADDRESS, SIMPLE_MINT_ABI, provider)
          : null,
    [provider]
  )
  const writeContract = useMemo(
    () => signer
          ? new Contract(CONTRACT_ADDRESS, SIMPLE_MINT_ABI, signer)
          : null,
    [signer]
  )

  // charge price & totalSupply dès que le contrat change
  useEffect(() => {
    if (!readOnlyContract) return

    // prix unitaire
    readOnlyContract.mintPrice()
      .then((priceBn: bigint) => setMintPrice(formatEther(priceBn)))
      .catch(console.error)

    // totalMinted (nextTokenId-1)
    readOnlyContract.nextTokenId()
      .then((nextId: bigint) => {
        // convert bigint → number, then -1
        setTotalMinted(Number(nextId) - 1)
      })
      .catch(console.error)
  }, [readOnlyContract])

  // charge quota dispo quand compte ou contrat change
  useEffect(() => {
    if (!readOnlyContract || !account) {
      setAvailableQty(0)
      return
    }
    readOnlyContract
      .availableQuota(account)
      .then((quota: bigint) => {
        setAvailableQty(Number(quota))
      })
      .catch(console.error)
  }, [readOnlyContract, account])

  // met à jour quantity pour qu’elle reste valide
  useEffect(() => {
    const restSupply = MAX_SUPPLY - (totalMinted ?? 0)
    const maxQty = Math.max(0, Math.min(availableQty, restSupply))
    if (quantity > maxQty) setQuantity(maxQty || 1)
  }, [availableQty, totalMinted, quantity])

  // handler de mint batch
  const handleMint = async () => {
    if (!account) {
      await connect(false)
      return
    }
    if (!writeContract || !readOnlyContract) return

    try {
      setIsMinting(true)

      // mint(quantity) payable
      const unitPrice = parseEther(mintPrice)  // bigint
      const tx = await writeContract.mint(quantity, {
        value: unitPrice * BigInt(quantity)
      })
      await tx.wait()

      // relecture rapide: both return bigints
      const [newNext, newQuota] = await Promise.all([
        readOnlyContract.nextTokenId(),
        readOnlyContract.availableQuota(account)
      ])

      // convert each bigint → number
      setTotalMinted(Number(newNext) - 1)
      setAvailableQty(Number(newQuota))

      alert('✅ Mint réussi !')
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : String(err)
      alert('❌ Erreur pendant le mint : ' + message)
    } finally {
      setIsMinting(false)
    }
  }

  // calculs UI
  const restSupply = MAX_SUPPLY - (totalMinted ?? 0)
  const isSoldOut  = restSupply <= 0
  const canMint    = !!account && quantity > 0 && quantity <= availableQty && !isSoldOut

  return (
    <Layout>
      <PageContainer>
        <InfoCard>
          <InfoContent>
            <InfoTitle>GENESIS MINT</InfoTitle>
            <InfoText>
              Prix unitaire : <strong>{mintPrice} MON</strong><br/>
              Votre quota dispo : <strong>{availableQty}</strong><br/>
              Stock restant : <strong>{restSupply}</strong>
            </InfoText>

            <QuantityInput
              type="number"
              min={1}
              max={Math.min(availableQty, restSupply)}
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
            />

            <MintButton
              onClick={handleMint}
              disabled={isMinting || !canMint}
            >
              {!account
                ? 'Connectez votre wallet'
                : isSoldOut
                  ? 'Sold out'
                  : isMinting
                    ? `Mint en cours…`
                    : `Mint ${quantity} × (${mintPrice} MON)`
              }
            </MintButton>
          </InfoContent>

          <MintStatusContainer>
            <MintStatus>
              TOTAL MINTED<br/>
              {totalMinted !== null
                ? `${totalMinted}/${MAX_SUPPLY}`
                : '…/…'}
            </MintStatus>
          </MintStatusContainer>
        </InfoCard>

        <NFTPreview>
        <PreviewImage src={genesisNFT} alt="Aperçu du NFT" />
      </NFTPreview>
      </PageContainer>
    </Layout>
  )
}
