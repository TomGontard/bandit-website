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
  z-index: 5;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 2.5%;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    margin-top: 10%;
    font-size: 2.25rem;
  }
  @media (min-width: 1024px) and (max-width: 1600px) {
    margin-top: 3%;
    font-size: 2.5rem;
  }
`;

/** 2) Flex row, one “column” per card */
const Row = styled.div`
  display: flex;
  width: 100vw;
  justify-content: space-evenly;
  align-items: center;
  margin: 5%;
  gap: 2.5%;
  z-index: 10;

      /* Tablet: 2 columns, automatic rows */
  @media (min-width: 768px) and (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    row-gap: 2rem;
  }

  /* Phone: 1 column, vertical scroll */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 3vh;
    height: 200vh;
    overflow-y: auto;

    /* ensure cards disappear beneath header */
    position: relative;
    z-index: 1;
    padding: 0 1rem;
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

  @media (max-width: 768px) {
      transition: transform 1s ease;
      &:hover {
        transform: scale(1.25);
      }
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

  @media (max-width: 768px) {
    width: 40vw;
    height: 40vw;
  }
`;

export default function Navigation() {
  return (
    <Layout>
      <Title>Discover the crime estate</Title>
        <Row>
          <CardLink href="/genesismint" passHref>
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
