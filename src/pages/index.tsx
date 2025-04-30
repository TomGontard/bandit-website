// src/pages/index.tsx
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import BanditCard from '../components/BanditCard';
import useWindowSize from '../hooks/useWindowSize';

const CTAButton = styled.button`
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  background: #e63946;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
  Z-index: 10;

  &:hover {
    transform: scale(1.05);
  }
`;

/** 2) Container relatif pour positionner les Bandits */
const BanditsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;            /* mobile: hauteur minimale */
  margin: 2rem 0;

  @media (min-width: 1024px) {
    height: 300px;          /* desktop: plus de place verticale */
  }
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
    delay: 0,
    smsize: '300px',
    smleft: '-35%',
    smbottom: '-180%',
    mdSize: '120px',
    mdLeft: '10%',
    mdBottom: '10px',
    lgSize: '350px',
    lgLeft: '-2.5%',
    lgBottom: '-70%',
    xlSize: '475px',
    xlLeft: '-3.5%',
    xlBottom: '-100%',
    zIndex: 4,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT2.png',
    alt: 'Bandit 2',
    delay: 200,
    smsize: '300px',
    mdSize: '120px',
    smleft: '30%',
    smbottom: '-60%',
    mdLeft: '30%',
    mdBottom: '20px',
    lgLeft: '15%',
    lgBottom: '-90%',
    lgSize: '350px',
    xlSize: '450px',
    xlLeft: '15%',
    xlBottom: '-120%',
    zIndex: 2,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT3.png',
    alt: 'Bandit 3',
    delay: 400,
    smsize: '300px',
    mdSize: '120px',
    smleft: '35%',
    smbottom: '-210%',
    mdLeft: '50%',
    mdBottom: '0',
    lgBottom: '-75%',
    lgLeft: '35%',
    lgSize: '400px',
    xlSize: '550px',
    xlLeft: '35%',
    xlBottom: '-110%',
    zIndex: 3,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT4.png',
    alt: 'Bandit 4',
    delay: 400,
    smsize: '300px',
    mdSize: '120px',
    smleft: '-40%',
    smbottom: '-60%',
    mdLeft: '50%',
    mdBottom: '0',
    lgBottom: '-85%',
    lgLeft: '58%',
    lgSize: '350px',
    xlSize: '475px',
    xlLeft: '58%',
    xlBottom: '-120%',
    zIndex: 1,
    visibleAt: ['sm', 'md', 'lg', 'xl'],
  },
  {
    src: '/assets/images/bandits/BANDIT5.png',
    alt: 'Bandit 5',
    delay: 400,
    smsize: '80px',
    mdSize: '120px',
    smleft: '50%',
    mdLeft: '50%',
    smbottom: '0',
    mdBottom: '0',
    lgBottom: '-80%',
    lgLeft: '78%',
    lgSize: '350px',
    xlSize: '500px',
    xlLeft: '77%',
    xlBottom: '-120%',
    zIndex: 3,
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

      <CTAButton onClick={() => router.push('/navigation')}>
        JOIN THE GANG
      </CTAButton>
    </Layout>
  )
}
