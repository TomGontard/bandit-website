// src/pages/mint.tsx
import { useState, useEffect, useMemo } from "react"
import styled from "styled-components"
import Layout from "../components/Layout"
import { useWeb3Context } from "../context/Web3Context"
import { Contract, formatEther, parseEther } from "ethers"
import { SIMPLE_MINT_ABI } from "../utils/abi"

const CONTRACT_ADDRESS = "0xC82f152Ba13e4bB1a41BEf7E1e8Fbe67d5403c9f"
const MAX_SUPPLY       = 999
const BATCH_COUNT      = 12
const BATCH_DURATION   = 3600 // sec = 1h

/** Styled-components **/
const PageContainer = styled.div`
  display: flex; 
  gap: 10vw; 
  justify-content: center;
  padding: 5vh 10vw;
  /* desktop : disposition côte-à-côte */
  @media (min-width:1024px){
    flex-direction:row;
  }

  /* mobile : on empile, l’image d’abord */
  @media (max-width:1023px){
    flex-direction:column-reverse;
    align-items:center;      /* centre les deux blocs */
    gap: 4vw;
    padding: 2vh;
  }
`

const InfoCard = styled.div`
  flex:3; 
  min-width:35vw; 
  background:rgba(255,255,255,0.1);
  border-radius:1rem; 
  border-bottom-left-radius:7.5vw;
  border-bottom-right-radius:7.5vw; 
  overflow:hidden;
  display:flex; 
  flex-direction:column;
  @media (max-width:1023px){
    flex:1;
    min-width: 65vw;
    border-bottom-left-radius:15vw;
    border-bottom-right-radius:15vw;
  }
`

const InfoContent = styled.div`
  display:flex; 
  flex-direction:column;
  flex:1; 
  padding:2vh 2vw; 
  color:#fff;
  @media (max-width:1023px){
    padding: 2vh 2vw 1.5vh;
  }
`

const InfoTitle = styled.h1`
  font-family:'Permanent Marker',cursive;
  font-size:3vw; 
  text-align:center; 
  margin-bottom:1vh;
  @media (max-width:1023px){
    font-size: 6vw;
  }
`

const InfoText = styled.p`
  font-size: 1.75vw; 
  line-height:1.6;
  @media (max-width:1023px){
    font-size: 5vw;
  }
`

const MintStatusContainer = styled.div`
  background:#6b4bf5; 
  padding:2.5vh 0; 
  text-align:center;
  border-bottom-left-radius:40vw; 
  border-bottom-right-radius:40vw;
  @media (max-width:1023px){
    padding:2vh 0;
  }
`

const MintStatus = styled.div`
  font-size:2vw; color:#fff;
  @media (max-width:1023px){
    font-size: 6vw;
  }
`

const MintControl = styled.div`
  display:flex; 
  height:3rem; 
  margin-top:auto;
  margin-bottom:0.5vh;
  background:#dd1a1b; 
  border-radius:0.5rem; 
  overflow:hidden;
  user-select:none;
  @media (max-width:1023px){
    height:2rem;
    margin-bottom:0;
  }
`

const SideAction = styled.button<{ disabled?:boolean }>`
  flex:0 0 3rem; 
  border:none; background:transparent;
  color:#fff; 
  font-family:'Bangers',cursive; 
  font-size:2.5rem;
  cursor:pointer; 
  transition:background .2s;
  &:disabled { opacity:.3; cursor:default }
  &:hover:not(:disabled){ background:rgba(255,255,255,.1) }
  @media (max-width:1023px){
    font-size: 1.5rem;
    flex:0 0 2.5rem;
  }
`

const MintAction = styled.button<{ disabled?:boolean }>`
  flex:1; 
  border:none; 
  background:transparent; 
  color:#fff;
  font-family:'Bangers',cursive; 
  font-size: 1.75vw;
  cursor:pointer; 
  transition:background .2s;
  &:disabled { opacity:.5; cursor:default }
  &:hover:not(:disabled){ background:rgba(255,255,255,.15) }
  @media (max-width:1023px){
    font-size: 5vw;
  }
`

