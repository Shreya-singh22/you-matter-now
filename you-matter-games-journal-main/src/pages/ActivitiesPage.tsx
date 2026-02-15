import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gamepad, Dices, Brain, Laugh, Timer, Puzzle, Trophy } from "lucide-react";

const ActivitiesPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-primary mb-4">Fun Activities</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take a mental break with these simple games and activities designed to help you relax and refocus.
        </p>
      </div>

      <Tabs defaultValue="memory" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="memory" className="text-sm md:text-base">
            <Brain className="mr-2 h-4 w-4" />
            Memory Game
          </TabsTrigger>
          <TabsTrigger value="breathe" className="text-sm md:text-base">
            <Timer className="mr-2 h-4 w-4" />
            Breathing Exercise
          </TabsTrigger>
          <TabsTrigger value="riddles" className="text-sm md:text-base">
            <Puzzle className="mr-2 h-4 w-4" />
            Riddles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="memory">
          <MemoryGame />
        </TabsContent>
        
        <TabsContent value="breathe">
          <BreathingExercise />
        </TabsContent>
        
        <TabsContent value="riddles">
          <RiddlesGame />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Memory Card Game
const MemoryGame = () => {
  const icons = ["🌸", "🌟", "🌈", "🐶", "🌵", "🍕", "🎸", "🚀"];
  const allCards = [...icons, ...icons]; // Duplicate icons for pairs
  
  const [cards, setCards] = useState(() => {
    // Shuffle cards initially
    return allCards
      .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
  });
  
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const handleCardClick = (index: number) => {
    // Ignore click if card is already flipped or if two cards are already flipped
    if (cards[index].flipped || cards[index].matched || flippedIndices.length >= 2) return;
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);
    
    // Add to flipped cards
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // If we have two flipped cards, check for a match
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (cards[firstIndex].icon === cards[secondIndex].icon) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].matched = true;
          matchedCards[secondIndex].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedPairs(matchedPairs + 1);
          
          // Check if game is complete
          if (matchedPairs + 1 === icons.length) {
            setGameComplete(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const unflippedCards = [...cards];
          unflippedCards[firstIndex].flipped = false;
          unflippedCards[secondIndex].flipped = false;
          setCards(unflippedCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };
  
  const resetGame = () => {
    setCards(
      allCards
        .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }))
        .sort(() => Math.random() - 0.5)
    );
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameComplete(false);
  };
  
  return (
    <Card className="min-h-[600px]">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Memory Game</span>
          <div className="flex gap-4">
            <Badge variant="outline" className="text-sm">
              Moves: {moves}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Pairs: {matchedPairs}/{icons.length}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Flip cards to find matching pairs. Try to complete the game in as few moves as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gameComplete ? (
          <div className="text-center p-8">
            <Trophy className="mx-auto h-16 w-16 text-brand-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-muted-foreground mb-6">
              You completed the game in {moves} moves!
            </p>
            <Button onClick={resetGame}>Play Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`aspect-square flex items-center justify-center text-3xl md:text-4xl rounded-lg cursor-pointer transition-all duration-500 transform ${
                  card.flipped || card.matched
                    ? "bg-brand-accent text-brand-primary rotate-y-0"
                    : "bg-muted text-muted rotate-y-180"
                } ${card.matched ? "opacity-70" : "hover:opacity-90"}`}
                onClick={() => handleCardClick(index)}
              >
                {card.flipped || card.matched ? card.icon : ""}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-sm text-muted-foreground">
          Playing games can improve focus and reduce stress.
        </p>
        <Button variant="outline" onClick={resetGame}>
          Reset Game
        </Button>
      </CardFooter>
    </Card>
  );
};

