// src/components/BanditCard.tsx
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

interface ImgProps {
  delay: number;
  size: string;      // mobile size
  mdSize?: string;   // >= 640px
  lgSize?: string;   // >= 1024px
  xlSize?: string;   // >= 1600px 
}

const Img = styled.img<ImgProps>`
  width: ${({ size }) => size};
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${({ delay }) => delay}ms;

  @media (min-width: 640px) {
    width: ${({ mdSize, size }) =>
    mdSize ?? size};
  }
  @media (min-width: 1024px) {
    width: ${({ lgSize, mdSize, size }) =>
    lgSize ?? mdSize ?? size};
  }
  @media (min-width: 1600px) {
    width: ${({ xlSize, lgSize, mdSize, size }) =>
      xlSize ?? lgSize ?? mdSize ?? size};
  }
`;

type Props = {
  src: string;
  alt: string;
  delay?: number;
  size: string;
  mdSize?: string;
  lgSize?: string;
  xlSize?: string;
};

export default function BanditCard({
  src,
  alt,
  delay = 0,
  size,
  mdSize,
  lgSize,
  xlSize,
}: Props) {
  return (
    <Img
      src={src}
      alt={alt}
      delay={delay}
      size={size}
      mdSize={mdSize}
      lgSize={lgSize}
      xlSize={xlSize}
    />
  );
}
