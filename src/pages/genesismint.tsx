// src/pages/mint.tsx
import { useState, useEffect, useMemo } from "react"
import styled from "styled-components"
import Layout from "../components/Layout"
import { useWeb3Context } from "../context/Web3Context"
import { Contract, formatEther, parseEther } from "ethers"
import { SIMPLE_MINT_ABI } from "../utils/abi"

const CONTRACT_ADDRESS = "0x6E344310B5B745abBA057607A9B0baa1C571c322"
const MAX_SUPPLY       = 999
const BATCH_COUNT      = 10
const BATCH_DURATION   = 3600 // seconds per batch (1h)

const PageContainer = styled.div`
  display: flex; 
  width: 100%;
  height: auto;
  gap: 15vw;
  justify-content: center;
  padding: 5vh 10vw;
  @media (min-width: 1024px) { flex-wrap: nowrap; }
`
const InfoCard = styled.div`
  display: flex; 
  flex: 3; 
  flex-direction: column; 
  min-width: 35vw;
  min-height: 20vw;
  max-width: 50vw;
  max-height: 27.5vw;
  background: rgba(255,255,255,0.1);
  border-radius: 1rem;
  border-bottom-left-radius: 7.5vw;
  border-bottom-right-radius: 7.5vw;
  overflow: hidden;
`
const InfoContent = styled.div`
  padding: 2vh 2vw; 
  color: #fff; 
  flex: 1;
  display: flex;
  flex-direction: column;
`
const InfoTitle = styled.h1`
  font-family: 'Permanent Marker', cursive;
  font-size: 3vw; 
  margin-bottom: 1vh;
  text-align: center;
`
const InfoText = styled.p`
  font-size: 1.5vw; 
  line-height: 1.6;
`
const MintStatusContainer = styled.div`
  background: #6b4bf5; 
  padding: 2.5vh 0; 
  text-align: center;
  border-bottom-left-radius: 40vw; 
  border-bottom-right-radius: 40vw;
`
const MintStatus = styled.div`
  font-size: 2vw;
  color: #fff;
`
const MintControl = styled.div`
  display: flex;
  flex: 1;
  max-height: 3rem;
  margin-top: 2vh;
  background: #dd1a1b;
  border-radius: 0.5rem;
  overflow: hidden;
  user-select: none;
`

const SideAction = styled.button<{ disabled?: boolean }>`
  flex: 0 0 3rem;
  height: 3rem;
  border: none;
  background: transparent;
  color: #fff;
  font-family: 'Bangers', cursive;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
  &:hover:not(:disabled) {
    background: rgba(255,255,255,0.1);
  }
`

const MintAction = styled.button<{ disabled?: boolean }>`
  flex: 1;
  border: none;
  background: transparent;
  height: 100%;
  color: #fff;
  font-family: 'Bangers', cursive;
  font-size: 1.25rem;
  padding: 0 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
  &:hover:not(:disabled) {
    background: rgba(255,255,255,0.15);
  }
`
const NFTPreview = styled.div`
  display: flex; 
  flex: 2; 
  min-width: 20vw;
  min-height: 20vw;
  max-width: 30vw;
  max-height: 30vw;
  background: #fff; 
  border-radius: 2rem; 
  overflow: hidden;
  align-items: center; 
  justify-content: center;
`
const PreviewImage = styled.img`
  object-fit: fill;
  width: 100%; 
  height: 100%; 
  object-position: center;
`

