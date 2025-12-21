import { useState, useEffect } from "react";
import { QuestionNavigation } from "./QuestionNavigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, ChevronLeft, ChevronRight, X, Check } from "lucide-react";

interface QuestionData {
  id: number;
  bilet_id: number;
  question_id: number;
  name: string | null;
  question: {
    oz: string;
    uz: string;
    ru: string;
  };
  photo: string | null;
  answers: {
    status: number;
    answer_id: number;
    answer: {
      oz: string[];
      uz: string[];
      ru: string[];
    };
  };
}

interface VariantData {
  lesson: string;
  data: QuestionData[];
}

interface Question {
  id: number;
  text: string;
  image?: string;
  correctAnswer: number;
  answers: { id: number; text: string }[];
}

interface TestInterfaceProps {
  onExit: () => void;
  variant: number;
}

export const TestInterface = ({ onExit, variant }: TestInterfaceProps) => {
  const { t, questionLang } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds

  // Fetch test data from JSON file
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/data/variants/v${variant}.json`);
        
        if (!response.ok) {
          throw new Error(t("test.errorLoadingData"));
        }
        
        const variantData: VariantData = await response.json();
        
        if (!variantData.data || variantData.data.length === 0) {
          throw new Error(t("test.noQuestionsFound"));
        }

        // Transform JSON data to our Question format
        const transformedQuestions: Question[] = variantData.data.map((q, idx) => {
          // questionLang can be 'oz' (Latin), 'uz' (Cyrillic), or 'ru' (Russian)
          const answerLang = questionLang as keyof typeof q.answers.answer;
          const answers = q.answers.answer[answerLang] || q.answers.answer.uz;
          return {
            id: idx + 1,
            text: (q.question as any)[questionLang] || q.question.uz,
            image: q.photo ? `/images/${q.photo}` : undefined,
            correctAnswer: q.answers.status,
            answers: answers.map((answerText, ansIdx) => ({
              id: ansIdx + 1,
              text: answerText,
            })),
          };
        });

        setQuestions(transformedQuestions);
      } catch (err: any) {
        console.error('Error fetching test data:', err);
        setError(err.message || t("test.errorLoadingData"));
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [variant, questionLang, t]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalQuestions = questions.length || 20;
  const question = questions[currentQuestion - 1];
  const isRevealed = revealedQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  const handleAnswerSelect = (answerId: number) => {
    if (isRevealed) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
    
    setRevealedQuestions(prev => ({
      ...prev,
      [currentQuestion]: true
    }));
  };

  const getAnswerState = (answerId: number) => {
    if (!isRevealed || !question) return "default";
    if (answerId === question.correctAnswer) return "correct";
    if (answerId === selectedAnswer && answerId !== question.correctAnswer) return "incorrect";
    return "default";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t("test.variant")} {variant} {t("test.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 max-w-md text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={onExit}>{t("test.goBack")}</Button>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 max-w-md text-center">
          <p className="text-muted-foreground mb-4">{t("test.noQuestionsFound")}</p>
          <Button onClick={onExit}>{t("test.goBack")}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact Header */}
      <header className="bg-card border-b border-border px-3 py-2 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">{t("test.variant")} {variant}</span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 text-xs bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20"
            >
              {t("test.finish")}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={onExit}
            >
              {t("test.exit")}
            </Button>
          </div>
        </div>
      </header>

      {/* Question Navigation */}
      <QuestionNavigation
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        answeredQuestions={selectedAnswers}
        onQuestionSelect={setCurrentQuestion}
      />

      {/* Main Content */}
      <main className="flex-1 px-3 py-4 max-w-6xl mx-auto w-full overflow-y-auto">
        {/* Question Number */}
        <div className="text-xs text-muted-foreground mb-2">
          {t("test.question")} {currentQuestion} / {totalQuestions}
        </div>

        {/* Desktop: Two-column layout */}
        <div className="md:flex md:gap-6 md:items-start">
          {/* Left Column: Question + Answers */}
          <div className="md:flex-1">
            {/* Question Text */}
            <Card className="p-3 md:p-4 bg-card border-border mb-3">
              <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
                {question.text}
              </p>
            </Card>

            {/* Mobile Only: Question Image */}
            {question.image && (
              <Card className="md:hidden p-2 bg-card border-border mb-3 overflow-hidden">
                <img
                  src={question.image}
                  alt="Question illustration"
                  className="w-full max-w-[200px] h-auto mx-auto object-contain rounded"
                />
              </Card>
            )}

            {/* Answer Options */}
            <div className="space-y-2">
              {question.answers.map((answer) => {
                const state = getAnswerState(answer.id);
                const isSelected = selectedAnswer === answer.id;
                
                return (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.id)}
                    disabled={isRevealed}
                    className={`
                      w-full p-3 rounded-lg border text-left transition-all duration-200
                      flex items-center gap-3
                      ${state === "correct" 
                        ? "border-transparent bg-green-500 text-white" 
                        : state === "incorrect"
                        ? "border-transparent bg-red-400 text-white"
                        : isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }
                    `}
                  >
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                      ${state === "correct"
                        ? "bg-white/20"
                        : state === "incorrect"
                        ? "bg-white/20"
                        : "border-2 border-muted-foreground/50"
                      }
                    `}>
                      {state === "correct" ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : state === "incorrect" ? (
                        <X className="w-4 h-4 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm font-medium">{answer.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Image (Desktop only) */}
          {question.image && (
            <div className="hidden md:block md:w-[400px] md:flex-shrink-0">
              <Card className="p-3 bg-card border-border overflow-hidden">
                <img
                  src={question.image}
                  alt="Question illustration"
                  className="w-full h-auto object-contain rounded"
                />
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="bg-card border-t border-border px-3 py-3 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 text-sm"
            disabled={currentQuestion === 1}
            onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t("test.previous")}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            <span className="font-medium text-primary">{Object.keys(selectedAnswers).length}</span>
            <span> / {totalQuestions}</span>
          </div>

          <Button
            size="sm"
            className="h-9 px-3 text-sm"
            disabled={currentQuestion === totalQuestions}
            onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1))}
          >
            {t("test.next")}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  );
};
