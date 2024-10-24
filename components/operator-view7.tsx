'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Participant, GameState } from '@/components/types';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

const questions: Question[] = [
  { 
    id: 1, 
    text: "Jika cairan kol ungu dicampurkan ke pemutih pakaian, apa yang akan terjadi pada pemutih pakaian tersebut?", 
    type: "image",
    imageUrl: "./kol.png",
    answer: { text: "Tidak Berubah Warna", type: "video", videoUrl: "@/public/kol.mp4" }
  },
  { 
    id: 2, 
    text: "Tentukan hasil dari 𝟔𝟓𝟏 × 𝟗 = …", 
    type: "text",
    answer: { text: "5859", type: "text" }
  },
  { 
    id: 3, 
    text: "Zat yang berfungsi sebagai desinfektan dan penghilang rasa serta bau pada air, khususnya kolam renang adalah zat …",
    imageUrl: "/placeholder.svg?height=300&width=300", 
    type: "image",
    answer: { text: "Klorin atau Kaporit", type: "text" }
  },
  { 
    id: 4, 
    text: "Lapisan bumi yang berfungsi melindungi kita dari sinar UV adalah...",
    type: "image",
    answer: { text: "Ozon", type: "text" }
  },
  { 
    id: 5, 
    text: "Berapa nilai 𝒂 dan 𝒃?", 
    type: "image",
    imageUrl: "@/public/No5.png",
    answer: { text: "a = 10 dan b = 10", type: "text" }
  },
  { 
    id: 6, 
    text: "Suku ke-8 dari barisan 2, 5, 8, 11, 14, … adalah …", 
    type: "text",
    answer: { text: "23", type: "text" }
  },
];

export default function OperatorView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "Participant 1", score: 0 },
    { id: 2, name: "Participant 2", score: 0 },
    { id: 3, name: "Participant 3", score: 0 },
  ]);
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem('gameState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      setCurrentQuestionIndex(parsedState.currentQuestionIndex);
      setParticipants(parsedState.participants);
      setSelectedParticipant(parsedState.selectedParticipant);
      setGameState(parsedState.gameState);
      setShowAnswer(parsedState.showAnswer);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify({
      currentQuestionIndex,
      participants,
      selectedParticipant,
      gameState,
      showAnswer,
    }));
  }, [currentQuestionIndex, participants, selectedParticipant, gameState, showAnswer]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (['1', '2', '3'].includes(event.key)) {
      const participantId = parseInt(event.key);
      setSelectedParticipant(participantId);
      setGameState('selected');
      setShowAnswer(false);
    } else if (event.key === 'Enter' && selectedParticipant) {
      setParticipants(prev => 
        prev.map(p => p.id === selectedParticipant ? { ...p, score: p.score + 10 } : p)
      );
      setGameState('correct');
      setShowAnswer(true);
      setTimeout(() => {
        setSelectedParticipant(null);
        setGameState('waiting');
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
        setShowAnswer(false);
      }, 5000);
    } else if (event.key === 'Backspace' && selectedParticipant) {
      setParticipants(prev => 
        prev.map(p => p.id === selectedParticipant ? { ...p, score: Math.max(0, p.score - 5) } : p)
      );
      setGameState('incorrect');
      setShowAnswer(false);
      setTimeout(() => {
        setSelectedParticipant(null);
        setGameState('waiting');
      }, 3000);
    }
  }, [selectedParticipant]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleNameChange = (id: number, newName: string) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, name: newName } : p)
    );
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center text-indigo-600">Math Competition - Operator View</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl">{currentQuestion.text}</p>
            {currentQuestion.type === 'image' && <img src={currentQuestion.imageUrl} alt="Question" className="max-w-full h-auto mx-auto" />}
            {currentQuestion.type === 'video' && (
              <video controls className="max-w-full h-auto mx-auto">
                <source src={currentQuestion.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {showAnswer && (
              <div className="mt-4 p-4 bg-green-100 rounded-md">
                <h3 className="font-bold text-lg mb-2">Answer:</h3>
                {currentQuestion.answer.type === 'text' && <p>{currentQuestion.answer.text}</p>}
                {currentQuestion.answer.type === 'image' && <img src={currentQuestion.answer.imageUrl} alt="Answer" className="max-w-full h-auto mx-auto" />}
                {currentQuestion.answer.type === 'video' && (
                  <video controls className="max-w-full h-auto mx-auto">
                    <source src={currentQuestion.answer.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="grid grid-cols-3 gap-4">
          {participants.map((participant) => (
            <Card key={participant.id} className={selectedParticipant === participant.id ? 'ring-2 ring-indigo-500' : ''}>
              <CardHeader>
                <Input
                  value={participant.name}
                  onChange={(e) => handleNameChange(participant.id, e.target.value)}
                  className="font-bold text-lg"
                />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-indigo-600">{participant.score}</p>
                <Progress value={(participant.score / 60) * 100} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="space-y-2 text-center">
            <p className="text-xl font-semibold">
              Selected: {selectedParticipant ? `Participant ${selectedParticipant}` : 'None'}
            </p>
            <p>Game State: {gameState}</p>
            <p>Press 1, 2, or 3 to select a participant</p>
            <p>Press Enter to mark correct (+10 points)</p>
            <p>Press Backspace to mark incorrect (-5 points)</p>
          </CardContent>
        </Card>
        <Button 
          onClick={() => {
            setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
            setShowAnswer(false);
          }}
          className="w-full"
        >
          Next Question
        </Button>
      </div>
    </div>
  );
}