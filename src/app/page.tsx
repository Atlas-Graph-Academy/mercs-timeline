'use client';

import { useState } from 'react';
import TimelineEngine from '@/components/TimelineEngine';
import ReadingPanel from '@/components/ReadingPanel';
import { TimelineNode } from '@/lib/data';

export default function Home() {
  const [currentNode, setCurrentNode] = useState<TimelineNode | null>(null);

  return (
    <main>
      <ReadingPanel node={currentNode} />
      <TimelineEngine onDateChange={setCurrentNode} />
    </main>
  );
}
