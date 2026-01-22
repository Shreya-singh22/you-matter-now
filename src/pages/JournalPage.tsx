
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { CalendarIcon, Book, PenLine, ListTodo, Save, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

type JournalEntry = {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: string;
  gratitude: string[];
};

// Demo journal entries
const demoEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date(2025, 3, 15),
    title: "Finding Balance",
    content: "Today was challenging but I managed to take breaks when needed. I felt overwhelmed in the morning but practiced deep breathing which helped a lot.",
    mood: "Neutral",
    gratitude: ["My morning coffee", "A supportive text from a friend", "Finding time to read"]
  },
  {
    id: "2",
    date: new Date(2025, 3, 14),
    title: "Small Victories",
    content: "I completed the presentation I was dreading. It wasn't perfect but I'm proud I pushed through. Need to remember this feeling next time I procrastinate.",
    mood: "Happy",
    gratitude: ["Finishing my project", "Sunny weather", "A good night's sleep"]
  }
];

const moodOptions = [
  "Happy", "Content", "Neutral", "Anxious", "Sad", "Excited", "Tired", "Frustrated"
];

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(demoEntries);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("Neutral");
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);
  const [newGratitudeItem, setNewGratitudeItem] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const resetForm = () => {
    setNewEntryTitle("");
    setNewEntryContent("");
    setSelectedMood("Neutral");
    setGratitudeItems([]);
    setNewGratitudeItem("");
    setIsEditMode(false);
    setSelectedEntry(null);
  };
  
  const handleSaveEntry = () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim()) {
      toast({
        title: "Please complete your entry",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }
    
    if (isEditMode && selectedEntry) {
      // Edit existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === selectedEntry.id 
          ? {
              ...entry,
              title: newEntryTitle,
              content: newEntryContent,
              mood: selectedMood,
              gratitude: [...gratitudeItems]
            }
          : entry
      );
      setEntries(updatedEntries);
      toast({
        title: "Entry updated",
        description: "Your journal entry has been updated successfully.",
      });
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        title: newEntryTitle,
        content: newEntryContent,
        mood: selectedMood,
        gratitude: [...gratitudeItems]
      };
      setEntries([newEntry, ...entries]);
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      });
    }
    
    resetForm();
  };
  
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    resetForm();
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
    });
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setNewEntryTitle(entry.title);
    setNewEntryContent(entry.content);
    setSelectedMood(entry.mood);
    setGratitudeItems([...entry.gratitude]);
    setSelectedDate(entry.date);
    setIsEditMode(true);
  };
  
  const handleAddGratitudeItem = () => {
    if (newGratitudeItem.trim() && gratitudeItems.length < 3) {
      setGratitudeItems([...gratitudeItems, newGratitudeItem.trim()]);
      setNewGratitudeItem("");
    }
  };
  
  const handleRemoveGratitudeItem = (index: number) => {
    const newItems = [...gratitudeItems];
    newItems.splice(index, 1);
    setGratitudeItems(newItems);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-primary mb-4">Your Journal</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Write freely, reflect on your experiences, and track your growth over time.
          Your entries are private and safe.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="write">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="write" className="text-sm md:text-base">
                <PenLine className="mr-2 h-4 w-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="entries" className="text-sm md:text-base">
                <Book className="mr-2 h-4 w-4" />
                Past Entries
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="write">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditMode ? "Edit Entry" : "New Entry"}</CardTitle>
                  <CardDescription>
                    {isEditMode 
                      ? "Update your journal entry below." 
                      : "Write whatever is on your mind. No judgments here."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[280px] justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Mood:</span>
                          <select
                            value={selectedMood}
                            onChange={(e) => setSelectedMood(e.target.value)}
                            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                          >
                            {moodOptions.map((mood) => (
                              <option key={mood} value={mood}>
                                {mood}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Input
                      placeholder="Entry title"
                      value={newEntryTitle}
                      onChange={(e) => setNewEntryTitle(e.target.value)}
                      className="mt-4"
                    />
                    
                    <Textarea
                      placeholder="Write your thoughts here..."
                      value={newEntryContent}
                      onChange={(e) => setNewEntryContent(e.target.value)}
                      className="min-h-[200px] mt-2"
                    />
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium">Gratitude (up to 3 items):</label>
                      <div className="flex mt-1">
                        <Input
                          placeholder="I'm grateful for..."
                          value={newGratitudeItem}
                          onChange={(e) => setNewGratitudeItem(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddGratitudeItem();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleAddGratitudeItem} 
                          variant="secondary"
                          disabled={!newGratitudeItem.trim() || gratitudeItems.length >= 3}
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {gratitudeItems.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {gratitudeItems.map((item, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                              {item}
                              <button 
                                onClick={() => handleRemoveGratitudeItem(index)}
                                className="ml-2 text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    onClick={handleSaveEntry}
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Entry" : "Save Entry"}
                  </Button>
                  {isEditMode && (
                    <Button 
                      variant="outline" 
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="entries">
              {entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <Card key={entry.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{entry.title}</CardTitle>
                            <CardDescription>
                              {format(entry.date, "MMMM d, yyyy")} • Feeling: {entry.mood}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditEntry(entry)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{entry.content}</p>
                        
                        {entry.gratitude.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Grateful for:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.gratitude.map((item, index) => (
                                <Badge key={index} variant="outline">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <Book className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No entries yet</h3>
                  <p className="text-muted-foreground">
                    Your journal entries will appear here once you start writing.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal Prompts</CardTitle>
              <CardDescription>
                Need inspiration? Try one of these prompts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "What made you smile today?",
                  "What's something you're looking forward to?",
                  "Describe a challenge you overcame recently.",
                  "What are three things you appreciate about yourself?",
                  "How would you describe your current emotional state?",
                  "What is one thing you could do tomorrow to take care of yourself?"
                ].map((prompt, i) => (
                  <div 
                    key={i}
                    className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setNewEntryContent(prev => 
                        prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`
                      );
                    }}
                  >
                    <p className="text-sm">{prompt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Journal Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Reduces stress and anxiety",
                  "Helps process difficult emotions",
                  "Increases self-awareness",
                  "Improves memory and cognitive function",
                  "Promotes gratitude and positivity"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-brand-primary mt-2" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
