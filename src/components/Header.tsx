// src/components/Header.tsx
import Link from "next/link";
import styled from "styled-components";
import { ROUTES, EXTERNAL_LINKS } from "../utils/links";
import { useWeb3 } from "../hooks/useWeb3";

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

const ConnectBtn = styled.button`
  background: rgba(221, 26, 27, 0.9);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-family: 'Bangers', cursive;
  font-size: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: transform 0.25s ease;

  &:hover {
    transform: scale(1.15);
  }

  @media (max-width: 640px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    font-size: 0.9rem;
    padding: 0.45rem 0.9rem;
  }
`;

export default function Header() {
  const { account, connect, disconnect } = useWeb3();

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

        {/* ← Replace image-button with text-button */}
        {account ? (
          <ConnectBtn onClick={disconnect}>
            {truncated(account)}
          </ConnectBtn>
        ) : (
          <ConnectBtn onClick={() => connect(false)}>
            Connect Wallet
          </ConnectBtn>
        )}
      </Right>
    </Bar>
  );
}