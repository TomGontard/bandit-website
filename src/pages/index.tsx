// src/pages/index.tsx
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import BanditCard from '../components/BanditCard';
import useWindowSize from '../hooks/useWindowSize';

const ButtonWrapper = styled.div`
  position: absolute;
  display: inline-block;     /* shrink-to-fit content */
  bottom: 55%;
  z-index: 10;
`

const ButtonFrame = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;       /* clicks go “through” to the real button */
  width: 200px;               /* or whatever fits your design */
  height: auto;
  z-index: 0;
`

const CTAButton = styled.button`
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding: 20px 40px;
  font-size: 50px;
  cursor: pointer;
  transition: transform 0.5s ease;
  
  /* 3) text-shadow to boost readability */
  text-shadow: 0px 16px 32px rgb(0, 0, 0);

  /* 4) drop-shadow filter if you want a glow under the whole element */
  filter: drop-shadow(20px 20px 40px rgb(0, 0, 0));

  &:hover {
    transform: scale(1.15);
  }
`

const Subtitle = styled.p`
  position: absolute;
  font-size: 50px;
  line-height: 1.4;
  text-align: center;
  top: 3%;
  Z-index: 10;
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
}

const AbsoluteWrapper = styled.div<WrapperProps>`
  position: absolute;
  left: ${({ left }) => left};
  bottom: ${({ bottom }) => bottom};
  z-index: ${({ zIndex }) => zIndex};
  transform: ${({ scale = 1 }) => `scale(${scale})`};

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
    smbottom: '2.5%',
    mdSize: '375px',
    mdLeft: '-7.5%',
    mdBottom: '-5%',
    lgSize: '400px',
    lgLeft: '-2.5%',
    lgBottom: '10%',
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
    smbottom: '37.5%',
    mdSize: '350px',
    mdLeft: '62.5%',
    mdBottom: '0%',
    lgLeft: '17%',
    lgBottom: '10%',
    lgSize: '350px',
    xlSize: '450px',
    xlLeft: '17%',
    xlBottom: '12.5%',
    zIndex: 2,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT3.png',
    alt: 'Bandit 3',
    delay: 0,
    smsize: '250px',
    smleft: '42.5%',
    smbottom: '-2.5%',
    mdSize: '120%',
    mdLeft: '40%',
    mdBottom: '-525%',
    lgSize: '400px',
    lgLeft: '36.5%',
    lgBottom: '10%',
    xlSize: '550px',
    xlLeft: '35%',
    xlBottom: '15%',
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
    smbottom: '42.5%',
    mdLeft: '50%',
    mdBottom: '0',
    lgSize: '350px',
    lgLeft: '60%',
    lgBottom: '10%',
    xlSize: '475px',
    xlLeft: '55%',
    xlBottom: '15%',
    zIndex: 1,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT5.png',
    alt: 'Bandit 5',
    delay: 500,
    smsize: '80px',
    smleft: '50%',
    mdSize: '400px',
    mdLeft: '25%',
    mdBottom: '0',
    smbottom: '0',
    lgSize: '350px',
    lgLeft: '78%',
    lgBottom: '10%',
    xlSize: '500px',
    xlLeft: '76%',
    xlBottom: '18%',
    zIndex: 5,
    visibleAt: ['md', 'lg', 'xl'],
  }
]

// your existing styled‐components (Title, CTAButton, BanditsContainer, AbsoluteWrapper) stay the same

export default function Home() {
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
        NFT collection of 432 unique rebels on Monad<br/>
        Scarred, stylish and unstoppable.
      </Subtitle>
      <ButtonWrapper>
        <ButtonFrame src={"../assets/images/around_btn.png"} alt="" />
          <CTAButton onClick={() => router.push('/navigation')}>
            JOIN THE GANG
          </CTAButton>
      </ButtonWrapper>
      <BanditsContainer>
        {visibleBandits.map((b, i) => (
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
          >
            <BanditCard
              src={b.src}
              alt={b.alt}
              delay={b.delay}
              size={b.smsize}
              mdSize={b.mdSize}
              lgSize={b.lgSize}
              xlSize={b.xlSize}
            />
          </AbsoluteWrapper>
        ))}
      </BanditsContainer>
    </Layout>
  )
}
