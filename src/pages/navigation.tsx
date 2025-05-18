// src/pages/navigation.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import styled, { css } from 'styled-components'
import useWindowSize from '../hooks/useWindowSize'
import leftArrow from '../../public/assets/images/left-arrow.svg'
import rightArrow from '../../public/assets/images/right-arrow.svg'

/** 1) Page title */
const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-top: 2rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  z-index: 5;

  @media (max-width: 768px) {
    font-size: 5vw;
    margin: 2.5%;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    margin: 6vh 1vw 0vh;
    font-size: 5vw;
  }
  @media (min-width: 1024px) and (max-width: 1600px) {
    margin-top: 3%;
    font-size: 2.5rem;
  }
`;

/** 2) Desktop: all cards in one row; tablet: 2×2 grid */
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  justify-content: space-evenly;
  margin: 5%;
  gap: 2.5%;
  z-index: 10;

  @media (min-width: 768px) and (max-width: 1023px) {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 5vw;
    justify-items: center;
  }

  @media (max-width: 767px) {
    display: none;  /* hide on phones */
  }
`

/** 3) Mobile carousel wrapper */
const Carousel = styled.div`
  display: none;
  position: relative;
  align-items: center;
  justify-content: center;

  @media (max-width: 767px) {
    display: flex;
    width: 100%;
    margin: 2rem 0;
  }
`

/** 4) Arrow buttons */
const Arrow = styled.img<{ left?: boolean }>`
  width: 2.5rem;
  cursor: pointer;
  ${({ left }) =>
    left
      ? css`margin-right: 1rem;`
      : css`margin-left: 1rem;`}
  opacity: 0.8;
  transition: opacity .2s;
  &:hover { opacity: 1; }
`

/** 5) CardLink + Card + Label + Thumb (same as before) */
const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: transform 1s ease;
  &:hover {
    transform: scale(1.5);
  }

  @media (max-width: 1024px) {
    flex: 0 1 calc((100% - 25%) / 2);
    max-width: calc((100% - 5%) / 2);
    transition: transform 1s ease;
    &:hover {
      transform: scale(1.25);
    }
  }
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Label = styled.span`
  font-family: 'Permanent Marker', cursive;
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
`

const Thumb = styled.img`
  width: 12.5vw;
  height: 12.5vw;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.2);

  @media (max-width: 767px) {
    width: 60vw;
    height: 60vw;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 25vw;
    height: 25vw;
  }
`

const Animated = styled.div<{ dir: 'left'|'right' }>`
  position: relative;
  transition: transform 1s ease, opacity 1s ease;
  opacity: 0;
  transform: translateX(${p => p.dir === 'right' ? '100%' : '-100%'});

  &.enter {
    opacity: 1;
    transform: translateX(0);
  }
  &.exit {
    opacity: 0;
    transform: translateX(${p =>
      p.dir === 'right' ? '-100%' : '100%'});
  }
`

/** 6) The actual cards data */
const cards = [
  {
    href: '/genesismint',
    label: 'Genesis mint',
    src: '/assets/images/navigation_cards/genesisNFT.gif',
    alt: 'Genesis mint'
  },
  {
    href: 'https://drive.google.com/drive/folders/1Aj1i0plVboki0nFYO-PoXAVwBIr9H0Vn',
    label: 'Ressources',
    src: '/assets/images/navigation_cards/ressources.gif',
    alt: 'Ressources'
  },
  {
    href: '/partners',
    label: 'Partners',
    src: '/assets/images/navigation_cards/partners.gif',
    alt: 'Partners'
  },
  {
    href: 'https://x.com/monad_bandit/status/1922592726425423935',
    label: 'Lore',
    src: '/assets/images/navigation_cards/lore.gif',
    alt: 'Lore'
  },
]

export default function Navigation() {
  const { width = 0 } = useWindowSize()
  const isMobile = width < 768

  const [index, setIndex] = useState(0)
  const [dir,   setDir]   = useState<'left'|'right'>('right')

  const prev = () => { setDir('left');  setIndex(i => (i - 1 + cards.length) % cards.length) }
  const next = () => { setDir('right'); setIndex(i => (i + 1) % cards.length) }

    // local state for CSS class
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')
  
  // whenever index or dir changes, play exit → enter
  useEffect(() => {
    setPhase('exit')
    const t = setTimeout(() => setPhase('enter'), 50)
    return () => clearTimeout(t)
  }, [index, dir])

  return (
    <Layout>
      <Title>Discover the crime estate</Title>

      {/* desktop & tablet grid */}
      <Grid>
        {cards.map((c) => (
          <CardLink key={c.label} href={c.href} passHref>
            <Card>
              <Label>{c.label}</Label>
              <Thumb src={c.src} alt={c.alt} />
            </Card>
          </CardLink>
        ))}
      </Grid>

      {/* phone carousel */}
      {isMobile && (
        <Carousel>
          <Arrow
            src={leftArrow.src}
            alt="Previous"
            left
            onClick={prev}
          />
          <Animated className={phase} dir={dir}>
          <CardLink href={cards[index].href} passHref>
            <Card>
              <Label>{cards[index].label}</Label>
              <Thumb
                src={cards[index].src}
                alt={cards[index].alt}
              />
            </Card>
            </CardLink>
            </Animated>
          <Arrow
            src={rightArrow.src}
            alt="Next"
            onClick={next}
          />
        </Carousel>
      )}
    </Layout>
  )
}
