"use client";

import React, { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { useTranslations } from 'next-intl';

// --- Helper Hook ---
function useClickOutside(ref: React.RefObject<any>, handler: () => void) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

interface DateRangeSelectorProps {
    startDate?: Date;
    endDate?: Date;
    onDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;

    // Time props (optional)
    startTime?: string;
    returnTime?: string;
    onStartTimeChange?: (time: string) => void;
    onReturnTimeChange?: (time: string) => void;
    hours?: string[];

    className?: string;
    numberOfMonths?: number;
}

export function DateRangeSelector({
    startDate,
    endDate,
    onDateChange,
    startTime = "10:00",
    returnTime = "10:00",
    onStartTimeChange,
    onReturnTimeChange,
    hours = [],
    className,
    numberOfMonths = 2
}: DateRangeSelectorProps) {
    const t = useTranslations('reservation');

    // --- State ---
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null); // 'start' means we are picking start date

    const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
    const [isReturnTimeOpen, setIsReturnTimeOpen] = useState(false);

    // --- Refs ---
    const containerRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<HTMLDivElement>(null);
    const returnTimeRef = useRef<HTMLDivElement>(null);

    // --- Effects ---
    useClickOutside(containerRef, () => {
        setIsCalendarOpen(false);
        setActiveInput(null);
    });
    useClickOutside(startTimeRef, () => setIsStartTimeOpen(false));
    useClickOutside(returnTimeRef, () => setIsReturnTimeOpen(false));

    // Consolidate selectedRange for DayPicker
    const selectedRange: DateRange | undefined = (startDate || endDate) ? { from: startDate, to: endDate } : undefined;

    // --- Handlers ---
    const handleDaySelect = (range: DateRange | undefined, selectedDay: Date) => {
        if (!selectedDay) return;

        if (activeInput === 'start') {
            // Picking Start Date
            // If we pick a start date, we reset the end date to force a fresh selection logic
            // UNLESS the library gives us a range? 
            // The original logic was: "Si on choisit la date de départ, on force la date de fin à undefined"

            const newRange = { from: selectedDay, to: undefined };
            onDateChange(newRange);

            // Switch to End Date mode
            setActiveInput('end');
            // Keep calendar open
        } else {
            // Picking End Date (or default range behavior)
            // If the user clicks a date BEFORE the start date, DayPicker might handle it or we swap
            // But relying on DayPicker's 'range' logic is usually safest if 'mode="range"'

            // However, consistent with original logic:
            onDateChange({ from: range?.from, to: range?.to });

            if (range?.from && range?.to) {
                // Formatting Check: Ensure 'to' is after 'from' if needed, but DayPicker handles that
                setIsCalendarOpen(false);
                setActiveInput(null);
            }
        }
    };

    const toggleStartCalendar = () => {
        setIsCalendarOpen(true);
        setActiveInput('start');
    };

    const toggleEndCalendar = () => {
        setIsCalendarOpen(true);
        setActiveInput('end');
    };

    // --- Responsive Months Logic ---
    const [numMonths, setNumMonths] = useState(numberOfMonths);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setNumMonths(1);
            } else {
                setNumMonths(numberOfMonths);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [numberOfMonths]);

    return (
        <div className={`dates-container ${className || ''}`} ref={containerRef}>

            {/* --- Start Date & Time --- */}
            <div className="start-date-container">
                <span className="label-text">{t('departure_date_time')}</span>
                <div className="button-start">
                    <button
                        type="button"
                        className={`choose-date ${activeInput === 'start' && isCalendarOpen ? 'open' : ''}`}
                        onClick={toggleStartCalendar}
                    >
                        <i className="fas fa-calendar-alt"></i>
                        <span>
                            {startDate ? format(startDate, 'dd/MM/yyyy') : t('departure')}
                        </span>
                    </button>

                    {/* Time Picker Start */}
                    {hours.length > 0 && onStartTimeChange && (
                        <div
                            className={`choose-hour ${isStartTimeOpen ? 'open' : ''}`}
                            ref={startTimeRef}
                            onClick={(e) => { e.stopPropagation(); setIsReturnTimeOpen(false); setIsStartTimeOpen(!isStartTimeOpen); }}
                        >
                            <div className="choose-hour-select">
                                <div className="selected">
                                    <span>{startTime}</span>
                                    {/* Arrow SVG */}
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                        <path d="M7 10l5 5 5-5z" />
                                    </svg>
                                </div>
                            </div>
                            {isStartTimeOpen && (
                                <ul className="options">
                                    {hours.map((h) => (
                                        <li key={h} onClick={(e) => {
                                            e.stopPropagation();
                                            onStartTimeChange(h);
                                            setIsStartTimeOpen(false);
                                        }}>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- End Date & Time --- */}
            <div className="end-date-container">
                <span className="label-text">{t('return_date_time')}</span>
                <div className="button-end">
                    <button
                        type="button"
                        className={`choose-date ${activeInput === 'end' && isCalendarOpen ? 'open' : ''}`}
                        onClick={toggleEndCalendar}
                    >
                        <i className="fas fa-calendar-alt"></i>
                        <span>
                            {endDate ? format(endDate, 'dd/MM/yyyy') : t('return')}
                        </span>
                    </button>

                    {/* Time Picker Return */}
                    {hours.length > 0 && onReturnTimeChange && (
                        <div
                            className={`choose-hour return-hour ${isReturnTimeOpen ? 'open' : ''}`}
                            ref={returnTimeRef}
                            onClick={(e) => { e.stopPropagation(); setIsStartTimeOpen(false); setIsReturnTimeOpen(!isReturnTimeOpen); }}
                        >
                            <div className="choose-hour-select">
                                <div className="selected">
                                    <span>{returnTime}</span>
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                        <path d="M7 10l5 5 5-5z" />
                                    </svg>
                                </div>
                            </div>
                            {isReturnTimeOpen && (
                                <ul className="options">
                                    {hours.map((h) => (
                                        <li key={h} onClick={(e) => {
                                            e.stopPropagation();
                                            onReturnTimeChange(h);
                                            setIsReturnTimeOpen(false);
                                        }}>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Calendar Popup --- */}
            {isCalendarOpen && (
                <div className="calendar-container">
                    <DayPicker
                        mode="range"
                        selected={selectedRange}
                        onSelect={handleDaySelect}
                        numberOfMonths={numMonths}
                        locale={fr}
                        disabled={{ before: new Date() }}
                    />
                </div>
            )}
        </div>
    );
}
