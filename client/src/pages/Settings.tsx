import { useState } from 'react';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../components/ui/card';

const Settings = () => {
    const [name, setName] = useState('Student');
    const [dailyGoal, setDailyGoal] = useState(4);

    const handleSave = () => {
        alert('Settings saved! (Local only for now)');
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-zinc-100 italic tracking-tighter">Preferences</h1>
                <p className="text-zinc-400 mt-2 font-medium">Configure your personal study environment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="space-y-1">
                    {[
                        { icon: User, label: 'Profile' },
                        { icon: Bell, label: 'Notifications' },
                        { icon: Palette, label: 'Appearance' },
                        { icon: Shield, label: 'Privacy' }
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${i === 0 ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                            }`}>
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </aside>

                <main className="md:col-span-3 space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardTitle>Profile Details</CardTitle>
                        <CardContent className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Daily Study Goal (Hours)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="12"
                                        value={dailyGoal}
                                        onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                                        className="flex-1 accent-violet-500"
                                    />
                                    <span className="font-black text-xl text-violet-400 w-12 text-center">{dailyGoal}h</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-zinc-100 text-zinc-950 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl"
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800 border-dashed opacity-50">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell size={40} className="text-zinc-700 mb-4" />
                            <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Advanced Features Coming Soon</h3>
                            <p className="text-zinc-600 text-xs mt-2 px-12">
                                Email notification triggers and theme customization are being prepared for the next release.
                            </p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default Settings;
