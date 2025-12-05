'use client';

import { TonConnectButton as TonUIButton, useTonWallet } from '@tonconnect/ui-react';
import { useMemo } from 'react';

function shortenAddress(address: string) {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function TonConnectButton() {
  const wallet = useTonWallet();

  const label = useMemo(() => {
    if (!wallet?.account?.address) return 'Connect TON Wallet';
    return shortenAddress(wallet.account.address);
  }, [wallet]);

  const connected = Boolean(wallet);

  return (
    <div className="flex items-center gap-2">
      <TonUIButton className="hidden md:inline-flex" />
      <TonUIButton className="md:hidden [&>button]:!px-3 [&>button]:!py-1" />
      {connected && (
        <span className="hidden rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 md:inline-flex">
          {label}
        </span>
      )}
    </div>
  );
}
