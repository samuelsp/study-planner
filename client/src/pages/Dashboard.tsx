import { useState, useEffect } from 'react';
import { ChevronRight, Clock, Target, Flame } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { format, isToday, parseISO, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

interface StudySession {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    isCompleted: boolean;
    resource?: {
        type: string;
    };
}

const API_URL = 'http://localhost:4000';

const Dashboard = () => {
    const [sessions, setSessions] = useState<StudySession[]>([]);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch(`${API_URL}/sessions`);
            const data = await res.json();
            setSessions(data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    const todaySessions = sessions.filter(s => isToday(parseISO(s.startTime)));
    const completedToday = todaySessions.filter(s => s.isCompleted);

    const totalMinutesToday = todaySessions.reduce((acc, s) => {
        const start = parseISO(s.startTime);
        const end = parseISO(s.endTime);
        return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    const completedMinutesToday = completedToday.reduce((acc, s) => {
        const start = parseISO(s.startTime);
        const end = parseISO(s.endTime);
        return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const completedThisWeek = sessions.filter(s =>
        s.isCompleted &&
        isWithinInterval(parseISO(s.startTime), { start: weekStart, end: weekEnd })
    ).length;

    const upcomingSessions = todaySessions
        .filter(s => !s.isCompleted && parseISO(s.startTime) > new Date())
        .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());

    const formatStudyTime = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = Math.round(mins % 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-zinc-100 tracking-tight">Focus Dashboard</h1>
                    <p className="text-zinc-400 mt-2 font-medium">
                        {format(new Date(), 'EEEE, MMMM do')}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Efficiency</span>
                    <div className="text-2xl font-black text-violet-400">
                        {todaySessions.length > 0
                            ? Math.round((completedToday.length / todaySessions.length) * 100)
                            : 0}%
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={80} />
                    </div>
                    <CardTitle className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-xs tracking-wider">
                        <Clock size={14} className="text-violet-500" /> Today's Focus
                    </CardTitle>
                    <CardContent className="mt-4">
                        <div className="text-4xl font-black text-zinc-100">{formatStudyTime(completedMinutesToday)}</div>
                        <p className="text-sm text-zinc-500 mt-1">of {formatStudyTime(totalMinutesToday)} scheduled</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={80} />
                    </div>
                    <CardTitle className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-xs tracking-wider">
                        <Target size={14} className="text-emerald-500" /> This Week
                    </CardTitle>
                    <CardContent className="mt-4">
                        <div className="text-4xl font-black text-zinc-100">{completedThisWeek}</div>
                        <p className="text-sm text-zinc-500 mt-1">sessions completed</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Flame size={80} />
                    </div>
                    <CardTitle className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-xs tracking-wider">
                        <Flame size={14} className="text-amber-500" /> Study Streak
                    </CardTitle>
                    <CardContent className="mt-4">
                        <div className="text-4xl font-black text-zinc-100">--</div>
                        <p className="text-sm text-zinc-500 mt-1">consistency is key</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Schedule Mini */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                            Next Up
                        </h2>
                        <button className="text-violet-400 text-sm font-bold hover:text-violet-300 transition-colors flex items-center uppercase tracking-wider">
                            Calendar <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 space-y-2">
                        {upcomingSessions.length > 0 ? upcomingSessions.slice(0, 3).map(session => (
                            <div key={session.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700 group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-1 h-10 bg-violet-500 rounded-full group-hover:h-12 transition-all"></div>
                                    <div>
                                        <h3 className="font-bold text-zinc-100 group-hover:text-violet-400 transition-colors">{session.title}</h3>
                                        <p className="text-xs text-zinc-500 font-medium">
                                            {format(parseISO(session.startTime), 'HH:mm')} - {format(parseISO(session.endTime), 'HH:mm')}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-violet-500/10 text-violet-400 text-[10px] rounded-full font-black uppercase tracking-widest border border-violet-500/20">
                                    Ready
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-zinc-600 font-medium italic">
                                No upcoming sessions for today.
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Tips or Meta */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-zinc-100">Deep Work Tip</h2>
                    <Card className="bg-violet-600/10 border-violet-500/20 p-8">
                        <CardContent className="p-0">
                            <p className="text-violet-200 text-lg font-medium leading-relaxed italic">
                                "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy."
                            </p>
                            <footer className="mt-4 text-violet-400 font-bold uppercase tracking-widest text-xs">— Cal Newport</footer>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
