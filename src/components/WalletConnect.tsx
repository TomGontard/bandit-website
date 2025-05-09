import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';

export default function WalletConnect() {
  const { account, connect, disconnect } = useWeb3();

  if (!account) {
    return (
      <div>
        <button onClick={() => connect(false)}>Connect MetaMask</button>
        <button onClick={() => connect(true)}>Connect WalletConnect</button>
      </div>
    );
  }

  return (
    <div>
      <span>Connected: {account}</span>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
