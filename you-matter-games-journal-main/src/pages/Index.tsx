import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Youtube, Book, Gamepad, ArrowRight, UserSearch } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-purple-light to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1920" 
            alt="Peaceful meditation scene" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-brand-primary">
              Your Mental Health Matters Now
            </h1>
            <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
              Take the first step towards wellbeing with resources, support, and tools designed to help you feel better every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button asChild size="lg">
                <Link to="/help">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/info">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" 
                  alt="Educational resources - Group learning session" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-2">
                <Youtube className="h-5 w-5 text-brand-primary" />
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Curated videos and resources to help you understand mental health better.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="text-brand-primary gap-1">
                  <Link to="/info">
                    Explore Videos <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400" 
                  alt="Help and support - Supportive conversation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-2">
                <HelpCircle className="h-5 w-5 text-brand-primary" />
                <CardTitle>Help Center</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Take assessments, read FAQs, and find resources for immediate help.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="text-brand-primary gap-1">
                  <Link to="/help">
                    Get Help <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=400" 
                  alt="Journal writing - Person writing in journal" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-2">
                <Book className="h-5 w-5 text-brand-primary" />
                <CardTitle>Journal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Record your thoughts, track your moods, and practice gratitude daily.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="text-brand-primary gap-1">
                  <Link to="/journal">
                    Start Writing <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400" 
                  alt="Mindfulness activities - Peaceful meditation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-2">
                <Gamepad className="h-5 w-5 text-brand-primary" />
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fun games and mindfulness activities to help you relax and destress.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="text-brand-primary gap-1">
                  <Link to="/activities">
                    Play Games <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400" 
                  alt="Therapist consultation - Professional counseling session" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-2">
                <UserSearch className="h-5 w-5 text-brand-primary" />
                <CardTitle>Find Therapist</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with licensed therapists in your area based on your needs.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="text-brand-primary gap-1">
                  <Link to="/find-therapist">
                    Find Help <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-calm-blue/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Your Journey Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "This website helped me understand my anxiety better and develop coping mechanisms.",
                author: "Jamie, 28",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              },
              {
                quote: "The journal feature has been a game-changer for my daily mental health practice.",
                author: "Alex, 35",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
              },
              {
                quote: "The activities section always helps me reset when I'm feeling overwhelmed.",
                author: "Sam, 22",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                      <p className="text-sm text-muted-foreground">{testimonial.author}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Wellbeing Journey Today</h2>
            <p className="max-w-[600px] mb-8 text-muted-foreground">
              Join thousands of others taking small steps every day toward better mental health.
            </p>
            <Button size="lg" asChild>
              <Link to="/journal">Create Your Journal</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
