// src/pages/partners.tsx
import React, { useState } from 'react'
import styled from 'styled-components'
import Layout from '../components/Layout'
import PartnerCard from '../components/PartnerCard'
import useWindowSize from '../hooks/useWindowSize'

const partners = [
  { name: 'LaMouch',      logo: '/assets/images/partners/lamouch.jpg',         url: 'https://x.com/LaMouchNFT' },
  { name: 'Amne',         logo: '/assets/images/partners/amne.png',            url: 'https://x.com/0xAmne' },
  { name: 'Antonio',      logo: '/assets/images/partners/antonio.png',         url: 'https://x.com/doudounads' },
  { name: 'Clay Molandak',logo: '/assets/images/partners/clay-molandak.png',  url: 'https://x.com/realschism' },
  { name: 'Beholdak',     logo: '/assets/images/partners/beholdak.png',         url: 'https://x.com/beholdak' },
  { name: 'Lazy Llamas',  logo: '/assets/images/partners/lazyllama.png',        url: 'https://x.com/LazyLlamas_xyz' },
  { name: 'Deadnads',     logo: '/assets/images/partners/deadnads.png',         url: 'https://x.com/deadnads' },
  { name: 'Monzilla',     logo: '/assets/images/partners/monzilla.png',         url: 'https://x.com/monzillanad' },
  { name: 'Skrumpeys',    logo: '/assets/images/partners/partner-skrumpeys.svg',url: 'https://x.com/skrumpeys' },
  { name: 'BenjaNAD',     logo: '/assets/images/partners/benjanads.png',        url: 'https://x.com/1stBenjaNAD' },
]

const Title = styled.h2`
  font-size: 4vw;
  color: #fff;
  text-align: center;
  margin-top: 1vh;
  font-family: 'Bangers', cursive;
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
    transitioning ? 'transform 2s ease' : '0s'};
`

export default function Partners() {
  const { width } = useWindowSize()
  const total = partners.length

  // 1) Logical center index
  const [current, setCurrent]      = useState(4)
  // 2) Animated horizontal offset (px)
  const [offsetPx, setOffsetPx]    = useState(0)
  // 4) are we mid-slide?
    const [transitioning, setTransitioning] = useState(false)
    
  // Compute pixel measurements of gap & card width from vw
  const cardGap   = width * 0.05    // 5vw
  const cardWidth = width * 0.15    // 10vw
  const step      = cardWidth + cardGap

  // Helper to wrap indices around the ends
  const wrap = (i: number) => (i % total + total) % total

  // Always render these five slots relative to current
  const windowOffsets = [-5, -4, -3, -2, -1, 0, +1, +2, +3, +4, +5]

  // When a side‐slot is clicked:
  // - record how many slots (off) we’ll shift
  // - nudge offsetPx by “-off * step” to animate strip sliding that many steps
  const handleClick = (slotIdx: number) => {
    const off = windowOffsets[slotIdx]
    if (off === 0) return
    // 1) compute new center immediately
    const newCenter = wrap(current + off)
    setCurrent(newCenter)

    // 2) jump the strip by off*step (so that the new center card is exactly off slots away)
    setTransitioning(false)
      setOffsetPx(off * step)

    // 3) turn on transition and animate back to zero
      setTimeout(() => {
          setTransitioning(true)
          setOffsetPx(0)
      }, 0)
  }

  // After the CSS transition finishes, commit the new center and reset offset
  const onTransitionEnd = () => {
    setTransitioning(false)
  }

  return (
    <Layout>
      <Title>Partners</Title>
      <CarouselWrapper>
        <Inner
          transitioning={transitioning}
          style={{ transform: `translateX(${offsetPx}px)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {windowOffsets.map((off, slotIdx) => {
                const partner  = partners[ wrap(current + off) ]

                // distance from center slot
                const dist = Math.abs(off)

                // linear ramp: 1.25 at dist=0 down to 0.75 at dist=2
                let scale = 1.25 - 0.25 * dist

                // clamp between 0.75 and 1.25
                scale = Math.max(0.75, Math.min(1.25, scale))

                // hide beyond ±2 if you want:
                // if (dist > 2) scale = 0

                const isCenter = off === 0

                return (
                    <PartnerCard
                    key={partner.name + off}
                    logoSrc={partner.logo}
                    name={partner.name}
                    url={partner.url}
                    scale={scale}
                    clickable={isCenter}
                    onClick={() => handleClick(slotIdx)}
                    />
                )
            })}
        </Inner>
      </CarouselWrapper>
    </Layout>
  )
}
