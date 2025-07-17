"use client"

import { useState } from "react"
import { VideoIcon, Play } from "lucide-react"

const youtubeThumbnailBaseUrl = "https://img.youtube.com/vi/"
const youtubeEmbedBaseUrl = "https://www.youtube.com/embed/"

const exerciseVideos = [
  {
    name: "Press militar con barra",
    videoId: "jpi8pC95ubY",
  },
  {
    name: "Dominadas supinas con lastre",
    videoId: "hDWIrVDItNQ",
  },
  {
    name: "Fondos en Paralelas",
    videoId: "IWGPCiRmrAY",
  },
  {
    name: "Remo con barra",
    videoId: "OXH-ecu-Obw",
  },
  {
    name: "Aperturas pectoral en máquina",
    videoId: "QHrIO139sWc",
  },
  {
    name: "Sentadillas con barra",
    videoId: "dsCuiccYNGs",
  },
  {
    name: "Peso muerto sumo",
    videoId: "Amqf_h1s4lw",
  },
  {
    name: "Prensa inclinada",
    videoId: "pl59okh_L1Q",
  },
  {
    name: "Gemelos en prensa",
    videoId: "mROxEgJV5D0",
  },
  {
    name: "Extensiones de cuádriceps",
    videoId: "39DQWIYb7-o",
  },
  {
    name: "Zancadas con mancuernas",
    videoId: "-iGRWD09Jn8",
  },
  {
    name: "Curl con barra z",
    videoId: "gGSLcJp6h18",
  },
  {
    name: "Curl inclinado con mancuernas",
    videoId: "DTdrS09aNA",
  },
  {
    name: "Extensión en polea alta",
    videoId: "1ob72BO4ot4",
  },
  {
    name: "Curl prono con barra",
    videoId: "4S3s9OPg_jU",
  },
  {
    name: "Curl de muñeca",
    videoId: "FHCO6TyLsSM",
  },
  {
    name: "Plancha frontal",
    videoId: "3AM7L2k7BEw",
  },
  {
    name: "Elevaciones de piernas",
    videoId: "pBC7ciQ5BMc",
  },
  {
    name: "Elevaciones colgado",
    videoId: "TUZa2u9_gGo",
  },
]

const VideoModal = ({ videoId, onClose, theme }) => {
  if (!videoId) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            theme === "dark"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } z-10`}
        >
          ✕
        </button>
        <div className="relative pt-[56.25%] w-full">
          {" "}
          {/* 16:9 Aspect Ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`${youtubeEmbedBaseUrl}${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

const TechniqueGuideSection = ({ theme }) => {
  const [selectedVideoId, setSelectedVideoId] = useState(null)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <VideoIcon className={`w-7 h-7 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
        <div>
          <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Guía de Técnica</h2>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Visualiza la forma correcta.</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-4">
        {exerciseVideos.map((video) => (
          <div
            key={video.videoId}
            className={`relative rounded-xl overflow-hidden cursor-pointer group ${
              theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
            }`}
            onClick={() => setSelectedVideoId(video.videoId)}
          >
            <img
              src={`${youtubeThumbnailBaseUrl}${video.videoId}/hqdefault.jpg`}
              alt={video.name}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-colors duration-300">
              <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div
              className={`p-3 text-center font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} text-sm`}
            >
              {video.name}
            </div>
          </div>
        ))}
      </div>

      {selectedVideoId && (
        <VideoModal videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} theme={theme} />
      )}
      <br />
      <br />
      <br />
    </div>
  )
}

export default TechniqueGuideSection
