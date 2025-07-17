"use client"

import { useState, useEffect, useRef } from "react"
import {
  Video,
  BookOpen,
  Dumbbell,
  Calendar,
  Heart,
  Moon,
  Star,
  BarChart2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sun,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Music,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react"
import PerformanceSection from "../components/performance-section"
import GuideSection from "../components/guide-section"
import TechniqueGuideSection from "../components/technique-guide-section"
import NutritionSection from "../components/nutrition-section" // Import the new NutritionSection
import AIChatModal from "../components/ai-chat-modal" // Import the new AI Chat Modal

// --- BASE DE DATOS DE ALIMENTOS (por 100g) ---
const foodDatabase = [
  {
    id: "f1",
    name: "Pechuga de Pollo",
    macros: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  },
  {
    id: "f2",
    name: "Arroz Blanco Cocido",
    macros: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  },
  {
    id: "f3",
    name: "Huevo Entero",
    macros: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  },
  {
    id: "f4",
    name: "Salmón",
    macros: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  },
  {
    id: "f5",
    name: "Brócoli",
    macros: { calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
  },
  {
    id: "f6",
    name: "Avena en Hojuelas",
    macros: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  },
  {
    id: "f7",
    name: "Carne de Res (Magra)",
    macros: { calories: 250, protein: 26, carbs: 0, fat: 15 },
  },
  {
    id: "f8",
    name: "Patata Cocida",
    macros: { calories: 87, protein: 2, carbs: 20.1, fat: 0.1 },
  },
  {
    id: "f9",
    name: "Aceite de Oliva",
    macros: { calories: 884, protein: 0, carbs: 0, fat: 100 },
  },
  {
    id: "f10",
    name: "Lentejas Cocidas",
    macros: { calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  },
]

// --- DATOS DE MÚSICA ---
const playlists = [
  {
    id: "pl1",
    name: "GYM & RUNNING",
    creator: "YouTube Playlist",
    type: "external",
    url: "https://youtube.com/playlist?list=PLd9pZOSJs1QoaocFYtzsSlTGUr9omvSnK",
    songs: [],
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png",
  },
  {
    id: "pl2",
    name: "Disturbed - Asylum",
    creator: "Disturbed",
    type: "internal",
    songs: [
      {
        id: "s1",
        title: "Remnants",
        artist: "Disturbed",
        duration: 163,
        artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png",
        url: "#",
      },
      {
        id: "s2",
        title: "Asylum",
        artist: "Disturbed",
        duration: 276,
        artwork: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png",
        url: "#",
      },
    ],
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png",
  },
]

// --- DATOS INICIALES DE LA RUTINA ---
const initialWorkoutData = {
  LUNES: {
    title: "Fuerza: Tren Superior",
    icon: Dumbbell,
    color: "#3b82f6",
    exercises: [
      {
        id: 1,
        name: "Press militar con barra",
        weight: 45,
        sets: 2,
        reps: "5",
        videoId: "jpi8pC95ubY",
        completed: false,
        sensations: "",
      },
      {
        id: 2,
        name: "Dominadas supinas con lastre",
        weight: 20,
        sets: 2,
        reps: "5",
        notes: "Hacerlas extremadamente lentas.",
        videoId: "hDWIrVDItNQ",
        completed: false,
        sensations: "",
      },
    ],
    sections: {
      "ABS / CORE": [
        {
          id: 33,
          name: "Plancha frontal",
          sets: 2,
          reps: "1 min",
          completed: false,
          sensations: "",
        },
      ],
    },
    dayNotes: "",
  },
  MARTES: {
    title: "Fuerza: Tren Inferior",
    icon: Dumbbell,
    color: "#3b82f6",
    exercises: [
      {
        id: 10,
        name: "Sentadillas con barra",
        weight: 75,
        sets: 2,
        reps: "8",
        notes: "Técnica afianzada.",
        videoId: "dsCuiccYNGs",
        completed: false,
        sensations: "",
      },
    ],
    dayNotes: "",
  },
  MIÉRCOLES: {
    title: "Descanso Activo / Cardio",
    icon: Heart,
    color: "#f97316",
    exercises: [
      {
        id: 16,
        name: "Carrera moderada",
        reps: "30 min",
        completed: false,
        sensations: "",
      },
    ],
    dayNotes: "",
  },
  JUEVES: {
    title: "Hipertrofia: Tren Inferior",
    icon: Dumbbell,
    color: "#10b981",
    exercises: [
      {
        id: 26,
        name: "Sentadillas con barra",
        weight: 75,
        sets: 2,
        reps: "8",
        completed: false,
        sensations: "",
      },
    ],
    dayNotes: "",
  },
  VIERNES: {
    title: "Día de Brazo + Abdomen",
    icon: Dumbbell,
    color: "#10b981",
    notes: "Método Heavy Duty: control y conciencia.",
    sections: {
      BÍCEPS: [
        {
          id: 17,
          name: "Curl con barra z",
          weight: 32.5,
          sets: 2,
          reps: "5-8",
          videoId: "gGSLcJp6h18",
          completed: false,
          sensations: "",
        },
      ],
    },
    dayNotes: "",
  },
  SÁBADO: {
    title: "Descanso",
    icon: Moon,
    color: "#6b7280",
    exercises: [],
    dayNotes: "",
  },
  DOMINGO: {
    title: "Descanso Activo",
    icon: Star,
    color: "#f97316",
    exercises: [
      {
        id: 32,
        name: "Caminata o trote",
        reps: "Opcional",
        completed: false,
        sensaciones: "",
      },
    ],
    dayNotes: "",
  },
}

// --- FUNCIÓN UTILITARIA PARA FORMATEAR FECHAS ---
const toYYYYMMDD = (date) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split("T")[0]
}

const getDayKeyFromDate = (date) => {
  const dayIndex = new Date(date).getDay()
  const dayMap = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"]
  return dayMap[dayIndex]
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

// --- PANTALLA DE INICIO ---
const SplashScreen = ({ onEnter, isFading }) => {
  const canvasRef = useRef(null)
  const normalImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png"
  const winkingImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-u8EJXMO7yEJ972TFwzVql43aW2dM6P.png"
  const backgroundImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-16wXETboIwvRKYpy04U0ZCnbtfNWyF.png"

  const [isClicked, setIsClicked] = useState(false)
  const imageUrl = isClicked ? winkingImageUrl : normalImageUrl

  const handleInitialClick = () => {
    if (isClicked) return
    setIsClicked(true)
    setTimeout(() => {
      onEnter()
    }, 1500)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    let animationFrameId
    let particles = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 2000)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 1.2 - 0.3,
          radius: Math.random() * 2 + 1,
          initialLife: Math.random() * 400 + 350,
          life: Math.random() * 400 + 350,
          color: `rgba(255, ${Math.floor(Math.random() * 80) + 150}, 0, 1)`,
        })
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life--
        if (p.y < -p.radius || p.life <= 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + p.radius
          p.life = p.initialLife
        }
        const opacity = Math.max(0, p.life / p.initialLife)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 80) + 150}, 0, ${opacity})`
        ctx.fill()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("resize", createParticles)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("resize", createParticles)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const imageDivClasses = [
    "w-40 h-40 sm:w-48 sm:h-48 rounded-full mb-10 shadow-lg bg-center bg-cover transition-all duration-500",
    isClicked && !isFading ? "wink-effect" : "",
    isFading ? "spinning-exit" : "",
  ].join(" ")

  return (
    <div className="relative h-full w-full bg-black cursor-pointer overflow-hidden" onClick={handleInitialClick}>
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          opacity: 0.5,
          filter: "blur(8px)",
        }}
      ></div>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      ></canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none z-10">
        <div
          className={imageDivClasses}
          style={{
            backgroundImage: `url(${imageUrl})`,
            animation: !isClicked && !isFading ? "subtleGlow 4s ease-in-out infinite" : undefined,
          }}
        ></div>

        <div className={`transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.25em] uppercase text-white">Power</h1>
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.25em] uppercase text-gray-400">Building</h1>
          <p
            className="mt-7 text-base text-gray-400 tracking-wider"
            style={{
              animation: isFading ? undefined : "flickerGlow 3s infinite",
            }}
          >
            Powered By Julio Contreras
          </p>
        </div>
      </div>

      <style jsx>{`
      @keyframes subtleGlow {
        0%, 100% { box-shadow: 0 0 25px rgba(255, 165, 0, 0.4), 0 0 10px rgba(255, 165, 0, 0.3); }
        50% { box-shadow: 0 0 45px rgba(255, 165, 0, 0.6), 0 0 25px rgba(255, 165, 0, 0.4); }
      }
      @keyframes spinAndExit {
        0% { transform: rotateY(0deg) scale(1); opacity: 1; }
        70% { transform: rotateY(1080deg) scale(1); opacity: 1; }
        100% { transform: rotateY(2080deg) scale(0); opacity: 0; }
      }
      .spinning-exit {
        animation: spinAndExit 0.3s forwards ease-in-out;
      }
      @keyframes flickerGlow {
        0%, 100% {
          opacity: 1;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.1);
        }
        50% {
          opacity: 0.7;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.2);
        }
        25%, 75% {
          opacity: 0.9;
        }
      }
      @keyframes wink-effect {
        0% { transform: scale(1); box-shadow: 0 0 25px rgba(255, 165, 0, 0.4); }
        50% { transform: scale(1.1); box-shadow: 0 0 50px rgba(255, 215, 0, 0.8); }
        100% { transform: scale(1); box-shadow: 0 0 25px rgba(255, 165, 0, 0.4); }
      }
      .wink-effect {
        animation: wink-effect 3.4s ease-in-out;
      }
    `}</style>
    </div>
  )
}

