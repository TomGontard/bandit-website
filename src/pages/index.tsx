// src/pages/index.tsx
import { useRouter } from 'next/router';
import styled, { keyframes, css } from 'styled-components';
import Layout from '../components/Layout';
import BanditCard from '../components/BanditCard';
import useWindowSize from '../hooks/useWindowSize';
import { useState } from 'react';

const fadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`

const fadeOut = keyframes`
  from {opacity: 1;}
  to {opacity: 0;}
`

const fadeOutBandits = keyframes`
  from {opacity: 1; transform: translateY(0);}
  to {opacity: 0; transform: translateY(300px);}
`

const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
`

const Bobbing = styled.div<{
  fadeEnd: number
  bobOffset: number
}>`
  animation-name:      ${bob};
  animation-duration:  4s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;

  /* start the bob after fadeInUp (fadeEnd ms) + this card's extra offset */
  animation-delay: ${({ fadeEnd, bobOffset }) =>
    `${fadeEnd + bobOffset}ms`};
`

const ButtonWrapper = styled.div<{ exiting?: boolean }>`
  position: absolute;
  display: inline-block;     /* shrink-to-fit content */
  bottom: 47.5%;
  z-index: 10;
  opacity:0;
  opacity: 0;
  animation: 
    ${p => p.exiting 
        ? css`${fadeOut} 2s ease forwards`
        : css`${fadeIn} 2s ease forwards`}; 
  animation-delay: ${p => p.exiting ? '0s' : '2s'};

  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.15);
  }

  @media (min-width: 640px) and (max-width: 1024px) {
    bottom: 60%;
  }
  @media (min-width: 1024px) and (max-width: 1600px) {
    font-size: 50px;
  }
  @media (min-width: 1600px) {
    font-size: 60px;
  }
`

const ButtonFrame = styled.img`
  position: absolute;
  top: 50%;
  left: 52.5%;
  transform: translate(-50%, -50%);
  pointer-events: none;       /* clicks go “through” to the real button */
  width: 110%;               /* or whatever fits your design */
  z-index: 11;

  @media (max-width: 639px) {
    width: 95vw;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    bottom: 60%;
  }
  @media (min-width: 1024px) and (max-width: 1600px) {
    font-size: 50px;
  }
  @media (min-width: 1600px) {
    font-size: 60px;
  }
`

const BlurImage = styled.img`
  position: absolute;
  top: 50%;
  left: 52.5%;
  transform: translate(-50%, -50%);
  pointer-events: none;       /* clicks go “through” to the real button */
  z-index: 9;
  width: 174%;
  height: auto;
  object-fit: fill;
  @media (max-width: 375px) {
    top: -125%;
    left: 52.5%;
    z-index:6;
  }
  @media (min-width:376) and (max-width: 640px) {
    top: -125%;
    left: 52.5%;
    z-index:6;
  }
`

const CTAButton = styled.button`
  position: relative;
  z-index: 10;
  background: transparent;
  border: none;
  color: #fff;
  padding: 20px 40px;
  font-size: 50px;
  cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.heading};
  
  /* 3) text-shadow to boost readability */
  text-shadow: 0px 16px 32px rgb(0, 0, 0);

  /* 4) drop-shadow filter if you want a glow under the whole element */
  filter: drop-shadow(20px 20px 40px rgb(0, 0, 0));

  @media (max-width: 375px) {
    font-size: 8vw;
  }
  @media (min-width: 376px) and (max-width: 640px) {
    font-size: 8vw;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    font-size: 45px;
  }
  @media (min-width: 1024px) and (max-width: 1600px) {
    font-size: 50px;
  }
  @media (min-width: 1600px) {
    font-size: 60px;
  }
`

