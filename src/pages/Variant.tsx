import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { TestStartPage } from "@/components/TestStartPage";
import { TestInterface } from "@/components/TestInterface";

export default function Variant() {
  const [testStarted, setTestStarted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

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
