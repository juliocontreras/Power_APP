"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateResponse(userPrompt: string, appData: any): Promise<string> {
  // Obtener la fecha actual en formato YYYY-MM-DD para que la IA entienda "hoy"
  const today = new Date()
  const currentYYYYMMDD = today.toISOString().split("T")[0]

  // Formatear el historial de entrenamientos para que la IA lo entienda fácilmente
  let formattedWorkoutHistory = "No hay historial de entrenamientos disponible."
  if (appData.workoutHistory && Object.keys(appData.workoutHistory).length > 0) {
    formattedWorkoutHistory = Object.entries(appData.workoutHistory)
      .map(([date, workout]: [string, any]) => {
        // Formatear ejercicios principales
        const exercises = workout.exercises
          ? workout.exercises
              .map((ex: any) => {
                let details = ex.name
                if (ex.weight) details += ` (${ex.weight}kg`
                if (ex.sets && ex.reps) details += `, ${ex.sets}x${ex.reps})`
                else if (ex.sets) details += `, ${ex.sets} series)`
                else if (ex.reps) details += `, ${ex.reps} repeticiones)`
                if (ex.sensations) details += ` - Sensaciones: "${ex.sensations}"`
                return details
              })
              .join(", ")
          : "N/A"

        // Formatear secciones adicionales (ABS / CORE, BÍCEPS, etc.)
        const sections = workout.sections
          ? Object.entries(workout.sections)
              .map(([secTitle, secExercises]: [string, any]) => {
                const secExDetails = secExercises
                  .map((ex: any) => {
                    let details = ex.name
                    if (ex.weight) details += ` (${ex.weight}kg`
                    if (ex.sets && ex.reps) details += `, ${ex.sets}x${ex.reps})`
                    else if (ex.sets) details += `, ${ex.sets} series)`
                    else if (ex.reps) details += `, ${ex.reps} repeticiones)`
                    if (ex.sensations) details += ` - Sensaciones: "${ex.sensations}"`
                    return details
                  })
                  .join(", ")
                return `${secTitle}: [${secExDetails}]`
              })
              .join("; ")
          : "N/A"

        const dayNotes = workout.dayNotes ? `Notas del día: "${workout.dayNotes}"` : "Sin notas del día."

        return `  - Fecha: ${date} (${workout.title}). Ejercicios: [${exercises}]. Secciones: [${sections}]. ${dayNotes}`
      })
      .join("\n")
  }

  // Formatear datos de nutrición para que la IA los entienda fácilmente
  let formattedNutritionData = "No hay datos de nutrición disponibles."
  if (appData.nutritionData && Object.keys(appData.nutritionData).length > 0) {
    formattedNutritionData = Object.entries(appData.nutritionData)
      .map(([date, dailyNutrition]: [string, any]) => {
        const meals = Object.entries(dailyNutrition)
          .map(([mealType, mealData]: [string, any]) => {
            const foods = mealData.foods
              ? mealData.foods
                  .map(
                    (food: any) =>
                      `${food.name} (${food.grams}g, ${food.calories.toFixed(0)}kcal, P:${food.protein.toFixed(1)}g, C:${food.carbs.toFixed(1)}g, F:${food.fat.toFixed(1)}g)`,
                  )
                  .join(", ")
              : "Ninguno"
            const notes = mealData.notes ? `Notas: "${mealData.notes}"` : "Sin notas"
            return `    - ${mealType}: [${foods}]. ${notes}`
          })
          .join("\n")
        return `  - Fecha: ${date}\n${meals}`
      })
      .join("\n")
  }

  const systemPrompt = `Eres un asistente de PowerBuilding. Tu objetivo es analizar los datos proporcionados por el usuario sobre su entrenamiento, nutrición y progreso, y ofrecerle consejos, análisis y respuestas personalizadas.

  Fecha actual: ${currentYYYYMMDD}

  Datos del usuario:
  - Nombre: ${appData.userName}
  - Estadísticas: ${JSON.stringify(appData.stats)}
  - Notas personales: ${appData.notes}
  - Notas biohacking: ${appData.biohackingNotes}
  - Objetivos de nutrición: ${JSON.stringify(appData.nutritionGoals)}
  - Alimentos personalizados: ${JSON.stringify(appData.customFoods)}

  Historial de entrenos (solo incluye entrenamientos que el usuario ha marcado como 'Completado'):
  ${formattedWorkoutHistory}

  Historial de nutrición (solo incluye datos de nutrición que el usuario ha guardado):
  ${formattedNutritionData}

  Instrucciones para el asistente:
  1. Utiliza el "Historial de entrenos" y el "Historial de nutrición" proporcionados para responder preguntas sobre entrenamientos y alimentación pasados.
  2. Si el usuario pregunta por "hoy", "ayer", "esta semana", "este mes" o una fecha específica (ej. "2025-07-16"), busca la información relevante en el historial.
  3. Si el historial es muy extenso y no puedes incluir todos los detalles, resume la información más relevante.
  4. **IMPORTANTE:** Si el usuario pregunta por una fecha o periodo y no encuentras información en el "Historial de entrenos" o "Historial de nutrición" para esa fecha, informa al usuario que no hay datos registrados para ese día y sugiere que podría ser porque el entrenamiento o la nutrición no fueron completados/guardados. Anímale a completar sus registros para que puedas ayudarle mejor.
  5. Si la pregunta no está relacionada con fitness o estos datos, indícale que tu función es ayudarle con su progreso en PowerBuilding.
  `

  const { text } = await generateText({
    model: openai(process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "gpt-3.5-turbo"),
    system: systemPrompt,
    prompt: userPrompt,
  })

  return text
}

// Nueva Server Action para generar audio con OpenAI TTS
export async function generateSpeechAudio(text: string): Promise<{ audioData?: Uint8Array; error?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OPENAI_API_KEY no está configurada. Por favor, configúrala en los ajustes de tu proyecto Vercel." }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1-hd", // Modelo de voz avanzada
        voice: "nova", // Puedes cambiar a "alloy", "shimmer", "onyx", "echo", "fable"
        input: text,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: response.statusText }))
      const errorMessage = errorBody.error?.message || errorBody.message || "Error desconocido de la API de OpenAI TTS."
      console.error("OpenAI TTS API error:", errorMessage)
      return { error: `Error de la API de OpenAI TTS: ${errorMessage}` }
    }

    const arrayBuffer = await response.arrayBuffer()
    return { audioData: new Uint8Array(arrayBuffer) }
  } catch (error) {
    console.error("Error en generateSpeechAudio Server Action:", error)
    return { error: `Error al generar audio de voz: ${(error as Error).message}` }
  }
}
