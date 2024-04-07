import React, { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es-ES');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(new SpeechRecognition());
  const languageSelector = useRef(null);
  const browserSupportsSpeechRecognition = SpeechRecognition !== undefined;
  const inactivityTimeout = useRef(null); // Referencia al temporizador de inactividad
  const inactivityTimeoutDuration = 4000; // Duración del temporizador en milisegundos (5 segundos en este ejemplo)

  const startRecording = useCallback(() => {
    if (browserSupportsSpeechRecognition) {
      setTranscript('');
      recognition.current.lang = selectedLanguage;
      recognition.current.start();
      setIsRecording(true);
    }
  }, [browserSupportsSpeechRecognition, selectedLanguage]);

  const stopRecording = useCallback(() => {
    if (browserSupportsSpeechRecognition) {
      recognition.current.stop();
      setIsRecording(false);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      recognition.current.continuous = true;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event) => {
        const text = event.results[event.results.length - 1][0].transcript;
        setTranscript((prev) => prev + text);

        // Reiniciar el temporizador de inactividad
        clearTimeout(inactivityTimeout.current);
        inactivityTimeout.current = setTimeout(() => {
          stopRecording();
        }, inactivityTimeoutDuration);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };

      if (languageSelector.current) {
        languageSelector.current.addEventListener('change', () => {
          stopRecording();
          startRecording();
        });
      }
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      clearTimeout(inactivityTimeout.current); // Limpiar el temporizador al desmontar el componente
    };
  }, []);

  const handleLanguageChange = (event) => {
    if (languageSelector.current) {
      languageSelector.current.value = event.target.value;
      stopRecording();
      startRecording();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    transcript,
    isRecording,
    setTranscript,
    handleLanguageChange,
    startRecording,
    stopRecording,
    handleMicClick,
  };
};