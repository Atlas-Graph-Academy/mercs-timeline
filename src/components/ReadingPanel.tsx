'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TimelineNode, MONTHS } from '@/lib/data';

interface ReadingPanelProps {
    nodes: TimelineNode[];
    activeNode: TimelineNode | null;
    onActiveNodeChange: (node: TimelineNode) => void;
}

export default function ReadingPanel({ nodes, activeNode, onActiveNodeChange }: ReadingPanelProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observerOptions = {
            root: scrollContainerRef.current,
            rootMargin: '-40% 0% -40% 0%', // Trigger when element is near the center
            threshold: 0
        };

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nodeId = parseInt(entry.target.getAttribute('data-node-id') || '0');
                    const node = nodes.find(n => n.id === nodeId);
                    if (node) {
                        onActiveNodeChange(node);
                    }
                }
            });
        };

        observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

        const container = scrollContainerRef.current;
        if (container) {
            const elements = container.querySelectorAll('.note-entry');
            elements.forEach(el => observerRef.current?.observe(el));
        }

        return () => observerRef.current?.disconnect();
    }, [nodes, onActiveNodeChange]);

    // Sync scroll when activeNode changes from outside (timeline interaction)
    // But we might want to avoid infinite loops or jitter
    useEffect(() => {
        if (activeNode) {
            const activeEl = scrollContainerRef.current?.querySelector(`[data-node-id="${activeNode.id}"]`);
            if (activeEl) {
                // Only scroll into view if it was triggered by something OTHER than the scroll itself
                // (This is tricky to determine, but usually we can check if it's already in view)
                const rect = activeEl.getBoundingClientRect();
                const containerRect = scrollContainerRef.current?.getBoundingClientRect();
                if (containerRect) {
                    const isInView = rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
                    if (!isInView) {
                        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    }, [activeNode]);

    return (
        <div className="reading-panel">
            {/* Fade Overlays */}
            <div className="mask-gradient top"></div>
            <div className="mask-gradient bottom"></div>

            <div className="scroll-wrapper" ref={scrollContainerRef}>
                <div className="scroll-padding top"></div>

                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className={`note-entry ${activeNode?.id === node.id ? 'active' : ''}`}
                        data-node-id={node.id}
                    >
                        <header className="entry-header">
                            <span className="entry-id">FILE_ID_{node.id}</span>
                            <h1>{node.y}.{MONTHS[node.m]}.{String(node.d).padStart(2, '0')}</h1>
                            <div className="entry-meta">
                                <span>SECTOR: {node.slot}</span>
                                <span className="separator">//</span>
                                <span>STRENGTH: {Math.floor(node.val)}%</span>
                            </div>
                        </header>

                        <article className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {node.note?.content || ''}
                            </ReactMarkdown>
                        </article>

                        {node.val > 60 && (
                            <div className="activity-alert">
                                <span className="pulse"></span>
                                CRITICAL ARCHIVAL DATA DETECTED
                            </div>
                        )}
                    </div>
                ))}

                <div className="scroll-padding bottom"></div>
            </div>

            <style jsx>{`
                .reading-panel {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 100%;
                    max-width: 650px;
                    height: 100vh;
                    z-index: 10;
                    background: transparent;
                    pointer-events: none;
                    display: flex;
                    flex-direction: column;
                    padding-right: 40px;
                }

                .scroll-wrapper {
                    height: 100%;
                    overflow-y: auto;
                    padding: 0 20px;
                    pointer-events: auto;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .scroll-wrapper::-webkit-scrollbar {
                    display: none;
                }

                .scroll-padding {
                    height: 45vh;
                }

                .mask-gradient {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 25vh;
                    z-index: 20;
                    pointer-events: none;
                }

                .mask-gradient.top {
                    top: 0;
                    background: linear-gradient(to bottom, 
                        rgba(0,0,0,1) 0%, 
                        rgba(0,0,0,0.8) 40%, 
                        rgba(0,0,0,0) 100%);
                }

                .mask-gradient.bottom {
                    bottom: 0;
                    background: linear-gradient(to top, 
                        rgba(0,0,0,1) 0%, 
                        rgba(0,0,0,0.8) 40%, 
                        rgba(0,0,0,0) 100%);
                }

                .note-entry {
                    margin-bottom: 200px;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.2;
                    transform: scale(0.95);
                    filter: blur(2px);
                }

                .note-entry.active {
                    opacity: 1;
                    transform: scale(1);
                    filter: blur(0);
                }

                .entry-header {
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--wire-dim);
                    padding-bottom: 1rem;
                }

                .entry-id {
                    font-family: monospace;
                    font-size: 0.7rem;
                    color: var(--wire-mid);
                    letter-spacing: 2px;
                }

                h1 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 3rem;
                    margin: 0.5rem 0;
                    color: var(--wire-lit);
                    font-weight: 800;
                    letter-spacing: -2px;
                    text-transform: uppercase;
                }

                .entry-meta {
                    font-family: monospace;
                    font-size: 0.8rem;
                    color: var(--wire-mid);
                    display: flex;
                    gap: 1rem;
                }

                .separator {
                    color: var(--wire-dim);
                }

                .markdown-content {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: #ddd;
                }

                .markdown-content p {
                    margin-bottom: 1.5rem;
                }

                .activity-alert {
                    margin-top: 3rem;
                    padding: 0.75rem 1.5rem;
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    background: rgba(255, 0, 0, 0.05);
                    color: #f44;
                    font-family: monospace;
                    font-size: 0.7rem;
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pulse {
                    width: 6px;
                    height: 6px;
                    background: #f44;
                    border-radius: 50%;
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.2; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