// --- COMPONENTES ---
const Header = ({ theme, setTheme, onGoHome, onToggleStopwatch, onToggleMusic, onOpenAIChat }) => (
  <header
    className={`flex justify-between items-center p-4 sticky top-0 z-30 backdrop-blur-sm ${
      theme === "dark" ? "bg-gray-900/80 text-white" : "bg-white/80 text-gray-800 border-b border-gray-200"
    }`}
  >
    <div onClick={onGoHome} className="cursor-pointer">
      <h1 className="text-2xl font-bold tracking-tighter">
        <span className="text-cyan-400">Power</span>Building
      </h1>
      <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>By Julio Contreras</p>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={onOpenAIChat}
        className={`p-2 rounded-full transition-colors ${
          theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        <Sparkles className="w-5 h-5 text-purple-400" />
      </button>
      <button
        onClick={onToggleMusic}
        className={`p-2 rounded-full transition-colors ${
          theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        <Music className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleStopwatch}
        className={`p-2 rounded-full transition-colors ${
          theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        <Clock className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`p-2 rounded-full transition-colors ${
          theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {theme === "dark" ? <Sun className="text-yellow-400" /> : <Moon className="text-cyan-400" />}
      </button>
    </div>
  </header>
)

const CalendarView = ({ selectedDate, onDaySelect, history, theme }) => {
  const [viewDate, setViewDate] = useState(selectedDate)
  const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"]

  const changeMonth = (offset) => {
    setViewDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(1)
      newDate.setMonth(newDate.getMonth() + offset)
      return newDate
    })
  }

  const renderCalendarGrid = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const grid = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`}></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      const dateString = toYYYYMMDD(currentDate)
      const isToday = dateString === toYYYYMMDD(new Date())
      const isSelected = dateString === toYYYYMMDD(selectedDate)
      const dayKey = getDayKeyFromDate(currentDate)
      const dayInfo = initialWorkoutData[dayKey]
      const hasHistory = !!history[dateString]

      let dayClasses = `p-2 text-center rounded-lg cursor-pointer transition-all duration-200 w-10 h-10 flex items-center justify-center relative font-medium`

      if (theme === "light") {
        if (isSelected) {
          dayClasses += " bg-cyan-500 text-white font-bold scale-110 shadow-lg shadow-cyan-400/40"
        } else if (isToday) {
          dayClasses += " bg-sky-200 text-sky-700 font-bold border-2 border-sky-500"
        } else {
          dayClasses += " bg-white text-gray-600 hover:bg-sky-100 hover:shadow-md shadow-sm"
        }
      } else {
        if (isSelected) {
          dayClasses += " bg-blue-600 text-white font-bold scale-110 shadow-lg shadow-blue-500/30"
        } else if (isToday) {
          dayClasses += " border-2 border-blue-500 bg-gray-800"
        } else {
          dayClasses += " bg-gray-700 text-gray-300 hover:bg-gray-600"
        }
      }

      grid.push(
        <div key={day} className={dayClasses} onClick={() => onDaySelect(currentDate)}>
          {day}
          {hasHistory && (
            <div
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: dayInfo?.color }}
            ></div>
          )}
        </div>,
      )
    }

    return grid
  }

  return (
    <div className={`p-4 rounded-b-2xl ${theme === "dark" ? "bg-gray-800 text-white" : "bg-slate-100 text-slate-800"}`}>
      <div className="flex justify-between items-center mb-4 px-2">
        <button
          onClick={() => changeMonth(-1)}
          className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-bold text-xl capitalize">
          {viewDate.toLocaleString("es-ES", { month: "long", year: "numeric" })}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div
        className={`grid grid-cols-7 gap-2 text-center text-sm ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        } mb-2 font-semibold`}
      >
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 gap-x-2 place-items-center">{renderCalendarGrid()}</div>
    </div>
  )
}

const WorkoutDay = ({ day, data, onUpdate, onComplete, isCompleted, theme, setEditingExercise, isPast }) => {
  if (!data) return <div className="p-4 text-center">Selecciona un día en el calendario.</div>

  return (
    <div className="p-4 sm:p-6">
      <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} capitalize mb-4`}>
        {day} - {data.title}
      </h2>

      {data.exercises &&
        data.exercises.map((ex) => (
          <EditableExercise
            key={ex.id}
            exercise={ex}
            theme={theme}
            setEditingExercise={setEditingExercise}
            isPast={isPast}
          />
        ))}

      {data.sections &&
        Object.entries(data.sections).map(([title, exercises]) => (
          <div key={title}>
            <h3
              className={`font-bold text-lg ${
                theme === "dark" ? "text-cyan-400" : "text-cyan-600"
              } mt-6 mb-2 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} pb-2`}
            >
              {title}
            </h3>
            {exercises.map((ex) => (
              <EditableExercise
                key={ex.id}
                exercise={{ ...ex, section: title }}
                theme={theme}
                setEditingExercise={setEditingExercise}
                isPast={isPast}
              />
            ))}
          </div>
        ))}

      <div className="mt-6">
        <h3
          className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-700"} mb-2 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          } pb-2 flex items-center`}
        >
          <MessageSquare className="w-5 h-5 mr-2 text-gray-400" />
          Comentarios y Sensaciones
        </h3>
        <textarea
          value={data.dayNotes || ""}
          onChange={(e) => onUpdate("dayNotes", e.target.value)}
          placeholder="¿Cómo te has sentido hoy? ¿Has dormido bien? Anota cualquier cosa relevante..."
          disabled={isPast}
          className={`w-full h-24 p-2 border rounded-lg mt-2 transition-colors ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white focus:ring-cyan-400 focus:border-cyan-400"
              : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          } disabled:opacity-50`}
        />
      </div>

      <div className="mt-6">
        <button
          onClick={onComplete}
          disabled={isCompleted || isPast}
          className="w-full text-center bg-green-500 text-white font-bold py-3 px-4 rounded-xl cursor-pointer hover:bg-green-600 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {isCompleted ? "Entrenamiento Guardado" : "Marcar como Completado"}
        </button>
      </div>
    </div>
  )
}

