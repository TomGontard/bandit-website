// src/components/PartnerCard.tsx
import Link from 'next/link'
import styled, { keyframes } from 'styled-components'

const bounce = keyframes`
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-30px); }
`

const CardContainer = styled.div<{
  scale: number
  clickable: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* actually apply the scale and animate it */
  transform: scale(${p => p.scale});
  transition: transform 1.5s ease;

  cursor: ${p => (p.clickable ? 'pointer' : 'default')};
`

const Logo = styled.img`
  width: 15vw;      /* match this to how wide you render it */
  height: auto;
  border-radius: 50%;

  &:hover {
    animation: ${bounce} 0.5s ease;
  }

  @media (max-width: 640px) {
    width: 55vw;    /* match this to how wide you render it */
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    width: 25vw;    /* match this to how wide you render it */
  }
`

const Label = styled.span`
  margin-top: 5%;
  font-size: 150%;
  font-family: 'Permanent Marker', cursive;
  color: #fff;
  text-shadow: 0 4px 8px rgba(0,0,0,1);
`

export default function PartnerCard({
  logoSrc,
  name,
  url,
  scale,
  clickable,
  onClick,
}: {
  logoSrc: string
  name: string
  url: string
  scale: number
  clickable: boolean
  onClick: () => void
}) {
  const content = (
    <CardContainer scale={scale} clickable={clickable} onClick={onClick}>
      <Logo src={logoSrc} alt={name} />
      <Label>{name}</Label>
    </CardContainer>
  )

  if (clickable) {
    return (
      <Link href={url} passHref legacyBehavior>
        <a>{content}</a>
      </Link>
    )
  }
  return content
}
