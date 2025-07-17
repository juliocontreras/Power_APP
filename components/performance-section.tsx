"use client"

import { useState } from "react"
import { ChevronDown, Ruler, Weight, Gift, MessageSquare } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const PerformanceSection = ({
  theme,
  stats,
  setEditingStat,
  profilePic,
  setIsProfilePicModalOpen,
  notes,
  setNotes,
  biohackingNotes,
  setBiohackingNotes,
  userName,
  setIsEditNameModalOpen,
}) => {
  const [isCollapsed, setIsCollapsed] = useState({
    gallery: true,
    notes: false,
    biohacking: false,
  })

  if (!stats) return null

  const toggleCollapse = (section) => {
    setIsCollapsed((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Datos del gráfico de fuerza muscular
  const muscleGroupData = [
    { name: "Hombros", maxWeight: 45 },
    { name: "Espalda", maxWeight: 62 },
    { name: "Pectoral", maxWeight: 65 },
    { name: "Piernas", maxWeight: 150 },
    { name: "Bíceps", maxWeight: 35 },
    { name: "Tríceps", maxWeight: 15 },
    { name: "Core", maxWeight: 0 },
  ]

  return (
    <>
      <style jsx>{`
        @keyframes subtleGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(22, 163, 222, 0.4), 0 0 5px rgba(22, 163, 222, 0.3); 
          }
          50% { 
            box-shadow: 0 0 25px rgba(22, 163, 222, 0.6), 0 0 15px rgba(22, 163, 222, 0.4); 
          }
        }
      `}</style>

      <div className="p-4 space-y-6 relative">
        {/* Sección de Perfil */}
        <div className="flex items-center space-x-4">
          <img
            src={
              profilePic ||
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MrVCY7SBoYWuNslxF6xCDo9t99hxcQ.png" ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt="Perfil"
            className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover cursor-pointer"
            style={{ animation: "subtleGlow 4s ease-in-out infinite" }}
            onClick={() => setIsProfilePicModalOpen(true)}
          />
          <div>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>WELCOME VIKING,</p>
            <div onClick={() => setIsEditNameModalOpen(true)} className="cursor-pointer">
              <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"} flex items-center`}>
                {userName} <span className="ml-2">👋</span>
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div
            onClick={() =>
              setEditingStat({
                key: "altura",
                value: stats.altura,
                label: "Altura",
              })
            }
            className={`p-4 rounded-2xl cursor-pointer ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}
          >
            <Ruler className="mx-auto text-blue-400" size={24} />
            <p className={`mt-2 text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {stats.altura}
              <span className="text-sm text-gray-400"> cm</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Altura</p>
          </div>

          <div
            onClick={() => setEditingStat({ key: "peso", value: stats.peso, label: "Peso" })}
            className={`p-4 rounded-2xl cursor-pointer ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}
          >
            <Weight className="mx-auto text-orange-400" size={24} />
            <p className={`mt-2 text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {stats.peso}
              <span className="text-sm text-gray-400"> kg</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Peso</p>
          </div>

          <div
            onClick={() => setEditingStat({ key: "edad", value: stats.edad, label: "Edad" })}
            className={`p-4 rounded-2xl cursor-pointer ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}
          >
            <Gift className="mx-auto text-green-400" size={24} />
            <p className={`mt-2 text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {stats.edad}
            </p>
            <p className="text-xs text-gray-500 mt-1">Edad</p>
          </div>
        </div>

        {/* Gráfico de Análisis de Fuerza */}
        <div className={`p-4 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
          <h3 className={`font-bold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Análisis de Fuerza por Grupo Muscular
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={muscleGroupData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
              />
              <XAxis
                dataKey="name"
                stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} fontSize={10} />
              <Bar dataKey="maxWeight" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Galería de Progreso */}
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} p-4 rounded-2xl`}>
          <div onClick={() => toggleCollapse("gallery")} className="flex justify-between items-center cursor-pointer">
            <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Galería de Progreso
            </h3>
            <ChevronDown
              className={`transform transition-transform duration-300 ${isCollapsed.gallery ? "" : "rotate-180"}`}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isCollapsed.gallery ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
            }`}
          >
            <p className={`text-xs mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}>
              Hacer una foto semanal del progreso a nivel muscular de cuerpo completo.
            </p>
            {/* Aquí iría el contenido de la galería */}
          </div>
        </div>

        {/* Notas Personales */}
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} p-4 rounded-2xl`}>
          <div onClick={() => toggleCollapse("notes")} className="flex justify-between items-center cursor-pointer">
            <h3 className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-700"} flex items-center`}>
              <MessageSquare className="inline w-5 h-5 mr-2 text-gray-400" />
              Notas Personales
            </h3>
            <ChevronDown
              className={`transform transition-transform duration-300 ${isCollapsed.notes ? "" : "rotate-180"}`}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isCollapsed.notes ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
            }`}
          >
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anota tus metas, reflexiones o cualquier cosa importante..."
              className={`w-full h-24 p-2 border rounded-lg mt-4 transition-colors ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Técnicas Biohacking */}
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"} p-4 rounded-2xl`}>
          <div
            onClick={() => toggleCollapse("biohacking")}
            className="flex justify-between items-center cursor-pointer"
          >
            <h3 className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-700"} flex items-center`}>
              🧠 Técnicas Biohacking
            </h3>
            <ChevronDown
              className={`transform transition-transform duration-300 ${isCollapsed.biohacking ? "" : "rotate-180"}`}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isCollapsed.biohacking ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
            }`}
          >
            <textarea
              value={biohackingNotes}
              onChange={(e) => setBiohackingNotes(e.target.value)}
              placeholder="Rutinas de sueño, comida, bebidas energéticas naturales, ejercicios movilidad, auto fisio, etc..."
              className={`w-full h-24 p-2 border rounded-lg mt-4 transition-colors ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>
        </div>

        <br />
        <br />
        <br />
      </div>
    </>
  )
}

export default PerformanceSection
