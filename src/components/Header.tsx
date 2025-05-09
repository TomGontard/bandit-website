// src/components/Header.tsx
import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { ROUTES, EXTERNAL_LINKS } from "../utils/links";
import { useWeb3Context } from "../context/Web3Context";


/** Styled-components */
const Bar = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  padding: 1%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  z-index: 20;
    @media (max-width: 640px) {
        max-height: 200px;
    }
    @media (max-width: 1024px) {
        max-height: 250px;
        flex-direction: column;
        padding: 2.5%;
    }
`;

const Left = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Middle = styled.div`
  display: flex;
  flex: 2;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding-top: 2.5%;
  @media (max-width: 640px) {
    width: 100%;
    padding: 5%;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    width: 100%;
    padding: 1%;
  }
`;

const Right = styled.div`
  display: flex;
  flex: 1;
  text-align: center;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding-top: 1.5%;
  gap: 25px;
  @media (max-width: 640px) {
    width: 100%;
    padding: 5%;
    flex-direction: row;
    justify-content: center;    
    gap: 100px;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
    flex-direction: column;
    justify-content: center;
    gap: 1vh;
  }
`;

const Socials = styled.div`
  display: flex;
  @media (max-width: 640px) {
    width: 100%;
    padding: 5%;
    justify-content: center;
    gap: 100px;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    width: 100%;
    padding: 2.5%;
    justify-content: center;
    gap: 25vw;
  } 
`;

const FaviconLogo = styled.img`
  width: 50%;
  cursor: pointer;
  transition: transform .35s;
  &:hover { transform: scale(1.15); }
`;
const BanditLogo = styled.img`
    width: 75%;
    cursor: pointer;
    transition: transform .5s;
    &:hover { transform: scale(1.25); }
    @media (max-width: 640px) {
        width: 300px;
        padding: 2.5%;
        &:hover { transform: scale(1.2); }
    }
    @media (min-width: 640px) and (max-width: 1024px) {
        width: 70%;
        &:hover { transform: scale(1.15); }
    }
`;
const SocialIcon = styled.img`
  width: 27.5%;
  cursor: pointer;
  transition: transform .25s;
  &:hover { transform: scale(1.25); }
    @media (max-width: 640px) {
        width: 50px;
    }
    @media (min-width: 640px) and (max-width: 1024px) {
        width: 20%;
    }
`;

const ConnectBtn = styled.button<{ connected: boolean }>`
  position: relative;
  width: 16vw;
  height: 16vh;
  background: url(${p =>
    p.connected
      ? "/assets/images/connectedWallet.png"
      : "/assets/images/connectWallet.png"}) no-repeat center/contain;
  border: none;
  cursor: pointer;
  color: #fff;
  font-family: 'Bangers', cursive;
  font-size: 2vw;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);

  /* center the text over the image */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .25s;

  &:hover {
    transform: scale(1.25);
  }

  @media (max-width: 640px) {
    width: 4rem;
    height: 2rem;
    font-size: 0.6rem;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    width: 5rem;
    height: 2.25rem;
    font-size: 0.75rem;
  }
`

export default function Header() {
  const { account, connect, disconnect } = useWeb3Context();

  // helper to truncate: 0x + first 4 + … + last 4
  const truncated = (addr: string) =>
    `${addr.slice(0, 6)}…${addr.slice(addr.length - 4)}`;

  return (
    <Bar>
      <Left>
        <Link href={ROUTES.HOME}>
          <FaviconLogo
            src="/assets/images/logos/logo-bandit-small.png"
            alt="Bandit Icon"
          />
        </Link>
      </Left>

      <Middle>
        <Link href={ROUTES.HOME}>
          <BanditLogo
            src="/assets/images/logos/logo-bandit-full.png"
            alt="Bandit"
          />
        </Link>
      </Middle>

      <Right>
        <Socials>
          <Link
            href={EXTERNAL_LINKS.DISCORD}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon
              src="/assets/images/logos/logo-discord.png"
              alt="Discord"
            />
          </Link>

          <Link
            href={EXTERNAL_LINKS.TWITTER}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon
              src="/assets/images/logos/logo-twitter.png"
              alt="Twitter"
            />
          </Link>
        </Socials>

        <ConnectBtn
          connected={!!account}
          onClick={account ? disconnect : () => connect(false)}
        >
          {account ? truncated(account) : "Connect wallet"}
        </ConnectBtn>
      </Right>
    </Bar>
  );
}