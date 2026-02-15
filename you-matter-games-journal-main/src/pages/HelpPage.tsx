
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, HelpCircle, ListChecks } from "lucide-react";

// Anxiety test questions
const anxietyQuestions = [
  {
    id: 1,
    question: "How often have you been feeling nervous, anxious, or on edge over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 2,
    question: "How often have you not been able to stop or control worrying over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 3,
    question: "How often have you been worrying too much about different things over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 4,
    question: "How often have you had trouble relaxing over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 5,
    question: "How often have you been so restless that it's hard to sit still over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
];

// Depression test questions
const depressionQuestions = [
  {
    id: 1,
    question: "How often have you had little interest or pleasure in doing things over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 2,
    question: "How often have you been feeling down, depressed, or hopeless over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 3,
    question: "How often have you had trouble falling or staying asleep, or sleeping too much over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 4,
    question: "How often have you been feeling tired or having little energy over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
  {
    id: 5,
    question: "How often have you had poor appetite or been overeating over the last 2 weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" }
    ]
  },
];

// FAQs
const faqs = [
  {
    question: "What is the difference between sadness and depression?",
    answer: "Sadness is a normal human emotion that everyone experiences. Depression is more persistent—it's a mental health condition that affects how you feel, think, and handle daily activities. Sadness typically passes with time, while depression lasts longer and may require professional help."
  },
  {
    question: "How do I know if I need professional help?",
    answer: "Consider seeking professional help if your symptoms persist for more than two weeks, interfere with daily functioning, cause significant distress, or involve thoughts of self-harm. Remember, seeking help is a sign of strength, not weakness."
  },
  {
    question: "Can lifestyle changes really impact mental health?",
    answer: "Yes! Regular exercise, healthy eating, adequate sleep, social connection, and stress management techniques can significantly improve mental health. While not a replacement for professional treatment when needed, lifestyle changes can be powerful complementary approaches."
  },
  {
    question: "How do I help someone who might be suicidal?",
    answer: "Take all talk of suicide seriously. Listen without judgment, ask direct questions about their intentions, don't leave them alone, remove access to means of self-harm, and help them connect with professional resources. In an emergency, call a crisis hotline or emergency services immediately."
  },
  {
    question: "Are mental health issues genetic?",
    answer: "Mental health conditions often result from a complex interaction of genetic, biological, psychological, and environmental factors. Having a family history may increase risk, but it doesn't guarantee development of a condition. Environmental factors and life experiences play significant roles."
  },
];

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState("anxiety-test");
  const [anxietyAnswers, setAnxietyAnswers] = useState<Record<number, string>>({});
  const [depressionAnswers, setDepressionAnswers] = useState<Record<number, string>>({});
  const [anxietySubmitted, setAnxietySubmitted] = useState(false);
  const [depressionSubmitted, setDepressionSubmitted] = useState(false);
  
  const handleAnxietyAnswer = (questionId: number, value: string) => {
    setAnxietyAnswers({ ...anxietyAnswers, [questionId]: value });
  };
  
  const handleDepressionAnswer = (questionId: number, value: string) => {
    setDepressionAnswers({ ...depressionAnswers, [questionId]: value });
  };
  
  const calculateAnxietyScore = () => {
    let score = 0;
    Object.values(anxietyAnswers).forEach(value => {
      score += parseInt(value);
    });
    return score;
  };
  
  const calculateDepressionScore = () => {
    let score = 0;
    Object.values(depressionAnswers).forEach(value => {
      score += parseInt(value);
    });
    return score;
  };
  
  const getAnxietyResult = (score: number) => {
    if (score <= 4) return "Minimal anxiety";
    if (score <= 9) return "Mild anxiety";
    if (score <= 14) return "Moderate anxiety";
    return "Severe anxiety";
  };
  
  const getDepressionResult = (score: number) => {
    if (score <= 4) return "Minimal depression";
    if (score <= 9) return "Mild depression";
    if (score <= 14) return "Moderate depression";
    return "Severe depression";
  };
  
  const submitAnxietyTest = () => {
    setAnxietySubmitted(true);
  };
  
  const submitDepressionTest = () => {
    setDepressionSubmitted(true);
  };
  
  const resetAnxietyTest = () => {
    setAnxietyAnswers({});
    setAnxietySubmitted(false);
  };
  
  const resetDepressionTest = () => {
    setDepressionAnswers({});
    setDepressionSubmitted(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-primary mb-4">Help Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find resources, take assessments, and get answers to common questions about mental health.
        </p>
      </div>

      <Tabs defaultValue="anxiety-test" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="anxiety-test" className="text-sm md:text-base">
            <ListChecks className="mr-2 h-4 w-4" />
            Anxiety Test
          </TabsTrigger>
          <TabsTrigger value="depression-test" className="text-sm md:text-base">
            <ListChecks className="mr-2 h-4 w-4" />
            Depression Test
          </TabsTrigger>
          <TabsTrigger value="faqs" className="text-sm md:text-base">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="anxiety-test">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Anxiety Assessment</CardTitle>
              <CardDescription>
                This brief assessment can help you determine if you may be experiencing symptoms of anxiety.
                This is not a diagnostic tool but can help guide your next steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!anxietySubmitted ? (
                <div className="space-y-6">
                  {anxietyQuestions.map((q) => (
                    <div key={q.id} className="p-4 border rounded-lg bg-muted/30">
                      <p className="font-medium mb-4">{q.question}</p>
                      <RadioGroup 
                        value={anxietyAnswers[q.id]} 
                        onValueChange={(value) => handleAnxietyAnswer(q.id, value)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={option.value} 
                                id={`anxiety-q${q.id}-${option.value}`} 
                              />
                              <Label htmlFor={`anxiety-q${q.id}-${option.value}`}>
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg bg-muted/30 text-center">
                    <h3 className="text-xl font-medium mb-4">Your Anxiety Assessment Results</h3>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Severity Score: {calculateAnxietyScore()}/15</p>
                      <Progress value={(calculateAnxietyScore() / 15) * 100} className="h-3" />
                    </div>
                    <div className="p-4 rounded-lg bg-background mb-4">
                      <p className="font-medium text-lg">{getAnxietyResult(calculateAnxietyScore())}</p>
                    </div>
                    <div className="text-sm text-muted-foreground text-left">
                      <p className="mb-2">
                        <strong>Remember:</strong> This assessment is not a diagnostic tool. 
                        It's meant to help you recognize potential anxiety symptoms.
                      </p>
                      <p>
                        If your results indicate moderate to severe anxiety, 
                        consider speaking with a mental health professional for proper evaluation and support.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!anxietySubmitted ? (
                <Button 
                  onClick={submitAnxietyTest}
                  disabled={Object.keys(anxietyAnswers).length < anxietyQuestions.length}
                  className="w-full"
                >
                  Submit Assessment
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={resetAnxietyTest}
                  className="w-full"
                >
                  Retake Assessment
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="depression-test">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Depression Assessment</CardTitle>
              <CardDescription>
                This brief assessment can help you determine if you may be experiencing symptoms of depression.
                This is not a diagnostic tool but can help guide your next steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!depressionSubmitted ? (
                <div className="space-y-6">
                  {depressionQuestions.map((q) => (
                    <div key={q.id} className="p-4 border rounded-lg bg-muted/30">
                      <p className="font-medium mb-4">{q.question}</p>
                      <RadioGroup 
                        value={depressionAnswers[q.id]} 
                        onValueChange={(value) => handleDepressionAnswer(q.id, value)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={option.value} 
                                id={`depression-q${q.id}-${option.value}`} 
                              />
                              <Label htmlFor={`depression-q${q.id}-${option.value}`}>
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg bg-muted/30 text-center">
                    <h3 className="text-xl font-medium mb-4">Your Depression Assessment Results</h3>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Severity Score: {calculateDepressionScore()}/15</p>
                      <Progress value={(calculateDepressionScore() / 15) * 100} className="h-3" />
                    </div>
                    <div className="p-4 rounded-lg bg-background mb-4">
                      <p className="font-medium text-lg">{getDepressionResult(calculateDepressionScore())}</p>
                    </div>
                    <div className="text-sm text-muted-foreground text-left">
                      <p className="mb-2">
                        <strong>Remember:</strong> This assessment is not a diagnostic tool. 
                        It's meant to help you recognize potential depression symptoms.
                      </p>
                      <p>
                        If your results indicate moderate to severe depression, 
                        consider speaking with a mental health professional for proper evaluation and support.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!depressionSubmitted ? (
                <Button 
                  onClick={submitDepressionTest}
                  disabled={Object.keys(depressionAnswers).length < depressionQuestions.length}
                  className="w-full"
                >
                  Submit Assessment
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={resetDepressionTest}
                  className="w-full"
                >
                  Retake Assessment
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about mental health, self-care, and seeking help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <HelpCircle className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-7">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="flex items-start gap-2 p-4 border rounded-lg bg-brand-primary/10 w-full">
                <AlertCircle className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Need immediate help?</p>
                  <p className="text-sm text-muted-foreground">
                    If you're experiencing a mental health emergency, please call your local emergency number 
                    or the National Suicide Prevention Lifeline at 988.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
