// src/pages/index.tsx
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import BanditCard from '../components/BanditCard';
import styled from 'styled-components';

// Texte et bouton “Join the gang”
const Title = styled.h1`
  font-size: 2.5rem;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const CTAButton = styled.button`
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  background: #e63946;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

// Conteneur des bandits
const BanditsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

const bandits = [
  '/assets/images/bandits/BANDIT1.png',
  '/assets/images/bandits/BANDIT2.png',
  '/assets/images/bandits/BANDIT3.png',
  '/assets/images/bandits/BANDIT4.png',
  '/assets/images/bandits/BANDIT5.png',
];

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <img src="../../public/assets/images/gang.svg" alt="Gang Logo" />
      <Title>Join the gang</Title>

      <BanditsWrapper>
        {bandits.map((src, i) => (
          <BanditCard key={i} src={src} alt={`Bandit ${i + 1}`} delay={i * 200} />
        ))}
      </BanditsWrapper>

      <CTAButton onClick={() => router.push('/navigation')}>Go →</CTAButton>
    </Layout>
  );
}