const NFTPreview = styled.div`
  flex:2; 
  min-width:20vw; 
  min-height:20vw; 
  background:#fff;
  border-radius:2rem; 
  overflow:hidden;
  display:flex; 
  align-items:center; 
  justify-content:center;
  border:0.5vh solid hsl(0, 0.00%, 100.00%);
  @media (max-width:1023px){
    flex:1;
    width: 65vw;
    height: 65vw;
  }
`

const PreviewImage = styled.img`
  width:100%; 
  height:100%; 
  object-fit:cover;
`

/** Component **/
export default function MintPage() {
  const { provider, signer, account, connect } = useWeb3Context()

  // –– on-chain state
  const [price,      setPrice]      = useState("0")
  const [minted,     setMinted]     = useState<number|null>(null)
  const [launchQty,  setLaunchQty]  = useState(0)
  const [availQty,   setAvailQty]   = useState(0)
  const [batchQuotas,setBatchQuotas]= useState<number[]>([])
  const [startTime,  setStartTime]  = useState(0)   // unix sec
  const [paused,     setPaused]     = useState(true)

  // –– UI state
  const [qty,        setQty]        = useState(1)
  const [isMinting,  setIsMinting]  = useState(false)

  // –– contract instances
  const readOnly = useMemo(
    () => provider
         ? new Contract(CONTRACT_ADDRESS, SIMPLE_MINT_ABI, provider)
         : null,
    [provider]
  )
  const writeOnly = useMemo(
    () => signer
         ? new Contract(CONTRACT_ADDRESS, SIMPLE_MINT_ABI, signer)
         : null,
    [signer]
  )

  // 1️⃣ Charger les données globales
  useEffect(() => {
    if (!readOnly) return
    readOnly.mintPrice()
      .then((b:bigint)=> setPrice(formatEther(b)))
      .catch(console.error)
    readOnly.nextTokenId()
      .then((b:bigint)=> setMinted(Number(b)-1))
      .catch(console.error)
    readOnly.saleStartTime()
      .then((b:bigint)=> setStartTime(Number(b)))
      .catch(console.error)
    readOnly.paused()
      .then((b:boolean)=> setPaused(b))
      .catch(console.error)
  }, [readOnly])

  // 2️⃣ Charger les quotas de l’utilisateur
  useEffect(() => {
    if (!readOnly || !account) {
          setLaunchQty(0)
          setAvailQty(0)
          setBatchQuotas([])
          return
    }
    readOnly.whitelistQuota(account)
      .then((b:bigint)=> setLaunchQty(Number(b)))
      .catch(console.error)
    readOnly.availableQuota(account)
      .then((b:bigint)=> setAvailQty(Number(b)))
      .catch(console.error)
    Promise.all(
      Array.from({length:BATCH_COUNT},(_,i)=>
        readOnly.getBatchQuota(i+1, account)
          .then((b:bigint)=>Number(b))
      )
    ).then(setBatchQuotas).catch(console.error)
  }, [readOnly, account])

  // 3️⃣ Clamp qty
  useEffect(() => {
    const rest = MAX_SUPPLY - (minted||0)
    const maxAllowed = Math.min(launchQty + batchQuotas.reduce((a,b)=>a+b,0), rest)
    if (qty > maxAllowed) setQty(maxAllowed||1)
  }, [launchQty, batchQuotas, minted, qty])

  // 4️⃣ Mint handler
  const handleMint = async ()=>{
    if (!account) { await connect(false); return }
    if (!writeOnly) return

    setIsMinting(true)
    try {
      const unit = parseEther(price)
      const tx   = await writeOnly.mint(qty, { value: unit * BigInt(qty) })
      await tx.wait()
      // refresh counts
      const [n,b] = await Promise.all([
        readOnly!.nextTokenId(),
        readOnly!.availableQuota(account)
      ])
      setMinted(Number(n)-1)
      setAvailQty(Number(b))
      alert("✅ Mint réussi !")
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error ? err.message : String(err)
      alert("❌ Erreur : "+msg)
    } finally {
      setIsMinting(false)
    }
  }

  // –– calculs d’affichage
  const soldOut = (MAX_SUPPLY - (minted||0)) <= 0
  const now   = Math.floor(Date.now()/1000)
  const unitPriceNum  = parseFloat(price || "0")
  const totalCost     = (unitPriceNum * qty).toLocaleString(undefined, {
        maximumFractionDigits: 1
    })
  
  /* ── FCFS helper ──────────────────────────────────────────────── */
  // premier batch (>0) dans lequel tu as un quota
  const fcfsIdx = batchQuotas.findIndex((q, i) => i > 0 && q > 0)   // -1 si aucun
  const fcfsBatch = fcfsIdx >= 0 ? fcfsIdx + 1 : null
  const fcfsUnlockTime = fcfsBatch ? startTime + fcfsBatch * BATCH_DURATION : 0
  const secondsToFCFS  = fcfsUnlockTime - now
  const hrs   = Math.floor(secondsToFCFS / 3600)
  const mins  = Math.floor((secondsToFCFS % 3600) / 60)

  return (
    <Layout>
      <PageContainer>

        <InfoCard>
          <InfoContent>

            <InfoTitle>Bandit Genesis Pass</InfoTitle>

            <InfoText>
              Price per mint : <strong>{price} $MON</strong><br/>
              { paused
                  ? <>Your whitelists on launch : <strong>{launchQty}</strong><br /></>
              : !paused && !soldOut
                  ? <>Your whitelists left : {availQty}</>
              : soldOut
                  ? <>Collection sold out</>
                  : null }
              {/* ----- message dynamique FCFS / batches ------------------ */}
              { paused && fcfsBatch
                  ? <>You have an additionnal <strong>FCFS&nbsp;WL</strong> that will let you mint
                      another NFT <strong>{fcfsBatch} h</strong> after launch.</>
              : !paused && !soldOut && fcfsBatch && secondsToFCFS > 0
                  ? <>Your FCFS whitelist activates in&nbsp;
                      <strong>{hrs} h {mins} min</strong>.</>
              : !paused && !soldOut && fcfsBatch && secondsToFCFS <= 0
                  ? null
              : soldOut
                  ? null
                  : null }

            </InfoText>

            <MintControl>
              <SideAction
                onClick={()=>setQty(q=>Math.max(1,q-1))}
                disabled={qty<=1 || isMinting || soldOut}
              >–</SideAction>

              <MintAction
                onClick={handleMint}
                disabled={ isMinting || paused || soldOut || qty<1 || qty>availQty }
              >
                { !account
                    ? "Connect wallet"
                    : soldOut
                      ? "Sold out"
                      : isMinting
                        ? "Minting…"
                        : `${qty} x Mint (${totalCost} $MON)`
                }
              </MintAction>

              <SideAction
                onClick={()=>setQty(q=>Math.min(availQty,q+1))}
                disabled={qty>=availQty || isMinting || soldOut}
              >+</SideAction>
            </MintControl>

          </InfoContent>

          <MintStatusContainer>
            <MintStatus>
              Status:&nbsp;
              { paused ? "Pré-launch"
                : soldOut ? "Terminé"
                : `${minted}/${MAX_SUPPLY}`
              }
            </MintStatus>
          </MintStatusContainer>
        </InfoCard>

        <NFTPreview>
          <PreviewImage
            src="/assets/images/navigation_cards/genesisNFT.gif"
            alt="Preview"
          />
        </NFTPreview>

      </PageContainer>
    </Layout>
  )
}
