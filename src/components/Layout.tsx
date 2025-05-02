// src/components/Layout.tsx
import { ReactNode } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from '../utils/theme'
import Header from './Header'


const GlobalStyle = createGlobalStyle`
  /* Reset et police de base */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* load Permanent Marker */
  @font-face {
    font-family: 'Permanent Marker';
    src: url('/assets/fonts/PermanentMarker-Regular.ttf')
         format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  /* load Bangers */
  @font-face {
    font-family: 'Bangers';
    src: url('/assets/fonts/Bangers-Regular.ttf')
         format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  html, body, #__next {
    height: 100%;
    overflow: hidden;
  }

  body {
    background: #000;
    color: #fff;
    font-family: ${({ theme }) => theme.fonts.body};
    overflow: hidden; 
  }
`;


// Conteneur principal
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// Fond de flammes (statique)
const FlamesBg = styled.img`
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: cover; 
  position: absolute;
  z-index: 0;
  filter: blur(6px); 
`;

// Contenu au-dessus des flammes
const Main = styled.main`
  position: relative;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = { children: ReactNode };
export default function Layout({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <GlobalStyle />
      <Container>
        <FlamesBg src="/assets/images/flames.svg" />
        <Main>{children}</Main>
      </Container>
    </ThemeProvider>
  );
}
