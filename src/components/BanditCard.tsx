// src/components/BanditCard.tsx
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Img = styled.img<{ delay: number }>`
  width: 80px;
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${({ delay }) => delay}ms;

  @media (min-width: 640px) { width: 120px; }
  @media (min-width: 1024px) { width: 160px; }
`;

type Props = {
  src: string;
  alt: string;
  delay?: number;
};

export default function BanditCard({ src, alt, delay = 0 }: Props) {
  return <Img src={src} alt={alt} delay={delay} />;
}
