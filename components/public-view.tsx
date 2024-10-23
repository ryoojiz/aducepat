'use client'
import React, { useState, useEffect } from 'react';
import { Question, Participant, GameState } from '@/components/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const questions: Question[] = [
  { id: 1, text: "What is 2 + 2?", type: "text" },
  { id: 2, text: "Solve for x: 2x + 3 = 7", type: "text" },
  { id: 3, imageUrl: "/placeholder.svg?height=300&width=300", type: "image" },
  { id: 4, videoUrl: "https://example.com/math-video.mp4", type: "video" },
  { id: 5, text: "What is the square root of 16?", type: "text" },
  { id: 6, text: "If a triangle has angles 30°, 60°, and 90°, what type of triangle is it?", type: "text" },
];

export default function PublicView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "Participant 1", score: 0 },
    { id: 2, name: "Participant 2", score: 0 },
    { id: 3, name: "Participant 3", score: 0 },
  ]);
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [showVignette, setShowVignette] = useState(false);

  useEffect(() => {
    const checkForUpdates = () => {
      const storedState = localStorage.getItem('gameState');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        setCurrentQuestionIndex(parsedState.currentQuestionIndex);
        setParticipants(parsedState.participants);
        setSelectedParticipant(parsedState.selectedParticipant);
        setGameState(parsedState.gameState);

        if (parsedState.gameState === 'selected') {
          setShowVignette(true);
          const drumrollAudio = new Audio('/drumroll.mp3');
          drumrollAudio.play();
        } else if (['correct', 'incorrect'].includes(parsedState.gameState)) {
          setShowVignette(false);
          const resultAudio = new Audio('/result.mp3');
          resultAudio.play();
        }
      }
    };

    checkForUpdates();
    const interval = setInterval(checkForUpdates, 100);

    return () => clearInterval(interval);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4 relative">
      {showVignette && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 pointer-events-none animate-pulse" />
      )}
      <div className="max-w-4xl w-full space-y-8 relative z-20">
        <h1 className="text-4xl font-bold text-center text-indigo-600">Math Competition - Public View</h1>
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
                <CardTitle>{participant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-indigo-600">{participant.score}</p>
                <Progress value={(participant.score / 30) * 100} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent>
            <p className="text-2xl font-bold text-center">
              {gameState === 'waiting' && 'Waiting for participants...'}
              {gameState === 'selected' && `Participant ${selectedParticipant} selected!`}
              {gameState === 'correct' && 'Correct answer!'}
              {gameState === 'incorrect' && 'Incorrect answer!'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}