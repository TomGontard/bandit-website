// src/utils/abi.ts
export const SIMPLE_MINT_ABI = [
  // --- Read methods ---
  "function mintPrice() view returns (uint256)",
  "function nextTokenId() view returns (uint256)",
  "function whitelistQuota(address user) view returns (uint256)",
  "function availableQuota(address user) view returns (uint256)",
  "function getBatchQuota(uint256 batchIndex, address user) view returns (uint256)",
  "function saleStartTime() view returns (uint256)",
  "function paused() view returns (bool)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  // --- Write method ---
  "function mint(uint256 quantity) payable",
]
