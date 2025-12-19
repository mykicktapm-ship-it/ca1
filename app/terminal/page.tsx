'use client';

import AppShell from '@/components/layout/AppShell';
import SourceflowTerminal from '@/components/terminal/SourceflowTerminal';

export default function TerminalPage() {
  return (
    <AppShell>
      <div className="pb-8">
        <SourceflowTerminal />
      </div>
    </AppShell>
  );
}
