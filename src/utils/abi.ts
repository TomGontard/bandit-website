// src/utils/abi.ts
export const SIMPLE_MINT_ABI = [
  // lecture du tokenId courant
  "function nextTokenId() view returns (uint256)",
  // fonction mint payable
  "function mint() payable",
];
