// src/components/Header.tsx
import Link from "next/link";
import styled from "styled-components";
import { ROUTES, EXTERNAL_LINKS } from "../utils/links";

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
    padding: 2.5%;
  }
`;

const Right = styled.div`
  display: flex;
  flex: 1;
  text-align: center;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding-top: 2.5%;
  gap: 30px;
  @media (max-width: 640px) {
    width: 100%;
    padding: 5%;
    flex-direction: row;
    justify-content: center;    
    gap: 100px;
  }
  @media (min-width: 640px) and (max-width: 1024px) {
    width: 100%;
    padding: 2%;
    flex-direction: row;
    justify-content: center;
    gap: 10%;
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
    &:hover { transform: scale(1.5); }
    @media (max-width: 640px) {
        width: 300px;
        padding: 2.5%;
        &:hover { transform: scale(1.2); }
    }
    @media (min-width: 640px) and (max-width: 1024px) {
        width: 70%;
        &:hover { transform: scale(1.25); }
    }
`;
const SocialIcon = styled.img`
  width: 12.5%;
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

export default function Header() {
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
                
      </Right>
    </Bar>
  );
}