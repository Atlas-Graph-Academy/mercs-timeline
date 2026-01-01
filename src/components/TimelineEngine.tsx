'use client';

import React, { useEffect, useRef, useState } from 'react';
import { generateTimelineData, MONTHS, SLOT_HOURS, SLOT_NAMES, TimelineNode } from '@/lib/data';

interface TimelineState {
    zoom: number;
    scrollX: number;
    viewW: number;
    totalW: number;
}

interface TimelineEngineProps {
    onDateChange?: (node: TimelineNode) => void;
}

export default function TimelineEngine({ onDateChange }: TimelineEngineProps) {
    const [data] = useState(() => generateTimelineData());

    // Refs for DOM manipulation
    const trackRef = useRef<HTMLDivElement>(null);
    const navThumbRef = useRef<HTMLDivElement>(null);
    const datesRefs = useRef({
        main: useRef<HTMLDivElement>(null),
        sub: useRef<HTMLDivElement>(null),
        left: useRef<HTMLDivElement>(null),
        right: useRef<HTMLDivElement>(null)
    });

    // State Ref (Mutable for performance)
    const state = useRef<TimelineState>({
        zoom: 2,
        scrollX: 0,
        viewW: 0,
        totalW: 0
    });

    // Track last emitted ID to avoid React render spam
    const lastEmittedId = useRef<number>(-1);

    // Helper to get data safely
    const getD = (i: number): TimelineNode | undefined => {
        const idx = Math.min(Math.max(i, 0), data.length - 1);
        return data[idx];
    };

    const updateEngine = () => {
        if (!trackRef.current) return;

        const s = state.current;

        // 1. Calculate Geometry
        // We utilize CSS variable for node width to avoid loop
        trackRef.current.style.setProperty('--node-width', `${s.zoom}px`);

        s.totalW = data.length * s.zoom;

        // 2. Clamp Scroll
        const maxScroll = s.totalW - s.viewW;

        if (s.totalW < s.viewW) {
            // If zoomed out, center the timeline
            s.scrollX = s.totalW / 2;
        } else {
            // Standard clamping
            if (s.scrollX < 0) s.scrollX = 0;
            if (s.scrollX > maxScroll) s.scrollX = maxScroll;
        }

        // 3. Move Track
        trackRef.current.style.transform = `translateX(${-s.scrollX}px)`;

        // 4. Update HUDs
        updateHUD(s);
    };

    const updateHUD = (s: TimelineState) => {
        // Indices
        const centerOffset = s.scrollX + (s.viewW / 2);
        const centerIdx = Math.floor(centerOffset / s.zoom);
        const leftIdx = Math.floor(s.scrollX / s.zoom);
        const rightIdx = Math.floor((s.scrollX + s.viewW) / s.zoom);

        // Data Points
        const cData = getD(centerIdx);
        const lData = getD(leftIdx);
        const rData = getD(rightIdx);

        if (cData && datesRefs.current.main.current && datesRefs.current.sub.current) {
            datesRefs.current.main.current.innerText = `${cData.y} ${String(cData.m + 1).padStart(2, '0')} ${String(cData.d).padStart(2, '0')}`;
            datesRefs.current.sub.current.innerText = `${SLOT_HOURS[cData.slot]} . ${cData.slot}`;

            // Callback for parent - throttled by ID change
            if (onDateChange && cData.id !== lastEmittedId.current) {
                lastEmittedId.current = cData.id;
                onDateChange(cData);
            }
        }

        if (lData && datesRefs.current.left.current) {
            datesRefs.current.left.current.innerText = `${String(lData.m + 1).padStart(2, '0')}.${String(lData.d).padStart(2, '0')}`;
        }

        if (rData && datesRefs.current.right.current) {
            datesRefs.current.right.current.innerText = `${String(rData.m + 1).padStart(2, '0')}.${String(rData.d).padStart(2, '0')}`;
        }

        // Nav Thumb
        if (navThumbRef.current) {
            let viewRatio = s.viewW / s.totalW;
            let posRatio = s.scrollX / s.totalW;
            if (viewRatio > 1) viewRatio = 1;

            navThumbRef.current.style.width = `${viewRatio * 100}%`;
            navThumbRef.current.style.left = `${posRatio * 100}%`;
        }
    };

    useEffect(() => {
        // Init logic
        state.current.viewW = window.innerWidth;
        state.current.totalW = data.length * state.current.zoom;
        // Start in middle
        state.current.scrollX = (state.current.totalW / 2) - (state.current.viewW / 2);

        updateEngine();

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const s = state.current;

            // ZOOM
            if (e.ctrlKey || e.metaKey) {
                const zoomFactor = 0.1;
                let nextZoom = s.zoom - (e.deltaY * zoomFactor * 0.1);

                // Limits
                if (nextZoom < 0.5) nextZoom = 0.5; // Condensed
                if (nextZoom > 40) nextZoom = 40; // Detailed

                // Zoom towards center logic
                const oldW = s.totalW;
                const oldCenterRatio = (s.scrollX + s.viewW / 2) / oldW;

                s.zoom = nextZoom;

                // Recalc Total W
                const newTotalW = data.length * s.zoom;

                // Keep center focused
                s.scrollX = (newTotalW * oldCenterRatio) - (s.viewW / 2);
            }
            // SCROLL
            else {
                s.scrollX += (e.deltaX + e.deltaY);
            }

            updateEngine();
        };

        const handleResize = () => {
            state.current.viewW = window.innerWidth;
            updateEngine();
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
        };
    }, [data]); // Deps array: run once on mount (and if data changes)

    return (
        <>
            <div className="grid-floor"></div>

            {/* SIDE HUDS */}
            <div className="side-curtain side-left">
                <div className="side-label" ref={datesRefs.current.left}></div>
            </div>
            <div className="side-curtain side-right">
                <div className="side-label" ref={datesRefs.current.right}></div>
            </div>

            {/* CENTER INDICATOR */}
            <div className="center-line"></div>

            {/* VIEWPORT */}
            <div className="viewport">
                <div className="track-container" ref={trackRef}>
                    {data.map((d) => (
                        <div
                            key={d.id}
                            className={`node ${d.isMajor ? 'major' : ''}`}
                            style={{ width: 'var(--node-width, 4px)', height: '100%' } as React.CSSProperties}
                        >
                            <div className="node-label">{d.label}</div>
                            <div
                                className={`node-bar ${d.val > 40 ? 'dense' : ''}`}
                                style={{ height: `${(d.val * 3).toFixed(2)}px` }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER */}
            <div className="footer-complex">
                <div className="nav-container">
                    <div className="nav-track-bg"></div>
                    <div className="nav-thumb" ref={navThumbRef}></div>
                </div>

                <div className="readout-container">
                    <div className="readout-main" ref={datesRefs.current.main}></div>
                    <div className="readout-sub" ref={datesRefs.current.sub}></div>
                </div>
            </div>
        </>
    );
}
