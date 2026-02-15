import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, ThumbsUp, Clock, Tag, Book, Newspaper, GraduationCap, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const videoCategories = [
  {
    id: "anxiety",
    label: "Anxiety",
    videos: [
      {
        id: "v1",
        title: "Understanding Anxiety Disorders",
        description: "Learn about the different types of anxiety disorders and how they affect your life.",
        thumbnail: "https://i.ytimg.com/vi/BVJkf8IuRjE/hqdefault.jpg",
        videoId: "BVJkf8IuRjE",
        duration: "15:24",
        likes: "24k"
      },
      {
        id: "v2",
        title: "5-Minute Anxiety Relief Techniques",
        description: "Quick exercises you can do anywhere to help manage anxiety symptoms.",
        thumbnail: "https://i.ytimg.com/vi/O-6f5wQXSu8/hqdefault.jpg",
        videoId: "O-6f5wQXSu8",
        duration: "8:17",
        likes: "19k"
      },
      {
        id: "v3",
        title: "The Science Behind Anxiety",
        description: "A deeper look into what happens in your brain and body during anxiety.",
        thumbnail: "https://i.ytimg.com/vi/ZidGozDhOjg/hqdefault.jpg",
        videoId: "ZidGozDhOjg",
        duration: "12:42",
        likes: "31k"
      }
    ]
  },
  {
    id: "depression",
    label: "Depression",
    videos: [
      {
        id: "v4",
        title: "Signs of Depression You Might Not Notice",
        description: "Subtle symptoms of depression that are often overlooked.",
        thumbnail: "https://i.ytimg.com/vi/XiCrniLQGYc/hqdefault.jpg",
        videoId: "XiCrniLQGYc",
        duration: "10:18",
        likes: "42k"
      },
      {
        id: "v5",
        title: "How to Support Someone With Depression",
        description: "Practical ways to be there for someone struggling with depression.",
        thumbnail: "https://i.ytimg.com/vi/uB_joTxpbjQ/hqdefault.jpg",
        videoId: "uB_joTxpbjQ",
        duration: "9:05",
        likes: "28k"
      },
      {
        id: "v6",
        title: "Depression Treatment Options",
        description: "An overview of different approaches to managing depression.",
        thumbnail: "https://i.ytimg.com/vi/K0le7yy5UCs/hqdefault.jpg",
        videoId: "K0le7yy5UCs",
        duration: "14:33",
        likes: "17k"
      }
    ]
  },
  {
    id: "self-care",
    label: "Self-Care",
    videos: [
      {
        id: "v7",
        title: "Building a Self-Care Routine That Works",
        description: "How to create sustainable self-care practices for better mental health.",
        thumbnail: "https://i.ytimg.com/vi/w0iVTQS8ftg/hqdefault.jpg",
        videoId: "w0iVTQS8ftg",
        duration: "11:27",
        likes: "36k"
      },
      {
        id: "v8",
        title: "Mindfulness for Beginners",
        description: "A gentle introduction to mindfulness practices for everyday life.",
        thumbnail: "https://i.ytimg.com/vi/6p_yaNFSYao/hqdefault.jpg",
        videoId: "6p_yaNFSYao",
        duration: "7:19",
        likes: "52k"
      },
      {
        id: "v9",
        title: "Creating Healthy Boundaries",
        description: "Learn how to set and maintain boundaries for better mental health.",
        thumbnail: "https://i.ytimg.com/vi/5n6gbpCqA5g/hqdefault.jpg",
        videoId: "5n6gbpCqA5g",
        duration: "13:45",
        likes: "29k"
      }
    ]
  }
];