const EditableExercise = ({ exercise, theme, setEditingExercise, isPast }) => {
  return (
    <div
      onClick={!isPast ? () => setEditingExercise(exercise) : undefined}
      className={`${
        theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white shadow-sm hover:bg-gray-50"
      } p-4 rounded-xl mb-3 ${isPast ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>{exercise.name}</p>
      {exercise.notes && <p className="text-xs text-gray-500 italic mt-1">{exercise.notes}</p>}
      <div className="flex items-center justify-around mt-3 space-x-2">
        {"weight" in exercise && (
          <div className="flex flex-col items-center">
            <label className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-1`}>Peso (kg)</label>
            <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{exercise.weight}</p>
          </div>
        )}
        {"sets" in exercise && (
          <div className="flex flex-col items-center">
            <label className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-1`}>Series</label>
            <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{exercise.sets}</p>
          </div>
        )}
        {"reps" in exercise && (
          <div className="flex flex-col items-center">
            <label className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-1`}>Reps</label>
            <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{exercise.reps}</p>
          </div>
        )}
      </div>
      {exercise.sensations && (
        <div
          className={`mt-3 pt-2 border-t flex items-center gap-2 ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <MessageSquare size={14} className="text-cyan-400 flex-shrink-0" />
          <p className={`text-xs italic truncate ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {exercise.sensations}
          </p>
        </div>
      )}
    </div>
  )
}