export default function MintPage() {
  const { provider, signer, account, connect } = useWeb3Context()

  // UI state
  const [mintPrice,       setMintPrice]       = useState<string>("0")
  const [totalMinted,     setTotalMinted]     = useState<number | null>(null)
  const [baseQuota,       setBaseQuota]       = useState<number>(0)
  const [batchQuotas,     setBatchQuotas]     = useState<number[]>([])
  const [availableQuota,  setAvailableQuota]  = useState<number>(0)
  const [saleStart,       setSaleStart]       = useState<number>(0) // unix seconds
  const [isPaused,        setIsPaused]        = useState<boolean>(true)
  const [quantity,        setQuantity]        = useState<number>(1)
  const [isMinting,       setIsMinting]       = useState<boolean>(false)

  // memoized contract instances
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

  // ── 1) load global on-chain data whenever contract appears ──
  useEffect(() => {
    if (!readOnlyContract) return
    // price
    readOnlyContract.mintPrice()
      .then((bn: bigint) => setMintPrice(formatEther(bn)))
      .catch(console.error)
    // nextTokenId → minted
    readOnlyContract.nextTokenId()
      .then((bn: bigint) => setTotalMinted(Number(bn) - 1))
      .catch(console.error)
    // saleStartTime & paused
    readOnlyContract.saleStartTime()
      .then((bn: bigint) => setSaleStart(Number(bn)))
      .catch(console.error)
    readOnlyContract.paused()
      .then((b: boolean) => setIsPaused(b))
      .catch(console.error)
  }, [readOnlyContract])

  // ── 2) load user‐specific data on login or change ──
  useEffect(() => {
    if (!readOnlyContract || !account) {
      setBaseQuota(0)
      setAvailableQuota(0)
      setBatchQuotas([])
      return
    }
    // base whitelist
    readOnlyContract.whitelistQuota(account)
      .then((bn: bigint) => setBaseQuota(Number(bn)))
      .catch(console.error)

    // availableQuota
    readOnlyContract.availableQuota(account)
      .then((bn: bigint) => setAvailableQuota(Number(bn)))
      .catch(console.error)

    // per-batch quotas 1…10
    Promise.all(
      Array.from({ length: BATCH_COUNT }, (_, i) =>
        readOnlyContract.getBatchQuota(i+1, account)
          .then((bn: bigint) => Number(bn))
      )
    ).then(setBatchQuotas)
      .catch(console.error)
  }, [readOnlyContract, account])

  // ── 3) clamp quantity to valid range ──
  useEffect(() => {
    const minted = totalMinted ?? 0
    const rest   = MAX_SUPPLY - minted
    const maxQty = Math.min(baseQuota + batchQuotas.reduce((a,b) => a+b,0), rest)
    if (quantity > maxQty) setQuantity(maxQty || 1)
  }, [baseQuota, batchQuotas, totalMinted, quantity])

  // ── 4) mint handler ──
  const handleMint = async () => {
    if (!account) {
      await connect(false)
      return
    }
    if (!writeContract) return
    try {
      setIsMinting(true)
      const unitPrice = parseEther(mintPrice)
      const totalValue = unitPrice * BigInt(quantity)
      const tx = await writeContract.mint(quantity, {
        value: totalValue,
      })
      await tx.wait()
      // refresh counts
      const [nextId, avail] = await Promise.all([
        readOnlyContract!.nextTokenId(),
        readOnlyContract!.availableQuota(account)
      ])
      setTotalMinted(Number(nextId) - 1)
      setAvailableQuota(Number(avail))
      alert("✅ Mint réussi !")
    } catch (err: unknown) {
            console.error(err)
            const message = err instanceof Error
              ? err.message
              : String(err)
            alert("❌ Erreur pendant le mint : " + message)
    } finally {
      setIsMinting(false)
    }
  }

  // ── helpers for UI modes ──
  const minted    = totalMinted ?? 0
  const rest      = MAX_SUPPLY - minted
  const soldOut   = rest <= 0
  const nowSec    = Math.floor(Date.now()/1000)
  const elapsedH  = saleStart>0 ? Math.floor((nowSec - saleStart)/3600) : 0
  const upcoming  = batchQuotas
    .map((q,i) => ({ batch: i+1, quota: q }))
    .filter(x => x.quota>0 && nowSec < saleStart + x.batch*BATCH_DURATION)
  const nextBatch = upcoming[0]

  return (
    <Layout>
      <PageContainer>

        <InfoCard>
          <InfoContent>
            <InfoTitle>Bandit Genesis Pass</InfoTitle>
            <InfoText>
              Price per mint : <strong>{mintPrice} $MON</strong><br/>
              Your whitelists on launch : <strong>{baseQuota}</strong><br/>
              { isPaused
                ? <>Launch in&nbsp; 
                    { saleStart>nowSec
                      ? `${Math.ceil((saleStart-nowSec)/3600)}h`
                      : "?"
                    }
                  </>
                : soldOut
                  ? <>Sold out</>
                  : <>Quota available to mint :&nbsp;
                      <strong>{availableQuota}</strong>
                      { nextBatch
                        ? <> + batch {nextBatch.batch} of {nextBatch.quota} in&nbsp;
                            <strong>
                              {Math.ceil((saleStart + nextBatch.batch*3600 - nowSec)/3600)}h
                            </strong>
                          </>
                        : elapsedH>=BATCH_COUNT
                          ? <> (all batches released)</>
                          : null
                      }
                    </>
              }
            </InfoText>

            {/* ─── un seul contrôle “– / Mint / +” ─── */}
        <MintControl>
          <SideAction
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isMinting || soldOut}
          >
            –
          </SideAction>

          <MintAction
            onClick={handleMint}
            disabled={
              isMinting ||
              isPaused ||
              soldOut ||
              quantity < 1 ||
              quantity > availableQuota
            }
          >
            { !account
                ? "Connect wallet"
                : soldOut
                  ? "Sold out"
                  : isMinting
                    ? "Mint…"
                    : `Mint ${quantity}`
            }
          </MintAction>

          <SideAction
            onClick={() => setQuantity(q => Math.min(availableQuota, q + 1))}
            disabled={quantity >= availableQuota || isMinting || soldOut}
          >
            +
          </SideAction>
        </MintControl>
          </InfoContent>

          <MintStatusContainer>
            <MintStatus>
              Status:&nbsp;
              { isPaused
                  ? "?"
                  : soldOut
                    ? "Sold out"
                    : <strong>{minted}/{MAX_SUPPLY}</strong>
                    
              }
            </MintStatus>
          </MintStatusContainer>
        </InfoCard>

        <NFTPreview>
          <PreviewImage
            src="https://bandit-website-vokv.vercel.app/assets/images/navigation_cards/genesisNFT.gif"
            alt="Preview"
          />
        </NFTPreview>

      </PageContainer>
    </Layout>
  )
}
