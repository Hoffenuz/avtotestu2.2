import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { TestStartPage } from "@/components/TestStartPage";
import { TestInterface } from "@/components/TestInterface";

export default function Variant() {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { state: { returnTo: '/variant' } });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  if (testStarted && selectedVariant !== null) {
    return (
      <TestInterface 
        onExit={() => {
          setTestStarted(false);
          setSelectedVariant(null);
        }} 
        variant={selectedVariant}
      />
    );
  }

  return (
    <TestStartPage 
      onStartTest={(variant: number) => {
        setSelectedVariant(variant);
        setTestStarted(true);
      }} 
    />
  );
}
