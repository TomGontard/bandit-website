// src/pages/navigation.tsx
import Link from 'next/link';
import Layout from '../components/Layout';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
`;

const Card = styled.a`
  display: block;
  padding: 2rem;
  background: rgba(255,255,255,0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

export default function Navigation() {
  return (
    <Layout>
      <h2>Explore</h2>
      <Grid>
        <Link href="/nft" passHref><Card>NFT</Card></Link>
        <Link href="/game" passHref><Card>Game</Card></Link>
        <Link href="/ressources" passHref><Card>Ressources</Card></Link>
        <Link href="/partners" passHref><Card>Partners</Card></Link>
        <Link href="/lore" passHref><Card>Lore</Card></Link>
      </Grid>
    </Layout>
  );
}
