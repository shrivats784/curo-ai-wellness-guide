import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WelcomePage = () => {
  const [buttonText, setButtonText] = useState('');
  const navigate = useNavigate();

  const buttonTexts = ['Feeling sick?', 'Wanna be fit?'];

  useEffect(() => {
    // Randomly select button text on page load
    const randomText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
    setButtonText(randomText);
  }, []);

  const handleButtonClick = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 px-4 transition-all duration-700">
      <div className="text-center space-y-8 max-w-md animate-fade-in">
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold text-primary animate-scale-in">
            Curo.ai
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Welcome to Curo.ai
          </p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your AI-powered healthcare assistant for personalized health guidance
          </p>
        </div>
        
        <div className="pt-8 animate-slide-up delay-300">
          <Button
            onClick={handleButtonClick}
            size="lg"
            className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;