// Breathing Exercise
const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const phaseDurations = {
    inhale: 4,  // 4 seconds to inhale
    hold: 4,    // 4 seconds to hold
    exhale: 6   // 6 seconds to exhale
  };

  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhase("inhale");
    setTimeLeft(phaseDurations.inhale);
    setCycleCount(0);
    setTotalTime(0);
    setShowResults(false);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTotalTime(prev => prev + 1);
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;
        
        if (newTimeLeft <= 0) {
          if (currentPhase === "inhale") {
            setCurrentPhase("hold");
            return phaseDurations.hold;
          } else if (currentPhase === "hold") {
            setCurrentPhase("exhale");
            return phaseDurations.exhale;
          } else {
            setCurrentPhase("inhale");
            setCycleCount(prev => prev + 1);
            return phaseDurations.inhale;
          }
        }
        return newTimeLeft;
      });
    }, 1000);
  };
  
  const stopBreathing = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
    setCurrentPhase("inhale");
    setTimeLeft(phaseDurations.inhale);
    setShowResults(true);
  };

  const getProgress = () => {
    const totalDuration = phaseDurations[currentPhase];
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const getInstructions = () => {
    if (currentPhase === "inhale") return `Breathe in... ${timeLeft}`;
    if (currentPhase === "hold") return `Hold... ${timeLeft}`;
    if (currentPhase === "exhale") return `Breathe out... ${timeLeft}`;
    return "";
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {showResults ? (
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-brand-primary mb-4">Great Job!</h2>
          <p className="text-lg mb-4">You've completed {cycleCount} breathing cycles in {formatTime(totalTime)}.</p>
          <div className="bg-calm-blue/20 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Benefits of Your Practice:</h3>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>Reduced stress and anxiety</li>
              <li>Improved focus and concentration</li>
              <li>Better sleep quality</li>
              <li>Enhanced emotional regulation</li>
              <li>Lowered blood pressure</li>
              <li>Increased energy levels</li>
              <li>Improved digestion</li>
              <li>Strengthened immune system</li>
            </ul>
          </div>
          <Button onClick={() => setShowResults(false)}>Start New Session</Button>
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {currentPhase === 'inhale' && 'Inhale'}
                {currentPhase === 'hold' && 'Hold'}
                {currentPhase === 'exhale' && 'Exhale'}
              </h2>
              <p className="text-lg text-muted-foreground">{getInstructions()}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Follow the 4-4-6 pattern: Inhale for 4 seconds, hold for 4 seconds, exhale for 6 seconds
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cycle: {cycleCount}</span>
              <span className="text-sm text-muted-foreground">Time: {formatTime(totalTime)}</span>
            </div>
            
            <div className="relative w-full h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentPhase === "inhale" ? "bg-brand-primary" : 
                    currentPhase === "hold" ? "bg-brand-accent" : 
                    "bg-brand-secondary"
                  }`}
                  style={{
                    transform: `scale(${1 + (getProgress() / 100) * 0.5})`,
                    opacity: 0.8 + (getProgress() / 100) * 0.2
                  }}
                >
                  <span className="text-white text-xl font-semibold">
                    {getInstructions()}
                  </span>
                </div>
              </div>
            </div>
            
            <Progress value={getProgress()} className="w-full" />
            
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button onClick={startBreathing} className="bg-brand-primary hover:bg-brand-primary/90">
                  Start Breathing
                </Button>
              ) : (
                <Button onClick={stopBreathing} variant="destructive">
                  Stop
                </Button>
              )}
            </div>

            <div className="bg-calm-blue/10 p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">How to Practice:</h3>
              <ul className="text-left list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Sit comfortably with your back straight</li>
                <li>Place one hand on your chest and one on your belly</li>
                <li>Breathe in through your nose, letting your belly rise</li>
                <li>Hold your breath at the top of the inhale</li>
                <li>Exhale slowly through your mouth</li>
                <li>Repeat for several cycles</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Riddles Game
const RiddlesGame = () => {
  const riddles = [
    {
      question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "An echo"
    },
    {
      question: "The more you take, the more you leave behind. What am I?",
      answer: "Footsteps"
    },
    {
      question: "What has keys but no locks, space but no room, and you can enter but not go in?",
      answer: "A keyboard"
    },
    {
      question: "I'm light as a feather, but the strongest person can't hold me for more than a few minutes. What am I?",
      answer: "Breath"
    },
    {
      question: "What gets wet while drying?",
      answer: "A towel"
    },
    {
      question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
      answer: "A map"
    },
    {
      question: "What can you break, even if you never pick it up or touch it?",
      answer: "A promise"
    },
    {
      question: "What goes up but never comes down?",
      answer: "Your age"
    }
  ];
  
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  
  const handleNextRiddle = () => {
    const nextIndex = (currentRiddleIndex + 1) % riddles.length;
    setCurrentRiddleIndex(nextIndex);
    setShowAnswer(false);
  };
  
  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleGotItRight = () => {
    setScore(score + 1);
    handleNextRiddle();
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Brain Teasers</CardTitle>
          <Badge variant="outline">Score: {score}</Badge>
        </div>
        <CardDescription>
          Challenge your mind with these fun riddles. See if you can solve them before revealing the answers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 py-4">
          <div className="p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Riddle #{currentRiddleIndex + 1}:</h3>
            <p className="text-xl mb-8">{riddles[currentRiddleIndex].question}</p>
            
            {showAnswer ? (
              <div className="p-4 bg-brand-primary/10 rounded-lg text-center">
                <p className="text-lg font-medium">{riddles[currentRiddleIndex].answer}</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button onClick={handleRevealAnswer}>Reveal Answer</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        {showAnswer ? (
          <>
            <Button variant="outline" onClick={handleNextRiddle} className="flex-1">
              Next Riddle
            </Button>
            <Button onClick={handleGotItRight} className="flex-1">
              I Got It Right!
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={handleNextRiddle} className="w-full">
            Skip This Riddle
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ActivitiesPage;