const articles = [
  {
    id: "a1",
    category: "Understanding Mental Health",
    title: "The Basics of Mental Health: A Comprehensive Guide",
    author: "Dr. Emily Parker",
    date: "2024-04-15",
    readTime: "8 min read",
    excerpt: "Mental health is an essential part of our overall wellbeing. This guide covers the fundamentals of mental health, common conditions, and when to seek help.",
    content: `Mental health is a crucial component of our overall wellbeing, yet it's often overlooked or misunderstood. This comprehensive guide aims to demystify mental health and provide you with essential information about maintaining good mental health, recognizing common conditions, and knowing when to seek professional help.

Understanding Mental Health
Mental health encompasses our emotional, psychological, and social well-being. It affects how we think, feel, act, make choices, and relate to others. Just like physical health, mental health is something everyone has, and it can range from good to poor.

Common Mental Health Conditions
1. Anxiety Disorders
- Generalized Anxiety Disorder (GAD)
- Social Anxiety Disorder
- Panic Disorder
- Specific Phobias

2. Mood Disorders
- Major Depressive Disorder
- Bipolar Disorder
- Persistent Depressive Disorder

3. Other Common Conditions
- Post-Traumatic Stress Disorder (PTSD)
- Obsessive-Compulsive Disorder (OCD)
- Eating Disorders

Warning Signs and Symptoms
- Persistent sadness or anxiety
- Significant changes in eating or sleeping patterns
- Difficulty concentrating or making decisions
- Loss of interest in activities once enjoyed
- Feelings of hopelessness or worthlessness
- Physical symptoms without clear causes
- Thoughts of self-harm or suicide

When to Seek Help
It's important to seek professional help if:
- Symptoms persist for more than two weeks
- Daily functioning is impaired
- Relationships are affected
- Work or school performance suffers
- You're having thoughts of self-harm

Remember: Seeking help is a sign of strength, not weakness. Mental health professionals are trained to help you develop coping strategies and work through challenges.`,
    tags: ["Mental Health", "Wellness", "Self-Care"],
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800"
  },
  {
    id: "a2",
    category: "Coping Strategies",
    title: "10 Evidence-Based Techniques for Managing Stress",
    author: "Dr. Michael Wong",
    date: "2024-04-12",
    readTime: "6 min read",
    excerpt: "Discover scientifically proven methods to handle stress effectively, from mindfulness practices to physical exercise routines.",
    content: `Stress is a natural part of life, but when it becomes overwhelming, it can significantly impact our mental and physical health. Here are ten evidence-based techniques for managing stress effectively.

1. Mindfulness Meditation
Research has shown that regular mindfulness practice can reduce stress, anxiety, and depression. Start with just 5-10 minutes daily of focused breathing and present-moment awareness.

2. Physical Exercise
Regular exercise releases endorphins, reduces stress hormones, and improves mood. Aim for at least 30 minutes of moderate exercise most days of the week.

3. Progressive Muscle Relaxation
This technique involves tensing and relaxing different muscle groups systematically, helping to reduce physical and mental tension.

4. Time Management
- Prioritize tasks
- Break large projects into smaller steps
- Set realistic deadlines
- Learn to say "no" when necessary

5. Deep Breathing Exercises
Practice deep breathing exercises like:
- Box breathing (4-4-4-4 pattern)
- Diaphragmatic breathing
- 4-7-8 breathing technique

6. Social Connection
Maintaining strong social connections can buffer against stress. Regular interaction with supportive friends and family is crucial for mental wellbeing.

7. Sleep Hygiene
Good sleep is essential for stress management:
- Maintain a consistent sleep schedule
- Create a relaxing bedtime routine
- Limit screen time before bed
- Keep your bedroom cool and dark

8. Healthy Nutrition
- Eat regular, balanced meals
- Limit caffeine and sugar
- Stay hydrated
- Consider stress-reducing foods like:
  * Dark chocolate
  * Green tea
  * Fatty fish
  * Nuts and seeds

9. Cognitive Restructuring
Learn to identify and challenge negative thought patterns:
- Question your assumptions
- Look for evidence
- Consider alternative perspectives
- Practice self-compassion

10. Hobby Engagement
Engaging in enjoyable activities can reduce stress by:
- Providing a sense of accomplishment
- Offering distraction from worries
- Creating opportunities for flow states
- Building self-esteem

Implementation Tips:
- Start small with one or two techniques
- Practice consistently
- Track your progress
- Be patient with yourself
- Adjust strategies as needed

Remember: What works for one person may not work for another. Experiment with different techniques to find what works best for you.`,
    tags: ["Stress Management", "Mental Health", "Wellness"],
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800"
  },
  {
    id: "a3",
    category: "Relationships",
    title: "Building Healthy Relationships: A Guide to Better Connections",
    author: "Dr. Sarah Johnson",
    date: "2024-04-10",
    readTime: "7 min read",
    excerpt: "Learn how to foster meaningful relationships and maintain strong connections with others while taking care of your mental health.",
    content: `Building and maintaining healthy relationships is crucial for our mental health and overall wellbeing. This guide explores key principles and practical strategies for developing stronger, more meaningful connections with others.

The Foundation of Healthy Relationships

1. Communication
Effective communication is the cornerstone of healthy relationships:
- Practice active listening
- Express feelings clearly and respectfully
- Be honest and transparent
- Pay attention to non-verbal cues
- Choose the right time and place for important conversations

2. Boundaries
Setting and respecting boundaries is essential:
- Identify your personal limits
- Communicate boundaries clearly
- Respect others' boundaries
- Learn to say "no" when necessary
- Regularly reassess and adjust boundaries

3. Trust and Respect
Building trust and showing respect:
- Be reliable and consistent
- Keep commitments
- Maintain confidentiality
- Show appreciation
- Accept differences
- Apologize when wrong

4. Emotional Intelligence
Developing emotional intelligence involves:
- Recognizing your own emotions
- Understanding others' feelings
- Managing emotional responses
- Showing empathy
- Practicing self-awareness

Practical Strategies for Better Relationships

1. Quality Time
- Schedule regular one-on-one time
- Minimize distractions during interactions
- Create shared experiences
- Be fully present in conversations

2. Conflict Resolution
Healthy ways to handle disagreements:
- Address issues promptly
- Focus on the problem, not the person
- Use "I" statements
- Look for compromise
- Take breaks when needed
- Seek to understand before being understood

3. Supporting Each Other
Ways to show support:
- Celebrate successes together
- Offer help during difficult times
- Show interest in each other's goals
- Provide emotional support
- Be reliable and dependable

4. Maintaining Independence
While nurturing relationships:
- Pursue individual interests
- Maintain other friendships
- Continue personal growth
- Respect need for alone time
- Support each other's independence

Warning Signs of Unhealthy Relationships
- Constant criticism or contempt
- Lack of respect for boundaries
- Controlling behavior
- Dishonesty or betrayal
- Emotional or physical abuse
- Excessive dependency
- Lack of trust

When to Seek Professional Help
Consider relationship counseling when:
- Communication breaks down
- Trust is broken
- Patterns become destructive
- Individual mental health is affected
- Major life changes create strain

Remember: Healthy relationships require ongoing effort and attention from all parties involved. It's normal for relationships to have ups and downs, but the key is maintaining respect, communication, and a willingness to work through challenges together.`,
    tags: ["Relationships", "Communication", "Mental Health"],
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
  }
];

