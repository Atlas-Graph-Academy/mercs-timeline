import { TimelineNode, MONTHS } from '@/lib/data';

interface ReadingPanelProps {
    node: TimelineNode | null;
}

export default function ReadingPanel({ node }: ReadingPanelProps) {
    if (!node) {
        return (
            <div className="reading-panel empty">
                <div className="placeholder-text">INITIATING TEMPORAL SYNC...</div>
            </div>
        );
    }

    // Generate a key based on the node to force animation restart if needed
    const dateKey = `${node.y}-${node.m}-${node.d}-${node.slot}`;

    return (
        <div className="reading-panel">
            <div className="content-container">
                <h1>ENTRY: {node.y}.{MONTHS[node.m]}.{String(node.d).padStart(2, '0')}</h1>
                <div className="meta-info">SECTOR: {node.slot} // SIGNAL STRENGTH: {Math.floor(node.val)}%</div>

                <article className="markdown-body">
                    <p>
                        Scanning for archival data at coordinate {dateKey}...
                    </p>
                    <p>
                        [Markdown content will be injected here relative to the timeline anchor.]
                    </p>
                    {node.val > 40 && (
                        <div className="alert-box">
                            HIGH ACTIVITY DETECTED
                        </div>
                    )}
                </article>
            </div>

            <style jsx>{`
        .reading-panel {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none; /* Let clicks pass through to timeline often, but maybe not for text? */
          z-index: 10;
        }
        .content-container {
          width: 800px;
          max-width: 90%;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--wire-dim);
          padding: 40px;
          pointer-events: auto;
          backdrop-filter: blur(5px);
          box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }
        h1 {
            font-size: 2rem;
            margin: 0 0 10px 0;
            color: var(--wire-lit);
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .meta-info {
            font-size: 0.8rem;
            color: var(--wire-mid);
            margin-bottom: 30px;
            font-family: monospace;
        }
        .markdown-body {
            font-size: 1.1rem;
            color: #ccc;
            line-height: 1.6;
        }
        .alert-box {
            margin-top: 20px;
            border: 1px solid #f00;
            color: #f00;
            padding: 10px;
            font-size: 0.8rem;
            display: inline-block;
        }
        .placeholder-text {
            animation: blink 2s infinite;
        }
        @keyframes blink {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
        }
      `}</style>
        </div>
    );
}
