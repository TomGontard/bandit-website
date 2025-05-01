// src/pages/navigation.tsx
import Link from 'next/link';
import Layout from '../components/Layout';
import styled from 'styled-components';

/** 1) Page title / subtitle */
const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-top: 2rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

/** 2) Flex row, one “column” per card */
const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  margin: 5%;
  gap: 2.5%;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1.5rem;
  }
`;

/** 3) Each card is a column: label on top, image below, clickable */
const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: transform 1s ease;
  &:hover {
    transform: scale(1.5);
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

/** 4) The “label” above each image */
const Label = styled.span`
  font-family: 'Permanent Marker', cursive; /* or your brush font */
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
`;

/** 5) The thumbnail images */
const Thumb = styled.img`
  width: 12.5vw;
  height: 12.5vw;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.2);
`;

export default function Navigation() {
  return (
    <Layout>
      <Title>Discover the crime estate</Title>
      <Row>
        <CardLink href="/nft" passHref>
          <Card>
            <Label>Collections</Label>
            <Thumb src="/assets/images/logos/logo-nft-thumb.png" alt="NFT" />
          </Card>
        </CardLink>

        <CardLink href="/ressources" passHref>
          <Card>
            <Label>Ressources</Label>
            <Thumb src="/assets/images/logos/logo-ressources-thumb.png" alt="Ressources" />
          </Card>
        </CardLink>

        <CardLink href="/partners" passHref>
          <Card>
            <Label>Partners</Label>
            <Thumb src="/assets/images/logos/logo-partners-thumb.png" alt="Partners" />
          </Card>
        </CardLink>

        <CardLink href="/lore" passHref>
          <Card>
            <Label>Lore</Label>
            <Thumb src="/assets/images/logos/logo-lore-thumb.png" alt="Lore" />
          </Card>
        </CardLink>
      </Row>
    </Layout>
  );
}
