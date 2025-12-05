'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import type { ActiveModal } from './UIContext';

interface ModalRootProps {
  activeModal: ActiveModal;
  children: React.ReactNode;
}

export default function ModalRoot({ activeModal, children }: ModalRootProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (!activeModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 px-3 pb-safe pt-safe backdrop-blur-sm md:items-center md:px-6">
      <div className="flex w-full justify-center md:max-w-3xl">{children}</div>
    </div>,
    document.body
  );
}