const Subtitle = styled.p`
  position: absolute;
  font-size: 50px;
  line-height: 1.4;
  text-align: center;
  top: 3%;
  Z-index: 10;
  padding: 0 5%;

   &::before {
    content: '';
    position: absolute;
    inset: -25%;
    background: url('/assets/images/ombre.png') center/cover no-repeat;
    filter: blur(12px);
    z-index: -1;
  }
    
  @media (max-width: 375px) {
    font-size: 17.5px;
    padding: 0 2.5%;
    z-index: 11;
  }
  @media (min-width: 375px) and (max-width: 640px) {
    font-size: 17.5px;
    top: 2%;
    padding: 0 2.5%;
  }
  @media (min-width: 640px) and (max-width: 850px) {
    font-size: 30px;
    padding: 0 2.5%;
  }
  @media (min-width: 850px) and (max-width: 1024px) {
    font-size: 32.5px;
    padding: 0 2.5%;
    top: 5%;
  }
  @media (min-width: 1024px) and (max-width: 1600px) {
    font-size: 45px;
    top: 6.5%;
  }
  @media (min-width: 1600px) {
    font-size: 60px;
  }
`

/** 2) Container relatif pour positionner les Bandits */
const BanditsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

interface WrapperProps {
  left: string;
  bottom: string;
  mdLeft?: string;
  mdBottom?: string;
  lgLeft?: string;
  lgBottom?: string;
  xlLeft?: string;
  xlBottom?: string;
  zIndex: number;
  scale?: number;
  exiting?: boolean;
}

const AbsoluteWrapper = styled.div<WrapperProps>`
  position: absolute;
  left: ${({ left }) => left};
  bottom: ${({ bottom }) => bottom};
  z-index: ${({ zIndex }) => zIndex};
  transform: ${({ scale = 1 }) => `scale(${scale})`};
  ${p => p.exiting && css`
    animation: ${fadeOutBandits} 2s ease forwards;
    animation-delay: 0s;
  `}

  @media (min-width: 640px) {
    left: ${({ mdLeft, left }) => mdLeft ?? left};
    bottom: ${({ mdBottom, bottom }) => mdBottom ?? bottom};
  }
  @media (min-width: 1024px) {
    left: ${({ lgLeft, mdLeft, left }) => lgLeft ?? mdLeft ?? left};
    bottom: ${({ lgBottom, mdBottom, bottom }) => lgBottom ?? mdBottom ?? bottom};
  }
  @media (min-width: 1600px) {
    left: ${({ xlLeft, lgLeft, mdLeft, left }) =>
      xlLeft ?? lgLeft ?? mdLeft ?? left};
    bottom: ${({ xlBottom, lgBottom, mdBottom, bottom }) =>
      xlBottom ?? lgBottom ?? mdBottom ?? bottom};
  }
`;

/** 3) Configuration par Bandit */
// 1) Define your breakpoints
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

// 2) Extend your BanditPos type
type BanditPos = {
  src: string
  alt: string
  delay: number
  smsize: string
  mdSize?: string
  lgSize?: string
  xlSize?: string
  smleft: string
  mdLeft?: string
  lgLeft?: string
  xlLeft?: string
  smbottom: string
  mdBottom?: string
  lgBottom?: string
  xlBottom?: string
  zIndex: number
  visibleAt: Breakpoint[]
}

