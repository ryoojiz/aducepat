'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Participant, GameState } from '@/components/types';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

const questions: Question[] = [
  { id: 1, text: "What is 2 + 2?", type: "text" },
  { id: 2, text: "Solve for x: 2x + 3 = 7", type: "text" },
  { id: 3, imageUrl: "/placeholder.svg?height=300&width=300", type: "image" },
  { id: 4, videoUrl: "https://example.com/math-video.mp4", type: "video" },
  { id: 5, text: "What is the square root of 16?", type: "text" },
  { id: 6, text: "If a triangle has angles 30°, 60°, and 90°, what type of triangle is it?", type: "text" },
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

  useEffect(() => {
    const storedState = localStorage.getItem('gameState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      setCurrentQuestionIndex(parsedState.currentQuestionIndex);
      setParticipants(parsedState.participants);
      setSelectedParticipant(parsedState.selectedParticipant);
      setGameState(parsedState.gameState);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify({
      currentQuestionIndex,
      participants,
      selectedParticipant,
      gameState,
    }));
  }, [currentQuestionIndex, participants, selectedParticipant, gameState]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (['1', '2', '3'].includes(event.key)) {
      const participantId = parseInt(event.key);
      setSelectedParticipant(participantId);
      setGameState('selected');
    } else if (event.key === 'Enter' && selectedParticipant) {
      setParticipants(prev => 
        prev.map(p => p.id === selectedParticipant ? { ...p, score: p.score + 5 } : p)
      );
      setGameState('correct');
      setTimeout(() => {
        setSelectedParticipant(null);
        setGameState('waiting');
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
      }, 3000);
    } else if (event.key === 'Backspace' && selectedParticipant) {
      setParticipants(prev => 
        prev.map(p => p.id === selectedParticipant ? { ...p, score: Math.max(0, p.score - 2) } : p)
      );
      setGameState('incorrect');
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
          <CardContent>
            {currentQuestion.type === 'text' && <p className="text-xl">{currentQuestion.text}</p>}
            {currentQuestion.type === 'image' && <img src={currentQuestion.imageUrl} alt="Question" className="max-w-full h-auto mx-auto" />}
            {currentQuestion.type === 'video' && (
              <video controls className="max-w-full h-auto mx-auto">
                <source src={currentQuestion.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
                <Progress value={(participant.score / 30) * 100} className="mt-2" />
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
            <p>Press Enter to mark correct (+5 points)</p>
            <p>Press Backspace to mark incorrect (-2 points)</p>
          </CardContent>
        </Card>
        <Button 
          onClick={() => setCurrentQuestionIndex((prev) => (prev + 1) % questions.length)}
          className="w-full"
        >
          Next Question
        </Button>
      </div>
    </div>
  );
}