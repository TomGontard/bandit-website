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
`;

const Left = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const Middle = styled.div`
  display: flex;
  flex: 2;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
  padding-top: 2.5%;
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
`;

const FaviconLogo = styled.img`
  width: 50%;
  cursor: pointer;
  transition: transform .35s;
  &:hover { transform: scale(1.15); }
  /* …media queries… */
`;
const BanditLogo = styled.img`
    width: 50%;
    cursor: pointer;
    transition: transform .5s;
    &:hover { transform: scale(1.5); }
    /* … */
`;
const SocialIcon = styled.img`
  width: 12.5%;
  cursor: pointer;
  transition: transform .25s;
  &:hover { transform: scale(1.25); }
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
        <p>
          NFT collection of 432 unique rebels on Monad<br/>
          Scarred, stylish and unstoppable.
        </p>
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