const resources = [
  {
    id: "r1",
    category: "Books",
    items: [
      {
        title: "The Anxiety and Phobia Workbook",
        author: "Edmund J. Bourne",
        description: "A comprehensive resource for managing anxiety and phobias.",
        link: "#"
      },
      {
        title: "Feeling Good: The New Mood Therapy",
        author: "David D. Burns",
        description: "Classic self-help book for managing depression using cognitive behavioral therapy.",
        link: "#"
      }
    ]
  },
  {
    id: "r2",
    category: "Online Courses",
    items: [
      {
        title: "Understanding Depression",
        provider: "Mental Health Academy",
        duration: "4 weeks",
        description: "Learn about depression, its causes, and treatment options.",
        link: "#"
      },
      {
        title: "Mindfulness for Beginners",
        provider: "Wellness Institute",
        duration: "2 weeks",
        description: "Introduction to mindfulness practices for mental wellbeing.",
        link: "#"
      }
    ]
  }
];

const InfoPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<null | {
    videoId: string;
    title: string;
  }>(null);
  
  const [selectedArticle, setSelectedArticle] = useState<null | {
    title: string;
    content: string;
    author: string;
    date: string;
    category: string;
  }>(null);
  
  const handlePlayVideo = (videoId: string, title: string) => {
    setSelectedVideo({ videoId, title });
  };

  const closeDialog = () => {
    setSelectedVideo(null);
    setSelectedArticle(null);
  };

  const handleReadArticle = (article: any) => {
    setSelectedArticle({
      title: article.title,
      content: article.content,
      author: article.author,
      date: article.date,
      category: article.category
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-primary mb-4">Mental Health Resources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive collection of mental health resources, including videos, articles, 
          and educational materials to support your wellbeing journey.
        </p>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="videos">
            <Youtube className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="articles">
            <Newspaper className="h-4 w-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Book className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <Tabs defaultValue="anxiety" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              {videoCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {videoCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <div 
                        className="aspect-video bg-muted relative cursor-pointer"
                        onClick={() => handlePlayVideo(video.videoId, video.title)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Youtube className="h-12 w-12 text-white/90" />
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {video.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {video.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {category.label}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {video.description}
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handlePlayVideo(video.videoId, video.title)}
                        >
                          <Youtube className="mr-2 h-4 w-4" /> Watch Video
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video relative">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription>By {article.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleReadArticle(article)}
                  >
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {section.category === "Books" ? (
                      <Book className="h-5 w-5 text-brand-primary" />
                    ) : (
                      <GraduationCap className="h-5 w-5 text-brand-primary" />
                    )}
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {section.items.map((item, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <CardDescription>
                              {item.author || item.provider}
                              {item.duration && ` • ${item.duration}`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            <Button variant="outline" asChild>
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                Learn More <ArrowRight className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedVideo} onOpenChange={closeDialog}>
        {selectedVideo && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
              <DialogDescription>Click the X to close when finished watching</DialogDescription>
            </DialogHeader>
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              ></iframe>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!selectedArticle} onOpenChange={closeDialog}>
        {selectedArticle && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>{selectedArticle.category}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
              </div>
              <DialogTitle className="text-2xl">{selectedArticle.title}</DialogTitle>
              <DialogDescription>By {selectedArticle.author}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('- ')) {
                  // Handle bullet points
                  return (
                    <ul key={index} className="list-disc pl-4 space-y-1">
                      {paragraph.split('\n').map((item, i) => (
                        <li key={i}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.includes(':')) {
                  // Handle headings
                  const [heading, ...content] = paragraph.split('\n');
                  return (
                    <div key={index} className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
                      {content.length > 0 && (
                        <div className="space-y-1">
                          {content.map((line, i) => {
                            if (line.startsWith('- ')) {
                              return (
                                <ul key={i} className="list-disc pl-4">
                                  <li>{line.replace('- ', '')}</li>
                                </ul>
                              );
                            }
                            return <p key={i}>{line}</p>;
                          })}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Regular paragraphs
                  return <p key={index}>{paragraph}</p>;
                }
              })}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default InfoPage;

