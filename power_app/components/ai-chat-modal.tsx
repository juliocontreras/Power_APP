"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Mic, StopCircle, Volume2, Headphones, Play, Pause } from "lucide-react"
import { generateResponse, generateSpeechAudio } from "@/app/actions/ai" // Import the new server action

// Detect SpeechRecognition on the browser (Chrome/Edge/Safari)
const SpeechRecognition =
  typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null

export default function AIChatModal({ theme, onClose, appData }) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; content: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State for voice input (single utterance)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  // State for voice output (TTS) using OpenAI
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null) // Ref for the HTMLAudioElement
  const [isSpeechPaused, setIsSpeechPaused] = useState(false)

  // State for continuous voice mode
  const [isContinuousVoiceMode, setIsContinuousVoiceMode] = useState(false)
  const continuousRecognitionRef = useRef<any>(null)
  const [liveTranscript, setLiveTranscript] = useState("") // For continuous mode

  const [micPermission, setMicPermission] = useState<"unknown" | "granted" | "denied">("unknown")
  const [micError, setMicError] = useState<string | null>(null)

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Cleanup for audio when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = "" // Clear the source
        audioRef.current.load() // Unload the audio
      }
    }
  }, [])

  async function ensureMicAccess() {
    if (window.isSecureContext === false) {
      setMicError("El acceso al micrófono requiere HTTPS o localhost. Abre la app en un origen seguro.")
      return false
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError("El navegador no soporta captura de audio.")
      return false
    }

    try {
      const status = await (navigator.permissions as any).query({ name: "microphone" })
      if (status.state === "denied") {
        setMicError(
          "El acceso al micrófono está bloqueado. Actívalo en la configuración del navegador y vuelve a intentarlo.",
        )
        return false
      }
    } catch {
      /* Puede no estar implementado; continuamos */
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop()) // liberamos
      setMicPermission("granted")
      return true
    } catch (err: any) {
      console.error("No se pudo acceder al micrófono:", err)
      setMicError(
        err?.name === "NotAllowedError"
          ? "El permiso fue denegado. Permite el uso del micrófono y recarga la página."
          : "No se pudo acceder al micrófono. Revisa tu dispositivo o configuración de privacidad.",
      )
      setMicPermission("denied")
      return false
    }
  }

  // Setup SpeechRecognition API for single utterance (Mic button)
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "es-ES"

    recognition.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }
      setInputValue(finalTranscript || interimTranscript)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (inputValue.trim() !== "") {
        handleSendMessage()
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error (single):", event.error)
      setIsListening(false)
      if (["audio-capture", "not-allowed"].includes(event.error)) {
        setMicError(
          "No se detectó un micrófono o el navegador no tiene permiso para usarlo. Actívalo e inténtalo de nuevo.",
        )
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Lo siento, hubo un error con el reconocimiento de voz. Inténtalo de nuevo.",
        },
      ])
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [inputValue]) // Depend on inputValue to ensure onend sends the latest value

  // Setup SpeechRecognition API for continuous mode (Headphones button)
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported for continuous mode.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true // Continuous listening
    recognition.interimResults = true
    recognition.lang = "es-ES"

    recognition.onresult = (event) => {
      let currentTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript
      }
      setLiveTranscript(currentTranscript)
      setInputValue(currentTranscript) // Also update input value for sending
    }

    recognition.onend = () => {
      console.log("Continuous recognition ended.")
      // This will only fire if stop() is called manually or after a long silence
      // We handle sending the message when the user explicitly stops the mode
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error (continuous):", event.error)
      setIsContinuousVoiceMode(false)
      setLiveTranscript("")
      setInputValue("")
      if (["audio-capture", "not-allowed"].includes(event.error)) {
        setMicError(
          "No se detectó un micrófono o el navegador no tiene permiso para usarlo. Actívalo e inténtalo de nuevo.",
        )
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Lo siento, hubo un error con el reconocimiento de voz continuo. Inténtalo de nuevo.",
        },
      ])
    }

    continuousRecognitionRef.current = recognition

    return () => {
      if (continuousRecognitionRef.current) {
        continuousRecognitionRef.current.stop()
      }
    }
  }, []) // No dependencies, runs once for continuous mode setup

  const playOpenAIAudio = async (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = "" // Clear previous source
      audioRef.current.load()
    }

    setIsSpeaking(true)
    setIsSpeechPaused(false)

    try {
      const { audioData, error } = await generateSpeechAudio(text)

      if (error) {
        throw new Error(error) // Propagate the specific error from the server action
      }

      const audioBlob = new Blob([audioData!], { type: "audio/mpeg" })
      const audioUrl = URL.createObjectURL(audioBlob)

      if (!audioRef.current) {
        audioRef.current = new Audio()
      }
      audioRef.current.src = audioUrl

      audioRef.current.onended = () => {
        console.log("OpenAI TTS finished speaking.")
        setIsSpeaking(false)
        setIsSpeechPaused(false)
        if (audioRef.current) {
          URL.revokeObjectURL(audioRef.current.src) // Clean up the object URL
          audioRef.current.src = ""
          audioRef.current.load()
        }
      }

      audioRef.current.onerror = (e) => {
        console.error("Error playing OpenAI audio:", e)
        setIsSpeaking(false)
        setIsSpeechPaused(false)
        if (audioRef.current) {
          URL.revokeObjectURL(audioRef.current.src)
          audioRef.current.src = ""
          audioRef.current.load()
        }
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Lo siento, no pude reproducir la respuesta de voz. Inténtalo de nuevo.",
          },
        ])
      }

      await audioRef.current.play()
    } catch (error: any) {
      // Catch the error here
      console.error("Error generating or playing OpenAI speech:", error)
      setIsSpeaking(false)
      setIsSpeechPaused(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Lo siento, hubo un problema con la voz de la IA: ${error.message}. Inténtalo de nuevo.`,
        },
      ])
    }
  }

  const handleSendMessage = async () => {
    if (isSpeaking || inputValue.trim() === "") return

    const userMessage = { id: Date.now().toString(), role: "user" as const, content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("") // Clear input immediately after sending

    try {
      const assistantText = await generateResponse(userMessage.content, appData)
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: assistantText }])

      // Reproducir la respuesta con TTS de OpenAI
      await playOpenAIAudio(assistantText)
    } catch (error) {
      console.error("AI error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Lo siento, hubo un problema al procesar tu solicitud. Inténtalo de nuevo.",
        },
      ])
    } finally {
      // This finally block ensures UI state is consistent even if audio playback fails
      // The playOpenAIAudio function itself handles setting isSpeaking to false on end/error
    }
  }

  const handleSingleVoiceInput = async () => {
    if (isSpeaking || isContinuousVoiceMode) return // Cannot use single voice input in continuous mode or while speaking
    if (!SpeechRecognition) {
      alert("El reconocimiento de voz no es compatible con tu navegador.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    if (!(await ensureMicAccess())) return

    setMicError(null)
    setInputValue("")
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Escuchando..." }])
    recognitionRef.current.start()
    setIsListening(true)
  }

  const handleContinuousVoiceMode = async () => {
    if (isSpeaking) return // Cannot start continuous mode while AI is speaking

    if (isContinuousVoiceMode) {
      // Stop continuous mode
      continuousRecognitionRef.current.stop()
      setIsContinuousVoiceMode(false)
      setLiveTranscript("")
      if (inputValue.trim() !== "") {
        handleSendMessage() // Send the accumulated input when stopping
      }
    } else {
      // Start continuous mode
      if (!SpeechRecognition) {
        alert("El reconocimiento de voz continuo no es compatible con tu navegador.")
        return
      }
      if (!(await ensureMicAccess())) return

      setMicError(null)
      setInputValue("")
      setLiveTranscript("")
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Modo de voz interactivo activado. Habla cuando quieras...",
        },
      ])
      continuousRecognitionRef.current.start()
      setIsContinuousVoiceMode(true)
    }
  }

  const handleToggleSpeechPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsSpeechPaused(false)
      } else {
        audioRef.current.pause()
        setIsSpeechPaused(true)
      }
    }
  }

  const inputClasses = theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
  const messageBubbleClasses = (role: "user" | "assistant") =>
    role === "user"
      ? `bg-cyan-600 text-white self-end rounded-br-none`
      : `bg-gray-600 text-white self-start rounded-bl-none`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className={`relative p-6 rounded-2xl shadow-xl w-full max-w-md h-[80vh] flex flex-col ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-200">
          <X />
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">Asistente de PowerBuilding (IA)</h3>

        <div className="flex-grow overflow-y-auto space-y-4 p-2 pr-4 custom-scrollbar">
          {messages.length === 0 && !isContinuousVoiceMode && (
            <p className="text-center text-gray-400 italic mt-10">
              ¡Hola! Pregúntame sobre tu entrenamiento, nutrición o progreso.
            </p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${messageBubbleClasses(msg.role)}`}>
                {msg.content}
                {msg.role === "assistant" && (
                  <div className="flex justify-end mt-2 space-x-2">
                    {isSpeaking && ( // Show pause/play button only if currently speaking
                      <button
                        onClick={handleToggleSpeechPause}
                        className={`p-1 rounded-full ${
                          theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                        }`}
                        aria-label={isSpeechPaused ? "Reanudar voz" : "Pausar voz"}
                      >
                        {isSpeechPaused ? <Play size={18} /> : <Pause size={18} />}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // If already speaking, stop current and start new. Otherwise, just play.
                        if (isSpeaking && audioRef.current) {
                          audioRef.current.pause()
                          audioRef.current.src = ""
                          audioRef.current.load()
                        }
                        playOpenAIAudio(msg.content)
                      }}
                      className={`p-1 rounded-full ${
                        isSpeaking ? "text-gray-400 cursor-not-allowed" : "text-cyan-400 hover:text-cyan-300"
                      }`}
                      disabled={isSpeaking} // Disable if already speaking
                      aria-label="Reproducir respuesta"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isContinuousVoiceMode && liveTranscript && (
            <div className="flex justify-end">
              <div className={`max-w-[80%] p-3 rounded-lg bg-cyan-600 text-white self-end rounded-br-none`}>
                {liveTranscript}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {isSpeaking && (
          <p className="text-center text-cyan-400 text-sm my-2 animate-pulse-fast">🔊 La IA está hablando...</p>
        )}
        {isContinuousVoiceMode && (
          <p className="text-center text-gray-400 text-sm my-2 animate-pulse">
            {liveTranscript ? "Hablando..." : "Escuchando..."}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          {micError && <p className="text-red-500 text-xs w-full mb-2">{micError}</p>}
          <input
            type="text"
            value={isContinuousVoiceMode ? liveTranscript : inputValue}
            onChange={(e) => {
              if (isContinuousVoiceMode) {
                setLiveTranscript(e.target.value)
              }
              setInputValue(e.target.value)
            }}
            placeholder={
              isContinuousVoiceMode
                ? "Modo de voz activo..."
                : isListening
                  ? "Habla ahora..."
                  : "Escribe tu pregunta..."
            }
            className={`flex-grow p-3 rounded-lg ${inputClasses}`}
            disabled={isListening || isSpeaking || isContinuousVoiceMode} // Disable typing while listening or speaking or in continuous mode
          />
          <button
            onClick={handleSingleVoiceInput}
            className={`p-3 rounded-full ${
              isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-gray-500 hover:bg-gray-600"
            } text-white transition-colors`}
            aria-label={isListening ? "Detener reconocimiento de voz" : "Iniciar reconocimiento de voz"}
            disabled={isSpeaking || isContinuousVoiceMode}
          >
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={handleContinuousVoiceMode}
            className={`p-3 rounded-full ${
              isContinuousVoiceMode
                ? "bg-purple-500 hover:bg-purple-600 animate-pulse" // Different color for continuous mode
                : "bg-gray-500 hover:bg-gray-600"
            } text-white transition-colors`}
            aria-label={isContinuousVoiceMode ? "Detener modo de voz interactivo" : "Iniciar modo de voz interactivo"}
            disabled={isSpeaking || isListening}
          >
            {isContinuousVoiceMode ? <StopCircle size={20} /> : <Headphones size={20} />}
          </button>
          <button
            onClick={handleSendMessage}
            className={`p-3 rounded-full ${
              inputValue.trim() === "" ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
            } text-white transition-colors`}
            disabled={inputValue.trim() === "" || isListening || isSpeaking || isContinuousVoiceMode}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#374151" : "#e5e7eb"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === "dark" ? "#6b7280" : "#9ca3af"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === "dark" ? "#4b5563" : "#6b7280"};
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulseFast {
          0% { opacity: 0.4 }
          50% { opacity: 1 }
          100% { opacity: 0.4 }
        }
        .animate-pulse-fast {
          animation: pulseFast 0.8s linear infinite;
        }
      `}</style>
    </div>
  )
}
