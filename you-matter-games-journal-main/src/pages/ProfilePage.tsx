import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Book, MessageCircle, Heart, TrendingUp, Calendar, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
    email: string;
    id: number;
}

interface JournalEntry {
    id: number;
    mood: string;
    date: string;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, journalRes] = await Promise.all([
                    api.get("/auth/me"),
                    api.get("/journal/")
                ]);
                setUser(userRes.data);
                setEntries(journalRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
                localStorage.removeItem("token");
                navigate("/signin");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast({
            title: "Logged out",
            description: "See you next time!",
        });
        navigate("/signin");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    // Calculate stats
    const totalEntries = entries.length;
    const recentEntry = entries[0]; // Assuming sorted by date descending from backend or we could sort here
    // Sort entries by date desc if needed
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastCheckIn = sortedEntries.length > 0 ? format(new Date(sortedEntries[0].date), "MMM d, yyyy") : "No entries yet";

    // Simple mood distribution
    const moodCounts: Record<string, number> = {};
    entries.forEach(e => {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Hero / Welcome Section */}
            <div className="bg-brand-primary/10 py-12 mb-8">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                            <p className="text-muted-foreground text-lg">
                                {user?.email}
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 space-y-8">
                {/* Progress Stats */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-brand-primary" /> Your Mental Progress
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Journal Entries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-brand-primary">{totalEntries}</div>
                                <p className="text-xs text-muted-foreground mt-1">Keep reflecting!</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Last Check-in</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{lastCheckIn}</div>
                                <p className="text-xs text-muted-foreground mt-1">Consistency is key.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Dominant Mood</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-brand-secondary">{dominantMood}</div>
                                <p className="text-xs text-muted-foreground mt-1">Based on your logs.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Quick Actions */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Heart className="h-6 w-6 text-brand-primary" /> How do you feel right now?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/journal">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Book className="h-5 w-5 text-brand-primary" /> Write in Journal
                                    </CardTitle>
                                    <CardDescription>
                                        Express your thoughts and clear your mind.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>

                        <Link to="/chatbot">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5 text-brand-primary" /> Chat with SoulSync
                                    </CardTitle>
                                    <CardDescription>
                                        Talk to our AI companion for immediate support.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
