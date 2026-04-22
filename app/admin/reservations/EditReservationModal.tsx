'use client';

import { useState, useRef, useEffect } from 'react';
import { Location, Reservation } from '@prisma/client';
import { updateReservationDetails } from '../../actions/updateReservationDetails';
import { format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface VehicleWithReservations {
    id: number;
    plaque: string;
    modele: { nom: string };
    reservations: {
        id: number;
        dateDebut: Date;
        dateFin: Date;
        status: string;
        clientNom: string;
        clientPrenom: string;
    }[];
}

interface EditReservationModalProps {
    reservation: Reservation;
    locations: Location[];
    vehicles: VehicleWithReservations[];
}

export function EditReservationModal({ reservation, locations, vehicles }: EditReservationModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [lieuPriseEnChargeId, setLieuPriseEnChargeId] = useState<number | null>(reservation.lieuPriseEnChargeId);
    const [lieuRetourId, setLieuRetourId] = useState<number | null>(reservation.lieuRetourId);
    const [customPriseEnCharge, setCustomPriseEnCharge] = useState((reservation as any).customPriseEnCharge);
    const [customRetour, setCustomRetour] = useState((reservation as any).customRetour);
    const [prixTotal, setPrixTotal] = useState(reservation.prixTotal);
    const [note, setNote] = useState((reservation as any).note);
    const [vehiculeId, setVehiculeId] = useState(reservation.vehiculeId);
    const [conflict, setConflict] = useState<any>(null);

    // Date Picker State  - Strictly mirrored from ReservationForm
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
        from: new Date(reservation.dateDebut),
        to: new Date(reservation.dateFin),
    });
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
    const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

    // Time State
    const timeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00"
    ];
    const [startTime, setStartTime] = useState(format(new Date(reservation.dateDebut), 'HH:mm'));
    const [returnTime, setReturnTime] = useState(format(new Date(reservation.dateFin), 'HH:mm'));
    const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
    const [isReturnTimeOpen, setIsReturnTimeOpen] = useState(false);

    // Refs
    const calendarRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<HTMLDivElement>(null);
    const returnTimeRef = useRef<HTMLDivElement>(null);

    // Click Outside Hook
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
                setIsStartCalendarOpen(false);
                setIsEndCalendarOpen(false);
            }
            if (startTimeRef.current && !startTimeRef.current.contains(event.target as Node)) {
                setIsStartTimeOpen(false);
            }
            if (returnTimeRef.current && !returnTimeRef.current.contains(event.target as Node)) {
                setIsReturnTimeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Conflict Detection Logic
    useEffect(() => {
        if (!selectedRange?.from || !selectedRange?.to || !vehiculeId) {
            setConflict(null);
            return;
        }

        const dateDebutObj = new Date(selectedRange.from);
        const [startHour, startMinute] = startTime.split(':');
        dateDebutObj.setHours(parseInt(startHour), parseInt(startMinute));

        const dateFinObj = new Date(selectedRange.to);
        const [endHour, endMinute] = returnTime.split(':');
        dateFinObj.setHours(parseInt(endHour), parseInt(endMinute));

        const selectedVehicle = vehicles.find(v => v.id === vehiculeId);
        if (!selectedVehicle) return;

        const conflictingRes = selectedVehicle.reservations.find(res => {
            // Ignore current reservation
            if (res.id === reservation.id) return false;
            // Ignore cancelled/expired
            if (['CANCELLED', 'REJECTED', 'EXPIRED'].includes(res.status)) return false;

            const resStart = new Date(res.dateDebut);
            const resEnd = new Date(res.dateFin);

            // Overlap check: (StartA < EndB) && (EndA > StartB)
            return (resStart < dateFinObj) && (resEnd > dateDebutObj);
        });

        setConflict(conflictingRes || null);

    }, [vehiculeId, selectedRange, startTime, returnTime, vehicles, reservation.id]);


    const handleStartTimeSelect = (hour: string) => {
        setStartTime(hour);
        setIsStartTimeOpen(false);
    };

    const handleReturnTimeSelect = (hour: string) => {
        setReturnTime(hour);
        setIsReturnTimeOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!selectedRange?.from || !selectedRange?.to) {
            alert('Veuillez sélectionner une plage de dates.');
            setIsLoading(false);
            return;
        }

        const dateDebutObj = new Date(selectedRange.from);
        const [startHour, startMinute] = startTime.split(':');
        dateDebutObj.setHours(parseInt(startHour), parseInt(startMinute));

        const dateFinObj = new Date(selectedRange.to);
        const [endHour, endMinute] = returnTime.split(':');
        dateFinObj.setHours(parseInt(endHour), parseInt(endMinute));

        const result = await updateReservationDetails(reservation.id, {
            dateDebut: dateDebutObj,
            dateFin: dateFinObj,
            lieuPriseEnChargeId: lieuPriseEnChargeId ? Number(lieuPriseEnChargeId) : null,
            lieuRetourId: lieuRetourId ? Number(lieuRetourId) : null,
            customPriseEnCharge: customPriseEnCharge,
            customRetour: customRetour,
            prixTotal: Number(prixTotal),
            note: note,
            vehiculeId: Number(vehiculeId),
        });

        setIsLoading(false);
        if (result.success) {
            setIsOpen(false);
        } else {
            alert(result.error || 'Erreur lors de la mise à jour');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="btn-secondary btn-edit-reservation"
            >
                Modifier
            </button>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <h3 className="modal-title">Modifier la Réservation #{reservation.id}</h3>

                <form onSubmit={handleSubmit}>

                    {/* Conflict Warning Block */}
                    {conflict && (
                        <div className={`conflict-warning ${conflict.status === 'PENDING' ? 'pending' : 'confirmed'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="conflict-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="conflict-content">
                                <p className="conflict-title">
                                    {conflict.status === 'PENDING' ? 'Attention : Véhicule déjà demandé !' : 'Attention : Chevauchement confirmé !'}
                                </p>
                                <p className="conflict-text">
                                    {conflict.status === 'PENDING' ? (
                                        <>Ce véhicule est demandé par <strong>{conflict.clientPrenom} {conflict.clientNom}</strong> (En attente)</>
                                    ) : (
                                        <>Ce véhicule est déjà réservé par <strong>{conflict.clientPrenom} {conflict.clientNom}</strong></>
                                    )}
                                    <br />
                                    du {format(new Date(conflict.dateDebut), 'dd/MM/yyyy HH:mm')} au {format(new Date(conflict.dateFin), 'dd/MM/yyyy HH:mm')}.
                                </p>
                                <p className="conflict-note">
                                    Vous pouvez valider pour forcer l'attribution, ou choisir un autre véhicule.
                                </p>
                            </div>
                        </div>
                    )}


                    <div className="form-group">
                        <label className="modal-label">Véhicule assigné</label>
                        <select
                            value={vehiculeId}
                            onChange={(e) => setVehiculeId(Number(e.target.value))}
                            required
                        >
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.modele.nom} - {v.plaque}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* CUSTOM DATE PICKER - Structure exacte de ReservationForm */}
                    <div className="reservations admin-override">
                        <div className="dates-validation-container">
                            <div className="dates-container" ref={calendarRef}>

                                {/* Start Date/Time */}
                                <div className="start-date-container">
                                    <span>Date et heure de départ</span>
                                    <div className="button-start">
                                        <button
                                            type="button"
                                            className={`choose-date ${isStartCalendarOpen ? 'open' : ''}`}
                                            onClick={() => {
                                                setIsCalendarOpen(true);
                                                setIsStartCalendarOpen(true);
                                                setIsEndCalendarOpen(false);
                                            }}
                                        >
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>
                                                {selectedRange?.from ? format(selectedRange.from, 'dd/MM/yyyy') : ''}
                                            </span>
                                        </button>

                                        <div
                                            className={`choose-hour ${isStartTimeOpen ? 'open' : ''}`}
                                            ref={startTimeRef}
                                            onClick={() => {
                                                setIsStartTimeOpen(!isStartTimeOpen);
                                                setIsCalendarOpen(false);
                                                setIsStartCalendarOpen(false);
                                                setIsEndCalendarOpen(false);
                                            }}
                                        >
                                            <div className="choose-hour-select">
                                                <div className="selected">
                                                    <span>{startTime}</span>
                                                    <i className="fas fa-chevron-down" style={{ marginLeft: '5px', fontSize: '0.7rem' }}></i>
                                                </div>
                                            </div>
                                            {isStartTimeOpen && (
                                                <ul className="options">
                                                    {timeSlots.map((hour) => (
                                                        <li key={hour} onClick={(e) => { e.stopPropagation(); handleStartTimeSelect(hour); }}>
                                                            {hour}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* End Date/Time */}
                                <div className="end-date-container">
                                    <span>Date et heure de retour</span>
                                    <div className="button-end">
                                        <button
                                            type="button"
                                            className={`choose-date ${isEndCalendarOpen ? 'open' : ''}`}
                                            onClick={() => {
                                                setIsCalendarOpen(true);
                                                setIsEndCalendarOpen(true);
                                                setIsStartCalendarOpen(false);
                                            }}
                                        >
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>
                                                {selectedRange?.to ? format(selectedRange.to, 'dd/MM/yyyy') : ''}
                                            </span>
                                        </button>

                                        <div
                                            className={`choose-hour return-hour ${isReturnTimeOpen ? 'open' : ''}`}
                                            ref={returnTimeRef}
                                            onClick={() => {
                                                setIsReturnTimeOpen(!isReturnTimeOpen);
                                                setIsCalendarOpen(false);
                                                setIsStartCalendarOpen(false);
                                                setIsEndCalendarOpen(false);
                                            }}
                                        >
                                            <div className="choose-hour-select">
                                                <div className="selected">
                                                    <span>{returnTime}</span>
                                                    <i className="fas fa-chevron-down" style={{ marginLeft: '5px', fontSize: '0.7rem' }}></i>
                                                </div>
                                            </div>
                                            {isReturnTimeOpen && (
                                                <ul className="options">
                                                    {timeSlots.map((hour) => (
                                                        <li key={hour} onClick={(e) => { e.stopPropagation(); handleReturnTimeSelect(hour); }}>
                                                            {hour}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* The Calendar */}
                                {isCalendarOpen && (
                                    <div className="calendar-container">
                                        <DayPicker
                                            mode="range"
                                            selected={selectedRange}
                                            onSelect={(range, selectedDay) => {
                                                if (isStartCalendarOpen) {
                                                    setSelectedRange({ from: selectedDay, to: undefined });

                                                    setIsStartCalendarOpen(false);
                                                    setIsEndCalendarOpen(true);
                                                    setIsCalendarOpen(true);
                                                } else {
                                                    setSelectedRange(range);
                                                    if (range?.from && range?.to) {
                                                        setIsCalendarOpen(false);
                                                        setIsStartCalendarOpen(false);
                                                        setIsEndCalendarOpen(false);
                                                    }
                                                }
                                            }}
                                            numberOfMonths={2}
                                            locale={fr}
                                            disabled={{ before: new Date() }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group mt-20 location-column">
                        <label className="modal-label">Lieu de Départ</label>
                        <select
                            value={lieuPriseEnChargeId ? String(lieuPriseEnChargeId) : (customPriseEnCharge !== null && customPriseEnCharge !== undefined ? 'custom' : '')}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') {
                                    setLieuPriseEnChargeId(null);
                                    setCustomPriseEnCharge(null);
                                } else if (val === 'custom') {
                                    setLieuPriseEnChargeId(null);
                                    setCustomPriseEnCharge('');
                                } else {
                                    setLieuPriseEnChargeId(Number(val));
                                    setCustomPriseEnCharge(null);
                                }
                            }}
                            required={!customPriseEnCharge && customPriseEnCharge !== ''}
                        >
                            <option value="">Sélectionner un lieu</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.nom}</option>
                            ))}
                            <option value="custom" style={{ fontWeight: 'bold' }}>📍 Adresse personnalisée</option>
                        </select>
                        {customPriseEnCharge !== null && customPriseEnCharge !== undefined && (
                            <input
                                type="text"
                                className="mt-2 text-sm text-gray-600 w-full p-2 border rounded"
                                value={customPriseEnCharge}
                                onChange={(e) => setCustomPriseEnCharge(e.target.value)}
                                placeholder="Adresse personnalisée"
                                autoFocus
                            />
                        )}
                    </div>

                    <div className="form-group location-column">
                        <label className="modal-label">Lieu de Retour</label>
                        <select
                            value={lieuRetourId ? String(lieuRetourId) : (customRetour !== null && customRetour !== undefined ? 'custom' : '')}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') {
                                    setLieuRetourId(null);
                                    setCustomRetour(null);
                                } else if (val === 'custom') {
                                    setLieuRetourId(null);
                                    setCustomRetour('');
                                } else {
                                    setLieuRetourId(Number(val));
                                    setCustomRetour(null);
                                }
                            }}
                            required={!customRetour && customRetour !== ''}
                        >
                            <option value="">Sélectionner un lieu</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.nom}</option>
                            ))}
                            <option value="custom" style={{ fontWeight: 'bold' }}>📍 Adresse personnalisée</option>
                        </select>
                        {customRetour !== null && customRetour !== undefined && (
                            <input
                                type="text"
                                className="mt-2 text-sm text-gray-600 w-full p-2 border rounded"
                                value={customRetour}
                                onChange={(e) => setCustomRetour(e.target.value)}
                                placeholder="Adresse personnalisée"
                                autoFocus
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label className="modal-label">Prix Total (MAD)</label>
                        <input
                            type="number"
                            value={prixTotal}
                            onChange={(e) => setPrixTotal(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="modal-label">Note</label>
                        <textarea
                            value={note || ''}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="btn-secondary"
                        >
                            Abandonner
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn-primary ${conflict ? 'btn-danger' : ''}`}
                        >
                            {isLoading ? 'Enregistrement...' : (conflict ? 'Forcer la validation' : 'Valider')}
                        </button>
                    </div>
                </form >
            </div >
        </div >
    );
}
