import { useState, useEffect } from 'react';
import {
    format,
    startOfWeek,
    addDays,
    isSameDay,
    parseISO
} from 'date-fns';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Clock,
    BookOpen,
    X,
    CheckCircle2,
    Circle
} from 'lucide-react';

interface StudySession {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    isCompleted: boolean;
    resourceId?: string;
    resource?: {
        id: string;
        title: string;
        type: string;
    };
}

interface Resource {
    id: string;
    title: string;
}

const API_URL = 'http://localhost:4000';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<StudySession | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '11:00',
        resourceId: ''
    });

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 07:00 to 22:00
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        try {
            const [sessionsRes, resourcesRes] = await Promise.all([
                fetch(`${API_URL}/sessions`),
                fetch(`${API_URL}/resources`)
            ]);
            setSessions(await sessionsRes.json());
            setResources(await resourcesRes.json());
        } catch (error) {
            console.error('Failed to fetch calendar data', error);
        }
    };

    const handleOpenModal = (day?: Date, hour?: number) => {
        if (day && hour !== undefined) {
            setFormData({
                ...formData,
                date: format(day, 'yyyy-MM-dd'),
                startTime: `${hour.toString().padStart(2, '0')}:00`,
                endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSession(null);
        setFormData({
            title: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            startTime: '09:00',
            endTime: '11:00',
            resourceId: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const startStr = `${formData.date}T${formData.startTime}:00`;
        const endStr = `${formData.date}T${formData.endTime}:00`;

        const payload = {
            title: formData.title,
            startTime: parseISO(startStr).toISOString(),
            endTime: parseISO(endStr).toISOString(),
            resourceId: formData.resourceId || null
        };

        try {
            if (editingSession) {
                await fetch(`${API_URL}/sessions/${editingSession.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch(`${API_URL}/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Failed to save session', error);
        }
    };

    const handleToggleComplete = async (session: StudySession) => {
        try {
            await fetch(`${API_URL}/sessions/${session.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: !session.isCompleted })
            });
            fetchData();
        } catch (error) {
            console.error('Failed to toggle status', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this session?')) return;
        try {
            await fetch(`${API_URL}/sessions/${id}`, { method: 'DELETE' });
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Failed to delete session', error);
        }
    };

    const renderSession = (session: StudySession) => {
        const start = parseISO(session.startTime);
        const end = parseISO(session.endTime);
        const startHour = start.getHours();
        const startMin = start.getMinutes();
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        // Calculate position: grid starts at 07:00
        const top = (startHour - 7) * 64 + (startMin / 60) * 64;
        const height = durationHours * 64;

        return (
            <div
                key={session.id}
                onClick={(e) => {
                    e.stopPropagation();
                    setEditingSession(session);
                    setFormData({
                        title: session.title,
                        date: format(start, 'yyyy-MM-dd'),
                        startTime: format(start, 'HH:mm'),
                        endTime: format(end, 'HH:mm'),
                        resourceId: session.resourceId || ''
                    });
                    setIsModalOpen(true);
                }}
                className={`absolute inset-x-1 rounded-lg p-2 text-xs border cursor-pointer transition-all hover:scale-[1.02] shadow-sm z-10 ${session.isCompleted
                        ? 'bg-zinc-800/80 border-zinc-700 opacity-60'
                        : 'bg-violet-600/20 border-violet-500/50 text-violet-100'
                    }`}
                style={{ top: `${top}px`, height: `${height}px` }}
            >
                <div className="font-bold flex justify-between items-start">
                    <span className="truncate pr-4">{session.title}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(session);
                        }}
                        className="text-zinc-400 hover:text-violet-400"
                    >
                        {session.isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    </button>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                    <Clock size={10} />
                    {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Study Calendar</h1>
                    <p className="text-zinc-400 mt-1">Plan and manage your study blocks</p>
                </div>
                <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, -7))}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-medium px-2 min-w-[140px] text-center">
                        {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                    </span>
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, 7))}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg shadow-violet-600/20"
                >
                    <Plus size={20} />
                    Add Session
                </button>
            </div>

            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
                {/* Day Headers */}
                <div className="flex border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-20">
                    <div className="w-16 border-r border-zinc-800 shrink-0" />
                    {days.map(day => (
                        <div key={day.toString()} className="flex-1 p-3 text-center border-r border-zinc-800 last:border-r-0">
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">{format(day, 'EEE')}</div>
                            <div className={`mt-1 text-lg font-bold w-10 h-10 flex items-center justify-center mx-auto rounded-full ${isSameDay(day, new Date()) ? 'bg-violet-600 text-white' : 'text-zinc-100'
                                }`}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hour Grid */}
                <div className="flex-1 overflow-auto relative custom-scrollbar">
                    <div className="flex">
                        {/* Time labels */}
                        <div className="w-16 shrink-0 bg-zinc-900/30">
                            {hours.map(hour => (
                                <div key={hour} className="h-16 text-[10px] text-zinc-500 pr-2 text-right pt-2 border-b border-zinc-800/10 last:border-b-0">
                                    {hour.toString().padStart(2, '0')}:00
                                </div>
                            ))}
                        </div>

                        {/* Grid Columns */}
                        {days.map(day => (
                            <div key={day.toString()} className="flex-1 border-r border-zinc-800 last:border-r-0 relative">
                                {hours.map(hour => (
                                    <div
                                        key={hour}
                                        onClick={() => handleOpenModal(day, hour)}
                                        className="h-16 border-b border-zinc-800/30 group hover:bg-violet-600/5 transition-colors cursor-crosshair"
                                    >
                                        <div className="hidden group-hover:flex items-center justify-center h-full text-violet-500/50">
                                            <Plus size={16} />
                                        </div>
                                    </div>
                                ))}

                                {/* Study Blocks */}
                                {sessions
                                    .filter(s => isSameDay(parseISO(s.startTime), day))
                                    .map(s => renderSession(s))
                                }
                            </div>
                        ))}
                    </div>

                    {/* Current Time Indicator */}
                    {days.some(d => isSameDay(d, new Date())) && (
                        <div
                            className="absolute left-16 right-0 border-t-2 border-red-500/50 z-30 pointer-events-none"
                            style={{ top: `${(new Date().getHours() - 7) * 64 + (new Date().getMinutes() / 60) * 64}px` }}
                        >
                            <div className="w-2 h-2 bg-red-500 rounded-full -mt-[5px] -ml-1" />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                                <BookOpen className="text-violet-500" />
                                {editingSession ? 'Edit Study Session' : 'New Study Session'}
                            </h2>
                            <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Session Title</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                                    placeholder="What are you studying?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Resource (Optional)</label>
                                    <select
                                        value={formData.resourceId}
                                        onChange={e => setFormData({ ...formData, resourceId: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none"
                                    >
                                        <option value="">No linked resource</option>
                                        {resources.map(r => (
                                            <option key={r.id} value={r.id}>{r.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                {editingSession && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(editingSession.id)}
                                        className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-bold"
                                    >
                                        Delete
                                    </button>
                                )}
                                <div className="flex-1 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 px-8 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all font-bold shadow-lg shadow-violet-600/30"
                                    >
                                        {editingSession ? 'Update' : 'Schedule'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
