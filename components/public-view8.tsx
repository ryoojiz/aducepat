'use client'
import React, { useState, useEffect } from 'react';
import { Question, Participant, GameState } from '@/components/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const questions: Question[] = [
  { 
    id: 1, 
    text: "Jika cairan kol ungu dicampurkan ke pemutih pakaian, apa yang akan terjadi pada pemutih pakaian tersebut?", 
    type: "image",
    imageUrl: "../public/kol.png",
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
      const storedState = localStorage.getItem('gameState8');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        setCurrentQuestionIndex(parsedState.currentQuestionIndex);
        setParticipants(parsedState.participants);
        setSelectedParticipant(parsedState.selectedParticipant);
        setGameState(parsedState.gameState);

        if (parsedState.gameState === 'selected') {
          setShowVignette(true);
          const drumrollAudio = new Audio('https://s3.filebin.net/filebin/4c62d6a8c0ed7a42a835f01411b524b49cf9364c38f429a3ca5ec022748f7d8e/70b65a501c2c7c5c92d8a65d9868efde3bbb3fb8d2b55feeba252b3706f8dfdd?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=7pMj6hGeoKewqmMQILjm%2F20241024%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241024T010854Z&X-Amz-Expires=60&X-Amz-SignedHeaders=host&response-cache-control=max-age%3D60&response-content-disposition=filename%3D%22drumroll.mp3%22&response-content-type=audio%2Fmpeg&X-Amz-Signature=b92127a551612beb41ad7e24711da75ad3c90e5b9b7a7732568574c3100dc61b');
          drumrollAudio.play();
        } else if (['correct', 'incorrect'].includes(parsedState.gameState)) {
          setShowVignette(false);
          const resultAudio = new Audio('@/components/result.mp3');
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {showVignette && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 pointer-events-none animate-pulse" />
      )}
      <div className="max-w-4xl w-full space-y-8 relative z-20">
        <h1 className="text-4xl font-bold text-center text-white">Cerdas Cermat Kelas 8</h1>
        <div className="grid grid-cols-3 gap-4">
          {participants.map((participant) => (
            <Card key={participant.id} className={selectedParticipant === participant.id ? 'ring-2 ring-secondary' : ''}>
              <CardHeader>
                <CardTitle>{participant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-secondary">{participant.score}</p>
                <Progress value={(participant.score / 60) * 100} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent>
            <p className="text-2xl font-bold text-center">
              {gameState === 'waiting' && 'Menunggu Peserta'}
              {gameState === 'selected' && `Peserta ${selectedParticipant} menjawab!`}
              {gameState === 'correct' && 'Jawaban Benar!'}
              {gameState === 'incorrect' && 'Jawaban Salah!'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}