// 3) Your bandits array now includes `visibleAt`
const bandits: BanditPos[] = [
  {
    src: '/assets/images/bandits/BANDIT1.png',
    alt: 'Bandit 1',
    delay: 500,
    smsize: '275px',
    smleft: '-10%',
    smbottom: '25%',
    mdSize: '550px',
    mdLeft: '42.5%',
    mdBottom: '12.5%',
    lgSize: '400px',
    lgLeft: '-2.5%',
    lgBottom: '15%',
    xlSize: '525px',
    xlLeft: '-2.5%',
    xlBottom: '15%',
    zIndex: 4,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT2.png',
    alt: 'Bandit 2',
    delay: 1000,
    smsize: '225px',
    smleft: '47.5%',
    smbottom: '55%',
    mdSize: '550px',
    mdLeft: '15%',
    mdBottom: '45%',
    lgLeft: '17%',
    lgBottom: '15%',
    lgSize: '350px',
    xlSize: '450px',
    xlLeft: '17%',
    xlBottom: '17.5%',
    zIndex: 2,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT3.png',
    alt: 'Bandit 3',
    delay: 0,
    smsize: '250px',
    smleft: '42.5%',
    smbottom: '22.5%',
    mdSize: '120%',
    mdLeft: '40%',
    mdBottom: '-525%',
    lgSize: '400px',
    lgLeft: '36.5%',
    lgBottom: '15%',
    xlSize: '550px',
    xlLeft: '35%',
    xlBottom: '20%',
    zIndex: 3,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT4.png',
    alt: 'Bandit 4',
    delay: 1000,
    smsize: '250px',
    mdSize: '120px',
    smleft: '-5%',
    smbottom: '60%',
    mdLeft: '50%',
    mdBottom: '0',
    lgSize: '350px',
    lgLeft: '60%',
    lgBottom: '15%',
    xlSize: '475px',
    xlLeft: '55%',
    xlBottom: '20%',
    zIndex: 1,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT5.png',
    alt: 'Bandit 5',
    delay: 500,
    smsize: '80px',
    smleft: '50%',
    mdSize: '500px',
    mdLeft: '-10%',
    mdBottom: '12.5%',
    smbottom: '0',
    lgSize: '350px',
    lgLeft: '78%',
    lgBottom: '15%',
    xlSize: '500px',
    xlLeft: '76%',
    xlBottom: '20%',
    zIndex: 5,
    visibleAt: ['md', 'lg', 'xl'],
  }
]

// your existing styled‐components (Title, CTAButton, BanditsContainer, AbsoluteWrapper) stay the same

export default function Home() {
  const [exiting, setExiting] = useState(false)
  const router = useRouter()
  const { width = 0 } = useWindowSize()

  // 4) determine current breakpoint
  const bp: Breakpoint =
    width < 640 ? 'sm' : width < 1024 ? 'md' : width < 1600 ? 'lg' : 'xl'

  // 5) filter by visibleAt
  const visibleBandits = bandits.filter((b) =>
    b.visibleAt.includes(bp)
  )

  return (
    <Layout>
      <Subtitle>
        A NFT collection of 432 unique rebels on Monad<br/>
        Scarred, stylish and unstoppable.
      </Subtitle>
      <ButtonWrapper exiting={exiting}>
        <BlurImage src={"../assets/images/ombre.png"} alt="" />
        <ButtonFrame src={"../assets/images/around-button.svg"} alt="" />
        <CTAButton onClick={() => {
          setExiting(true)
          setTimeout(() => router.push('/navigation'), 1500)
        }}>
            ENTER THE HIDEOUT
          </CTAButton>
      </ButtonWrapper>
      <BanditsContainer>
        {visibleBandits.map((b, i) => {
          // 600ms = duration of fadeInUp in your BanditCard
          const fadeEnd = b.delay + 600
          // stagger each by 500ms (you can tweak or even Math.random())
          const bobOffset = i * 500

          return (
            <AbsoluteWrapper
              key={i}
              left={b.smleft}
              mdLeft={b.mdLeft}
              lgLeft={b.lgLeft}
              xlLeft={b.xlLeft}
              bottom={b.smbottom}
              mdBottom={b.mdBottom}
              lgBottom={b.lgBottom}
              xlBottom={b.xlBottom}
              zIndex={b.zIndex}
              scale={width > 2000 ? 1.5 : 1}
              exiting={exiting}
            >
              <Bobbing fadeEnd={fadeEnd} bobOffset={bobOffset}>
                <BanditCard
                  src={b.src}
                  alt={b.alt}
                  delay={b.delay}
                  size={b.smsize}
                  mdSize={b.mdSize}
                  lgSize={b.lgSize}
                  xlSize={b.xlSize}
                />
              </Bobbing>
            </AbsoluteWrapper>
          )
        })}
      </BanditsContainer>
    </Layout>
  )
}
