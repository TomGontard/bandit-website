// src/utils/abi.ts
export const SIMPLE_MINT_ABI = [
  // --- lecture de la config globale ---
  "function metadataURI() view returns (string)",
  "function mintPrice() view returns (uint256)",
  "function nextTokenId() view returns (uint256)",
  "function saleStartTime() view returns (uint256)",
  "function paused() view returns (bool)",

  // --- whitelist & batch quotas ---
  "function whitelistQuota(address) view returns (uint256)",
  "function availableQuota(address) view returns (uint256)",
  "function getBatchQuota(uint256,address) view returns (uint256)",

  // --- token URI (métadata JSON) ---
  "function tokenURI(uint256) view returns (string)",

  // --- mint payable ---
  "function mint(uint256) payable",
];
