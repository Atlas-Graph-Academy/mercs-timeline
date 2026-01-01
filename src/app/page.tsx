'use client';

import { useMemo, useState } from 'react';
import TimelineEngine from '@/components/TimelineEngine';
import ReadingPanel from '@/components/ReadingPanel';
import { generateTimelineData, TimelineNode } from '@/lib/data';

export default function Home() {
  const data = useMemo(() => generateTimelineData(), []);
  const nodesWithNotes = useMemo(() => data.filter(d => d.note), [data]);

  const [currentNode, setCurrentNode] = useState<TimelineNode | null>(null);

  return (
    <main>
      <ReadingPanel
        nodes={nodesWithNotes}
        activeNode={currentNode}
        onActiveNodeChange={setCurrentNode}
      />
      <TimelineEngine
        activeNode={currentNode}
        onDateChange={setCurrentNode}
      />
    </main>
  );
}
