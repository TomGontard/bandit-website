// src/pages/partners.tsx
import React, { useState } from 'react'
import styled from 'styled-components'
import Layout from '../components/Layout'
import PartnerCard from '../components/PartnerCard'
import useWindowSize from '../hooks/useWindowSize'
import leftArrow from '../../public/assets/images/left-arrow.svg'
import rightArrow from '../../public/assets/images/right-arrow.svg'

const ArrowButton = styled.button<{ left?: boolean }>`
  position: absolute;
  top: 37.5%;
  ${({ left }) => (left ? 'left: 2vw;' : 'right: 5vw;')}
  transform: translateY(-50%);
  background: transparent;
  border: none;
  width: 6vw;    
  cursor: pointer;
  z-index: 20;
  @media (min-width: 640px) { display: none; }   /* ➜ TABLET & DESKTOP : caché */
`

const partners = [
  { name: 'LaMouch',      logo: '/assets/images/partners/lamouch.jpg',         url: 'https://x.com/LaMouchNFT' },
  { name: 'Amne',         logo: '/assets/images/partners/amne.png',            url: 'https://x.com/0xAmne' },
  { name: 'Antonio',      logo: '/assets/images/partners/antonio.png',         url: 'https://x.com/doudounads' },
  { name: 'GTG',          logo: '/assets/images/partners/gtg.png',  url: 'https://x.com/realschism' },
  { name: 'Beholdak',     logo: '/assets/images/partners/beholdak.png',         url: 'https://x.com/beholdak' },
  { name: 'Lazy Llamas',  logo: '/assets/images/partners/lazyllama.png',        url: 'https://x.com/LazyLlamas_xyz' },
  { name: 'Deadnads',     logo: '/assets/images/partners/deadnads.png',         url: 'https://x.com/deadnads' },
  { name: 'Monzilla',     logo: '/assets/images/partners/monzilla.png',         url: 'https://x.com/monzillanad' },
  { name: 'Skrumpeys',    logo: '/assets/images/partners/partner-skrumpeys.svg',url: 'https://x.com/skrumpeys' },
  { name: 'BenjaNAD',     logo: '/assets/images/partners/benjanads.png',        url: 'https://x.com/1stBenjaNAD' },
]

const Title = styled.h2`
  font-size: 5vw;
  color: #fff;
  text-align: center;
  margin-top: 2vh;
  font-family: 'Bangers', cursive;
  @media (max-width: 1024px) {
    font-size: 10vw;
  }
`

const CarouselWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10vh;
`

const Inner = styled.div<{ transitioning: boolean }>`
  display: flex;
  gap: 5vw;
  transition: ${({ transitioning }) =>
    transitioning ? 'transform 1.5s ease' : '0s'};
  will-change: transform;
  @media (max-width: 640px) {
    gap: 25vw;
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    gap: 8.5vw;
  }
`

export default function Partners() {
  const { width } = useWindowSize()
  const total = partners.length

  /* centre item index (logical) */
  const [current, setCurrent]      = useState(4)
  /* current strip offset in px */
  const [offsetPx, setOffsetPx]    = useState(0)
  /* are we animating left/right? */
  const [transitioning, setTransitioning] = useState(false)

  /* 10 vw card + 10 vw gap  = 20 vw per step           */
  /* (you used 0.1×width for both)                      */
  const step = width < 640            
        ? width * 0.8                                   
        : width < 1024                        
        ? width * 0.30                         
        : width * 0.20

  const wrap = (i: number) => (i % total + total) % total
  const windowOffsets = width < 640            // phone  (<640 px)
        ? [-1,0,+1]                                  // → only the centre card
        : width < 1024                         // tablet (640-1023 px)
        ? [-2,-1,0,+1,+2]                          // → 3 cards
        : [-4,-3,-2,-1,0,1,2,3,4]         // nine visible slots

  function handleClick(slotIdx: number) {
    const off = windowOffsets[slotIdx]
    if (off === 0) return

    /* 1️⃣ update which item is “logically” the centre */
    setCurrent(c => wrap(c + off))

    /* 2️⃣ instantly jump strip so that new centre is   */
    /*    offset = off  steps away (no animation yet)  */
    setTransitioning(false)
    setOffsetPx(off * step)

    /* 3️⃣ then animate strip back to 0 over 1.5 s      */
    requestAnimationFrame(() => {
      setTransitioning(true)
      setOffsetPx(0)
    })
  }

  return (
    <Layout>
      <Title>Partners</Title>

      <CarouselWrapper>
        <ArrowButton
          left
          onClick={() => handleClick(windowOffsets.indexOf(-1) ?? 0)}
        >
          <img src={leftArrow.src} alt="Précédent" />
        </ArrowButton>
        <Inner
          transitioning={transitioning}
          style={{ transform: `translateX(${offsetPx}px)` }}
          onTransitionEnd={() => setTransitioning(false)}
        >
          {windowOffsets.map(off => {
            const partner = partners[ wrap(current + off) ]
            const dist    = Math.abs(off)

            /* 1.25 ➜ 1 ➜ 0.75 for |off| = 0➜1➜≥2  */
            const scale =
              dist === 0 ? 1.25 :
              dist === 1 ? 1    :
                           0.75

            return (
              <PartnerCard
                key={partner.name}
                logoSrc={partner.logo}
                name={partner.name}
                url={partner.url}
                scale={scale}
                clickable={off === 0}
                onClick={() => handleClick(windowOffsets.indexOf(off))}
              />
            )
          })}
        </Inner>
        <ArrowButton
          onClick={() => handleClick(windowOffsets.indexOf(+1) ?? 0)}
        >
          <img src={rightArrow.src} alt="Suivant" />
        </ArrowButton>
      </CarouselWrapper>
    </Layout>
  )
}