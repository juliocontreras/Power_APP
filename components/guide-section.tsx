"use client"

import { useState } from "react"
import {
  BookOpen,
  Sun,
  Video,
  ChevronDown,
  HardDrive,
  User,
  MessageSquare,
  Clock,
  Music,
  ArrowRightLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button" // Assuming shadcn button

const GuideSection = ({ theme, onSaveBackup, onRestoreBackup }) => {
  const [isCollapsed, setIsCollapsed] = useState({
    implementations: true,
    technologies: true,
  })

  const toggleCollapse = (section) => {
    setIsCollapsed((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const mikeMentzerImage =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png"

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <BookOpen className={`w-7 h-7 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
        <div>
          <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Guía y Motivación
          </h2>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Tu plan para seguir mejorando.</p>
        </div>
      </div>

      {/* Regla de oro */}
      <div className={`p-4 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
        <div className="flex items-center mb-2">
          <Sun className="w-5 h-5 text-yellow-400 mr-2" />
          <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Regla de oro:</h3>
        </div>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Si en un ejercicio de fuerza (2x5 o 3x5) llegas a 8 o 9 reps con buena técnica, ¡es momento de subir peso!
        </p>
      </div>

      {/* Filosofía Heavy Duty */}
      <div className={`p-4 rounded-2xl text-center ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
        <img
          src={mikeMentzerImage || "/placeholder.svg"}
          alt="Mike Mentzer"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-cyan-400"
        />
        <h3 className={`font-bold text-xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Filosofía Heavy Duty
        </h3>
        <p className={`text-sm font-semibold mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Por Mike Mentzer
        </p>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-6`}>
          El entrenamiento debe ser breve, infrecuente y de alta intensidad. El objetivo es llevar cada serie al fallo
          muscular momentáneo, estimulando así el crecimiento de la forma más eficiente posible. Menos es más, siempre
          que la intensidad sea máxima.
        </p>
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 mr-2" />
          Ver Shorts Mike Mentzer
        </Button>
      </div>

      {/* Copia de Seguridad */}
      <div className={`p-4 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
        <h3 className={`font-bold text-lg mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Copia de Seguridad
        </h3>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}>
          Guarda o restaura todos tus datos. La copia se guardará como un archivo .json.
        </p>
        <div className="flex space-x-4">
          <Button
            onClick={onSaveBackup}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <HardDrive className="w-5 h-5 mr-2" />
            Crear Backup
          </Button>
          <Button
            onClick={onRestoreBackup}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <HardDrive className="w-5 h-5 mr-2" />
            Restaurar Backup
          </Button>
        </div>
      </div>

      {/* Últimas Implementaciones */}
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} p-4 rounded-2xl`}>
        <div
          onClick={() => toggleCollapse("implementations")}
          className="flex justify-between items-center cursor-pointer"
        >
          <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Últimas Implementaciones
          </h3>
          <ChevronDown
            className={`transform transition-transform duration-300 ${isCollapsed.implementations ? "" : "rotate-180"}`}
          />
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isCollapsed.implementations ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
          }`}
        >
          <ul className={`mt-4 space-y-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            <li className="flex items-center">
              <ArrowRightLeft className="w-4 h-4 mr-2 text-cyan-400" /> Navegación por deslizamiento entre pestañas.
            </li>
            <li className="flex items-center">
              <User className="w-4 h-4 mr-2 text-cyan-400" /> Nombre de usuario editable.
            </li>
            <li className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" /> Campo "Sensaciones" en cada ejercicio.
            </li>
            <li className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-cyan-400" /> Controles +/- 10s en el reproductor de música.
            </li>
            <li className="flex items-center">
              <Music className="w-4 h-4 mr-2 text-cyan-400" /> Nuevas listas de reproducción añadidas.
            </li>
            <li className="flex items-center">
              <HardDrive className="w-4 h-4 mr-2 text-cyan-400" /> Sistema de backup manual y automático al salir.
            </li>
          </ul>
        </div>
      </div>

      {/* Tecnologías Usadas */}
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} p-4 rounded-2xl`}>
        <div
          onClick={() => toggleCollapse("technologies")}
          className="flex justify-between items-center cursor-pointer"
        >
          <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Tecnologías Usadas</h3>
          <ChevronDown
            className={`transform transition-transform duration-300 ${isCollapsed.technologies ? "" : "rotate-180"}`}
          />
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isCollapsed.technologies ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
          }`}
        >
          <ul className={`mt-4 space-y-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            <li className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              React: 18.2.0
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              TailwindCSS: 3.3.3
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-gradient-to-r from-orange-400 to-red-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              Lucide-React: 0.279.0
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">📊</span>
              </div>
              Recharts: 2.8.0
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">JS</span>
              </div>
              JS (ES6+), HTML5, CSS3
            </li>
          </ul>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  )
}

export default GuideSection