const EditExerciseModal = ({ exercise, onSave, onClose, theme }) => {
  const [data, setData] = useState(exercise)

  useEffect(() => {
    setData(exercise)
  }, [exercise])

  const handleSave = () => {
    onSave(data)
    onClose()
  }

  const inputClasses =
    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } p-6 rounded-2xl shadow-xl w-full max-w-sm`}
      >
        <h3 className="text-lg font-bold mb-4">Editar {stat?.label}</h3>
        <div className="flex flex-col">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`p-2 rounded-lg ${inputClasses}`}
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={() => onSave(stat?.key, value)}
            className="bg-cyan-400 text-gray-900 font-bold py-2 px-4 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

const EditNameModal = ({ theme, onClose, onSave, currentName }) => {
  const [name, setName] = useState(currentName)

  const inputClasses =
    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } p-6 rounded-2xl shadow-xl w-full max-w-sm`}
      >
        <h3 className="text-lg font-bold mb-4">Editar Nombre</h3>
        <div className="flex flex-col">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`p-2 rounded-lg ${inputClasses}`}
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 rounded-lg">
            Cancelar
          </button>
          <button onClick={() => onSave(name)} className="bg-cyan-400 text-gray-900 font-bold py-2 px-4 rounded-lg">
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

const ProfilePicModal = ({ profilePic, onClose, onSave, theme }) => {
  if (!profilePic) return null

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onSave(e.target.result)
        onClose()
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={profilePic || "/placeholder.svg"}
          alt="Foto de perfil"
          className="w-full h-auto object-contain rounded-t-2xl flex-grow"
        />
        <div className="p-4 flex justify-between items-center">
          <label
            htmlFor="change-profile-pic"
            className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer hover:bg-cyan-600 transition-colors"
          >
            Cambiar Foto
          </label>
          <input id="change-profile-pic" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

const Stopwatch = ({ onClose, theme }) => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const timerRef = useRef(null)

  const backgroundImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-16wXETboIwvRKYpy04U0ZCnbtfNWyF.png"

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10)
      }, 10)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRunning])

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  const handleLapReset = () => {
    if (isRunning) {
      setLaps([...laps, time])
    } else {
      setTime(0)
      setLaps([])
    }
  }

  const formatTime = (t) => {
    const minutes = `0${Math.floor((t / 60000) % 60)}`.slice(-2)
    const seconds = `0${Math.floor((t / 1000) % 60)}`.slice(-2)
    const milliseconds = `0${Math.floor((t / 10) % 100)}`.slice(-2)
    return { minutes, seconds, milliseconds }
  }

  const { minutes, seconds, milliseconds } = formatTime(time)

  // Calculate progress for the circular ring (reset every minute for visual appeal)
  const progressPercentage = ((time % 60000) / 60000) * 100
  const circumference = 2 * Math.PI * 120 // radius of 120
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-40" onClick={onClose}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          filter: "blur(8px)",
        }}
      />

      <div
        className={`relative w-full max-w-sm mx-auto flex flex-col items-center justify-center p-8 rounded-3xl backdrop-blur-xl border bg-slate-50 ${
          theme === "dark"
            ? "bg-gray-900/20 border-gray-700/30 text-white shadow-2xl"
            : "bg-white/20 border-gray-200/30 text-black shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            theme === "dark"
              ? "bg-gray-800/50 hover:bg-gray-700/70 text-gray-300"
              : "bg-gray-200/50 hover:bg-gray-300/70 text-gray-600"
          }`}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className={`text-lg font-bold mb-8 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
          {isRunning ? "ENTRENANDO" : "CRONÓMETRO"}
        </h2>

        {/* Circular Progress Ring */}
        <div className="relative mb-12">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256">
            {/* Background Circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke={theme === "dark" ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.3)"}
              strokeWidth="8"
              fill="none"
            />

            {/* Progress Circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100 ease-out"
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-4xl font-bold tracking-wider mb-1">
                {minutes}:{seconds}
              </div>
              <div className="font-mono text-lg opacity-70">.{milliseconds}</div>
              <div className="text-xs opacity-50 mt-2 uppercase tracking-wider">
                {laps.length > 0 ? `Vuelta ${laps.length + 1}` : "Tiempo"}
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center space-x-12 mb-8">
          {/* Lap/Reset Button */}
          <button
            onClick={handleLapReset}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
              theme === "dark"
                ? "bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/60 text-gray-300"
                : "bg-gray-200/50 border-gray-300/50 hover:bg-gray-300/60 text-gray-700"
            }`}
          >
            {isRunning ? <Flag size={20} /> : <RotateCcw size={20} />}
          </button>

          {/* Start/Pause Button */}
          <button
            onClick={handleStartPause}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
              isRunning
                ? "bg-red-500 hover:bg-red-400 border-2 border-red-400"
                : "bg-cyan-500 hover:bg-cyan-400 border-2 border-cyan-400"
            } text-white`}
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>

          {/* Settings/Info Button */}
          <button
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
              theme === "dark"
                ? "bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/60 text-gray-300"
                : "bg-gray-200/50 border-gray-300/50 hover:bg-gray-300/60 text-gray-700"
            }`}
          >
            <Clock size={20} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between w-full mb-6 px-4">
          <div className="text-center">
            <div className={`text-xs uppercase tracking-wider ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Vueltas
            </div>
            <div className="text-lg font-bold">{laps.length}</div>
          </div>
          <div className="text-center">
            <div className={`text-xs uppercase tracking-wider ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Estado
            </div>
            <div className={`text-lg font-bold ${isRunning ? "text-green-400" : "text-gray-500"}`}>
              {isRunning ? "Activo" : "Parado"}
            </div>
          </div>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="w-full">
            <div className="max-h-24 overflow-y-auto space-y-1">
              {laps.slice(-3).map((lap, index) => {
                const lapTime = formatTime(lap)
                const actualIndex = laps.length - 3 + index
                return (
                  <div
                    key={actualIndex}
                    className={`flex justify-between items-center p-2 rounded-lg text-sm ${
                      theme === "dark" ? "bg-gray-800/30" : "bg-gray-100/30"
                    }`}
                  >
                    <span className="opacity-70">Vuelta {actualIndex + 1}</span>
                    <span className="font-mono">
                      {lapTime.minutes}:{lapTime.seconds}.{lapTime.milliseconds}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- COMPONENTE RAÍZ DE LA APP ---
export default function App() {
  const [appState, setAppState] = useState("splash")
  const [isFading, setIsFading] = useState(false)

  const handleEnterApp = () => {
    setIsFading(true)
    setTimeout(() => setAppState("main"), 2500)
  }

  const handleGoHome = () => {
    setAppState("splash")
    setIsFading(false)
  }

  if (appState === "splash") {
    return (
      <div className="bg-black w-full h-screen">
        <SplashScreen onEnter={handleEnterApp} isFading={isFading} />
      </div>
    )
  }

  return <MainApp onGoHome={handleGoHome} />
}

// --- COMPONENTE PRINCIPAL DE LA APP ---
function MainApp({ onGoHome }) {
  const [theme, setTheme] = useState("dark")
  const [activeTab, setActiveTab] = useState("Rutina")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [history, setHistory] = useState({})
  const [editingExercise, setEditingExercise] = useState(null)
  const [editingStat, setEditingStat] = useState(null)
  const [isStopwatchVisible, setIsStopwatchVisible] = useState(false)
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false)
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false)
  const [isAIChatModalOpen, setIsAIChatModalOpen] = useState(false) // New state for AI chat modal

  // Estados para la sección de rendimiento
  const [stats, setStats] = useState({ altura: "178", peso: "75", edad: "36" })
  const [notes, setNotes] = useState("")
  const [biohackingNotes, setBiohackingNotes] = useState("")
  const [profilePic, setProfilePic] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png",
  )
  const [userName, setUserName] = useState("JULIO CONTRERAS")

  // Estados para la sección de nutrición
  const [nutritionData, setNutritionData] = useState({})
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2500,
    protein: 180,
    carbs: 300,
    fat: 70,
  })
  const [customFoods, setCustomFoods] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNutritionData = localStorage.getItem("nutritionData")
    if (savedNutritionData) {
      setNutritionData(JSON.parse(savedNutritionData))
    }
    const savedNutritionGoals = localStorage.getItem("nutritionGoals")
    if (savedNutritionGoals) {
      setNutritionGoals(JSON.parse(savedNutritionGoals))
    }
    const savedCustomFoods = localStorage.getItem("customFoods")
    if (savedCustomFoods) {
      setCustomFoods(JSON.parse(savedCustomFoods))
    }
    const savedHistory = localStorage.getItem("workoutHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    const savedStats = localStorage.getItem("userStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
    const savedNotes = localStorage.getItem("userNotes")
    if (savedNotes) {
      setNotes(savedNotes)
    }
    const savedBiohackingNotes = localStorage.getItem("biohackingNotes")
    if (savedBiohackingNotes) {
      setBiohackingNotes(savedBiohackingNotes)
    }
    const savedProfilePic = localStorage.getItem("profilePic")
    if (savedProfilePic) {
      setProfilePic(savedProfilePic)
    }
    const savedUserName = localStorage.getItem("userName")
    if (savedUserName) {
      setUserName(savedUserName)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nutritionData", JSON.stringify(nutritionData))
  }, [nutritionData])

  useEffect(() => {
    localStorage.setItem("nutritionGoals", JSON.stringify(nutritionGoals))
  }, [nutritionGoals])

  useEffect(() => {
    localStorage.setItem("customFoods", JSON.stringify(customFoods))
  }, [customFoods])

  useEffect(() => {
    localStorage.setItem("workoutHistory", JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem("userStats", JSON.stringify(stats))
  }, [stats])

  useEffect(() => {
    localStorage.setItem("userNotes", notes)
  }, [notes])

  useEffect(() => {
    localStorage.setItem("biohackingNotes", biohackingNotes)
  }, [biohackingNotes])

  useEffect(() => {
    localStorage.setItem("profilePic", profilePic)
  }, [profilePic])

  useEffect(() => {
    localStorage.setItem("userName", userName)
  }, [userName])

  // Swipe Navigation Logic
  const mainContentRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const tabOrder = ["Rutina", "Rendimiento", "Nutrición", "Técnica", "Guía"]

  useEffect(() => {
    const mainElement = mainContentRef.current
    if (!mainElement) return

    const handleTouchStart = (e) => {
      touchStartX.current = e.targetTouches[0].clientX
      touchEndX.current = e.targetTouches[0].clientX
    }

    const handleTouchMove = (e) => {
      touchEndX.current = e.targetTouches[0].clientX
    }

    const handleTouchEnd = () => {
      const swipeDistance = touchStartX.current - touchEndX.current
      const swipeThreshold = 50

      if (Math.abs(swipeDistance) < swipeThreshold) {
        return
      }

      const currentTabIndex = tabOrder.indexOf(activeTab)
      if (swipeDistance > 0) {
        if (currentTabIndex < tabOrder.length - 1) {
          setActiveTab(tabOrder[currentTabIndex + 1])
        }
      } else {
        if (currentTabIndex > 0) {
          setActiveTab(tabOrder[currentTabIndex - 1])
        }
      }
    }

    mainElement.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    })
    mainElement.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    })
    mainElement.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      mainElement.removeEventListener("touchstart", handleTouchStart)
      mainElement.removeEventListener("touchmove", handleTouchMove)
      mainElement.removeEventListener("touchend", handleTouchEnd)
    }
  }, [activeTab, tabOrder])

  useEffect(() => {
    const dateString = toYYYYMMDD(selectedDate)
    const dayKey = getDayKeyFromDate(selectedDate)

    if (!initialWorkoutData[dayKey]) {
      setActiveWorkout(null)
      return
    }

    const templateForDay = JSON.parse(JSON.stringify(initialWorkoutData[dayKey]))

    const workoutFromHistory = history[dateString]
    if (workoutFromHistory) {
      templateForDay.dayNotes = workoutFromHistory.dayNotes || ""
    }

    setActiveWorkout(templateForDay)
  }, [history, selectedDate])

  const handleUpdateDayNotes = (field, value) => {
    setActiveWorkout((prev) => {
      const newWorkout = JSON.parse(JSON.stringify(prev))
      if (field === "dayNotes") {
        newWorkout.dayNotes = value
      }
      return newWorkout
    })
  }

  const handleSaveExercise = (updatedExercise) => {
    setActiveWorkout((prev) => {
      const newWorkout = JSON.parse(JSON.stringify(prev))
      const findAndReplace = (list) => {
        if (!list) return false
        const index = list.findIndex((ex) => ex.id === updatedExercise.id)
        if (index > -1) {
          list[index] = updatedExercise
          return true
        }
        return false
      }

      if (newWorkout.exercises && findAndReplace(newWorkout.exercises)) return newWorkout
      if (newWorkout.sections) {
        for (const sectionKey in newWorkout.sections) {
          if (newWorkout.sections[sectionKey] && findAndReplace(newWorkout.sections[sectionKey])) return newWorkout
        }
      }
      return prev
    })
  }

  const handleCompleteWorkout = () => {
    const dateString = toYYYYMMDD(selectedDate)
    if (!activeWorkout) return

    const { icon, color, ...workoutToSave } = activeWorkout
    setHistory((prev) => ({ ...prev, [dateString]: workoutToSave }))
  }

  const handleSaveBackup = () => {
    const appData = {
      history,
      stats,
      notes,
      biohackingNotes,
      profilePic,
      userName,
      nutritionData, // Include nutrition data
      nutritionGoals, // Include nutrition goals
      customFoods, // Include custom foods
    }
    const json = JSON.stringify(appData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `powerbuilding_backup_${toYYYYMMDD(new Date())}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert("Copia de seguridad creada con éxito!")
  }

  const handleRestoreBackup = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const restoredData = JSON.parse(e.target.result)
            setHistory(restoredData.history || {})
            setStats(restoredData.stats || { altura: "178", peso: "75", edad: "36" })
            setNotes(restoredData.notes || "")
            setBiohackingNotes(restoredData.biohackingNotes || "")
            setProfilePic(
              restoredData.profilePic ||
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png",
            )
            setUserName(restoredData.userName || "JULIO CONTRERAS")
            setNutritionData(restoredData.nutritionData || {}) // Restore nutrition data
            setNutritionGoals(restoredData.nutritionGoals || { calories: 2500, protein: 180, carbs: 300, fat: 70 }) // Restore nutrition goals
            setCustomFoods(restoredData.customFoods || []) // Restore custom foods
            alert("Datos restaurados con éxito!")
          } catch (error) {
            alert("Error al restaurar la copia de seguridad: " + error.message)
            console.error("Error restoring backup:", error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  // Consolidate all relevant app data for the AI
  const allAppData = {
    userName,
    stats,
    notes,
    biohackingNotes,
    workoutHistory: history,
    nutritionData,
    nutritionGoals,
    customFoods,
  }

  const renderContent = () => {
    const isPast = toYYYYMMDD(selectedDate) < toYYYYMMDD(new Date())

    switch (activeTab) {
      case "Rendimiento":
        return (
          <PerformanceSection
            theme={theme}
            stats={stats}
            setEditingStat={setEditingStat}
            profilePic={profilePic}
            setIsProfilePicModalOpen={setIsProfilePicModalOpen}
            notes={notes}
            setNotes={setNotes}
            biohackingNotes={biohackingNotes}
            setBiohackingNotes={setBiohackingNotes}
            userName={userName}
            setIsEditNameModalOpen={setIsEditNameModalOpen}
          />
        )
      case "Nutrición":
        return (
          <NutritionSection
            theme={theme}
            nutritionData={nutritionData}
            setNutritionData={setNutritionData}
            goals={nutritionGoals}
            setGoals={setNutritionGoals} // Declare the setGoals variable
            customFoods={customFoods}
            setCustomFoods={setCustomFoods}
          />
        )
      case "Técnica":
        return <TechniqueGuideSection theme={theme} />
      case "Guía":
        return <GuideSection theme={theme} onSaveBackup={handleSaveBackup} onRestoreBackup={handleRestoreBackup} />
      default:
        return (
          <>
            <div className="px-4 pt-4">
              <CalendarView selectedDate={selectedDate} onDaySelect={setSelectedDate} history={history} theme={theme} />
            </div>
            <WorkoutDay
              day={selectedDate.toLocaleString("es-ES", { weekday: "long" })}
              data={activeWorkout}
              onUpdate={handleUpdateDayNotes}
              onComplete={handleCompleteWorkout}
              isCompleted={!!history[toYYYYMMDD(selectedDate)]}
              theme={theme}
              setEditingExercise={setEditingExercise}
              isPast={isPast}
            />
          </>
        )
    }
  }

  const NavButton = ({ tabName, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex flex-col items-center justify-center pb-14 w-full pt-6 transition-colors duration-300 ${
        activeTab === tabName ? "text-cyan-400" : theme === "dark" ? "text-gray-400" : "text-gray-500"
      } hover:text-cyan-400`}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )

  return (
    <div
      className={`w-full h-screen font-sans transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-md mx-auto h-full shadow-2xl overflow-hidden flex flex-col ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Header
          theme={theme}
          setTheme={setTheme}
          onGoHome={onGoHome}
          onToggleStopwatch={() => setIsStopwatchVisible(true)}
          onToggleMusic={() => setActiveTab("Música")}
          onOpenAIChat={() => setIsAIChatModalOpen(true)} // Open AI chat modal
        />

        <main ref={mainContentRef} className="flex-grow overflow-y-auto pb-40">
          {renderContent()}
        </main>

        <footer
          className={`w-full border-t backdrop-blur-sm fixed bottom-0 left-0 right-0 max-w-md mx-auto ${
            theme === "dark" ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"
          }`}
        >
          <nav className="flex justify-around items-center">
            <NavButton tabName="Rutina" icon={Calendar} label="Rutina" />
            <NavButton tabName="Rendimiento" icon={BarChart2} label="Rendimiento" />
            <NavButton tabName="Nutrición" icon={UtensilsCrossed} label="Nutrición" />
            <NavButton tabName="Técnica" icon={Video} label="Técnica" />
            <NavButton tabName="Guía" icon={BookOpen} label="Guía" />
          </nav>
        </footer>

        {isStopwatchVisible && <Stopwatch theme={theme} onClose={() => setIsStopwatchVisible(false)} />}

        {editingExercise && (
          <EditExerciseModal
            exercise={editingExercise}
            onClose={() => setEditingExercise(null)}
            onSave={handleSaveExercise}
            theme={theme}
          />
        )}

        {editingStat && (
          <EditStatModal
            stat={editingStat}
            onClose={() => setEditingStat(null)}
            onSave={(key, value) => {
              setStats((prevStats) => ({ ...prevStats, [key]: value }))
              setEditingStat(null)
            }}
            theme={theme}
          />
        )}

        {isEditNameModalOpen && (
          <EditNameModal
            theme={theme}
            currentName={userName}
            onClose={() => setIsEditNameModalOpen(false)}
            onSave={(newName) => {
              setUserName(newName)
              setIsEditNameModalOpen(false)
            }}
          />
        )}

        {isProfilePicModalOpen && (
          <ProfilePicModal
            profilePic={profilePic}
            theme={theme}
            onClose={() => setIsProfilePicModalOpen(false)}
            onSave={setProfilePic}
          />
        )}

        {isAIChatModalOpen && (
          <AIChatModal
            theme={theme}
            onClose={() => setIsAIChatModalOpen(false)}
            appData={allAppData} // Pass all relevant app data to the AI modal
          />
        )}
      </div>
    </div>
  )
}

const EditStatModal = ({ stat, onClose, onSave, theme }) => {
  const [value, setValue] = useState(stat?.value || "")

  const inputClasses =
    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } p-6 rounded-2xl shadow-xl w-full max-w-sm`}
      >
        <h3 className="text-lg font-bold mb-4">Editar {stat?.label}</h3>
        <div className="flex flex-col">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`p-2 rounded-lg ${inputClasses}`}
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={() => onSave(stat?.key, value)}
            className="bg-cyan-400 text-gray-900 font-bold py-2 px-4 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
