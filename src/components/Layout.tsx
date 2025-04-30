// src/components/Layout.tsx
import { ReactNode } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './Header';

const GlobalStyle = createGlobalStyle`
  /* Reset et police de base */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background: #000;
    color: #fff;
    font-family: 'Arial', sans-serif;
  }
`;

// Conteneur principal
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

// Fond de flammes (statique)
const FlamesBg = styled.div`
  position: absolute;
  inset: 0;
  background: url('../../public/assets/images/flames.svg') no-repeat center/cover;
  z-index: 0;
`;

// Contenu au-dessus des flammes
const Main = styled.main`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

type Props = { children: ReactNode };
export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <GlobalStyle />
      <Container>
        <FlamesBg />
        <Main>{children}</Main>
      </Container>
    </>
  );
}
