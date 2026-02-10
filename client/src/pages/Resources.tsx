import { useState, useEffect } from 'react';
import { Plus, Book, Video, Link as LinkIcon, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

interface Resource {
    id: string;
    title: string;
    type: 'BOOK' | 'VIDEO' | 'COURSE';
    url?: string;
    totalUnits?: number;
    completedUnits: number;
}

const Resources = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'BOOK',
        url: '',
        totalUnits: ''
    });

    const API_URL = 'http://localhost:4000';

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await fetch(`${API_URL}/resources`);
            const data = await res.json();
            setResources(data);
        } catch (error) {
            console.error('Failed to fetch resources', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/resources`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            setFormData({ title: '', type: 'BOOK', url: '', totalUnits: '' });
            fetchResources();
        } catch (error) {
            console.error('Failed to create resource', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            await fetch(`${API_URL}/resources/${id}`, { method: 'DELETE' });
            fetchResources();
        } catch (error) {
            console.error('Failed to delete resource', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'BOOK': return <Book size={20} className="text-violet-400" />;
            case 'VIDEO': return <Video size={20} className="text-emerald-400" />;
            case 'COURSE': return <LinkIcon size={20} className="text-blue-400" />;
            default: return <Book size={20} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Study Resources</h1>
                    <p className="text-zinc-400 mt-2">Manage your learning materials</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Resource
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <Card key={resource.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group relative">
                        <button
                            onClick={() => handleDelete(resource.id)}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                                    {getIcon(resource.type)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-100">{resource.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
                                            {resource.type}
                                        </span>
                                        {resource.url && (
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-zinc-500 hover:text-violet-400"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between text-sm text-zinc-500 mb-2">
                                    <span>Progress</span>
                                    <span>{resource.completedUnits} / {resource.totalUnits || '?'} {resource.type === 'BOOK' ? 'Ch' : 'Units'}</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-violet-600 rounded-full transition-all"
                                        style={{ width: `${resource.totalUnits ? (resource.completedUnits / resource.totalUnits) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {resources.length === 0 && (
                    <div className="col-span-full py-12 text-center border border-dashed border-zinc-800 rounded-xl">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                            <Book size={32} />
                        </div>
                        <h3 className="text-zinc-400 font-medium">No resources yet</h3>
                        <p className="text-zinc-600 text-sm mt-1">Add your first book, course, or video list.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-zinc-100 mb-6">Add New Resource</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                                    placeholder="e.g., Clean Code"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                                >
                                    <option value="BOOK">Book</option>
                                    <option value="VIDEO">Video / Playlist</option>
                                    <option value="COURSE">Course</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Link (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Total Units (Chapters/Videos)</label>
                                <input
                                    type="number"
                                    value={formData.totalUnits}
                                    onChange={e => setFormData({ ...formData, totalUnits: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                                    placeholder="e.g., 12"
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors font-medium"
                                >
                                    Add Resource
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resources;
