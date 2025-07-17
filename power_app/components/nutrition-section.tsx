"use client"

import { useState, useMemo, useEffect } from "react"
import { PlusCircle, Trash2, Target, Search, Edit, ChevronLeft, ChevronRight, X } from "lucide-react"

// --- BASE DE DATOS DE ALIMENTOS (por 100g) ---
const foodDatabase = [
  { id: "f1", name: "Pechuga de Pollo", macros: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
  { id: "f2", name: "Arroz Blanco Cocido", macros: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 } },
  { id: "f3", name: "Huevo Entero", macros: { calories: 155, protein: 13, carbs: 1.1, fat: 11 } },
  { id: "f4", name: "Salmón", macros: { calories: 208, protein: 20, carbs: 0, fat: 13 } },
  { id: "f5", name: "Brócoli", macros: { calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 } },
  { id: "f6", name: "Avena en Hojuelas", macros: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 } },
  { id: "f7", name: "Carne de Res (Magra)", macros: { calories: 250, protein: 26, carbs: 0, fat: 15 } },
  { id: "f8", name: "Patata Cocida", macros: { calories: 87, protein: 2, carbs: 20.1, fat: 0.1 } },
  { id: "f9", name: "Aceite de Oliva", macros: { calories: 884, protein: 0, carbs: 0, fat: 100 } },
  { id: "f10", name: "Lentejas Cocidas", macros: { calories: 116, protein: 9, carbs: 20, fat: 0.4 } },
]

// --- FUNCIÓN UTILITARIA PARA FORMATEAR FECHAS ---
const toYYYYMMDD = (date) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split("T")[0]
}

// --- COMPONENTES DE NUTRICIÓN ---
const CustomFoodForm = ({ onSave, onClose, initialData, theme }) => {
  const [foodData, setFoodData] = useState(() => {
    // If we have initialData and it already contains macros → use it as-is
    if (initialData?.macros) return initialData

    // If initialData exists but WITHOUT macros (comes from a meal entry)
    if (initialData) {
      // Try to rebuild per-100 g macros from the totals + gramos
      const grams = initialData.grams || 100
      const factor = grams ? 100 / grams : 1

      return {
        name: initialData.name || "",
        macros: {
          calories: (initialData.calories || 0) * factor,
          protein: (initialData.protein || 0) * factor,
          carbs: (initialData.carbs || 0) * factor,
          fat: (initialData.fat || 0) * factor,
        },
      }
    }

    // No initial data → empty template
    return {
      name: "",
      macros: { calories: "", protein: "", carbs: "", fat: "" },
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFoodData((prev) => ({
      ...prev,
      macros: { ...prev.macros, [name]: value },
    }))
  }

  const handleNameChange = (e) => {
    setFoodData((prev) => ({ ...prev, name: e.target.value }))
  }

  const handleSave = () => {
    const finalData = {
      ...foodData,
      macros: {
        calories: Number.parseFloat(foodData.macros.calories) || 0,
        protein: Number.parseFloat(foodData.macros.protein) || 0,
        carbs: Number.parseFloat(foodData.macros.carbs) || 0,
        fat: Number.parseFloat(foodData.macros.fat) || 0,
      },
    }
    onSave(finalData)
  }

  const inputClasses = theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"

  return (
    <div className="p-1">
      <h4 className="font-bold text-lg mb-4">{initialData ? "Editar Alimento" : "Crear Nuevo Alimento"}</h4>
      <p className="text-xs text-gray-400 mb-4">Introduce los valores nutricionales por cada 100 gramos.</p>
      <div className="space-y-3">
        <input
          name="name"
          value={foodData.name}
          onChange={handleNameChange}
          placeholder="Nombre del alimento"
          className={`w-full p-2 rounded-lg ${inputClasses}`}
        />
        <input
          name="calories"
          type="number"
          value={foodData.macros.calories}
          onChange={handleChange}
          placeholder="Calorías (kcal)"
          className={`w-full p-2 rounded-lg ${inputClasses}`}
        />
        <input
          name="protein"
          type="number"
          value={foodData.macros.protein}
          onChange={handleChange}
          placeholder="Proteínas (g)"
          className={`w-full p-2 rounded-lg ${inputClasses}`}
        />
        <input
          name="carbs"
          type="number"
          value={foodData.macros.carbs}
          onChange={handleChange}
          placeholder="Carbohidratos (g)"
          className={`w-full p-2 rounded-lg ${inputClasses}`}
        />
        <input
          name="fat"
          type="number"
          value={foodData.macros.fat}
          onChange={handleChange}
          placeholder="Grasas (g)"
          className={`w-full p-2 rounded-lg ${inputClasses}`}
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button onClick={onClose} className="py-2 px-4 rounded-lg">
          Cancelar
        </button>
        <button onClick={handleSave} className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg">
          Guardar
        </button>
      </div>
    </div>
  )
}

const FoodManagerModal = ({
  theme,
  onClose,
  onAddFood,
  mealType,
  customFoods,
  setCustomFoods,
  initialFoodToEdit, // New prop
}) => {
  const [view, setView] = useState(initialFoodToEdit ? "edit" : "search") // Set initial view based on prop
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState(100)
  const [foodToEdit, setFoodToEdit] = useState(initialFoodToEdit)

  useEffect(() => {
    setFoodToEdit(initialFoodToEdit)
    setView(initialFoodToEdit ? "edit" : "search")
    setSearchQuery("") // Clear search query when modal opens/resets
  }, [initialFoodToEdit])

  const allFoods = useMemo(() => [...foodDatabase, ...customFoods], [customFoods])

  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    return allFoods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, allFoods])

  const handleSelectFood = (food) => {
    setSelectedFood(food)
    setGrams(100) // Reset grams when selecting a new food
    setView("grams")
  }

  const handleAddCalculatedFood = () => {
    if (!selectedFood || !grams) return
    const factor = Number.parseFloat(grams) / 100
    const finalFood = {
      id: Date.now(),
      name: selectedFood.name,
      grams: Number.parseFloat(grams),
      calories: (selectedFood.macros.calories || 0) * factor,
      protein: (selectedFood.macros.protein || 0) * factor,
      carbs: (selectedFood.macros.carbs || 0) * factor,
      fat: (selectedFood.macros.fat || 0) * factor,
    }
    onAddFood(mealType, finalFood)
    onClose()
  }

  const handleSaveCustomFood = (newFoodData) => {
    if (newFoodData.id && String(newFoodData.id).startsWith("c_")) {
      // Editing existing custom food
      setCustomFoods((prev) => prev.map((f) => (f.id === newFoodData.id ? newFoodData : f)))
    } else {
      // Creating new custom food
      setCustomFoods((prev) => [...prev, { ...newFoodData, id: `c_${Date.now()}` }])
    }
    setView("search")
    setFoodToEdit(null)
  }

  const handleDeleteCustomFood = (foodId) => {
    setCustomFoods((prev) => prev.filter((f) => f.id !== foodId))
  }

  const handleEditFood = (food) => {
    setFoodToEdit(food)
    setView("edit")
  }

  const inputClasses = theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"

  const renderContent = () => {
    switch (view) {
      case "grams":
        return (
          <div>
            <button
              onClick={() => setView("search")}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-200"
            >
              <ChevronLeft />
            </button>
            <h3 className="text-lg font-bold mb-2 text-center">{selectedFood.name}</h3>
            <p className="text-sm text-gray-400 text-center mb-4">Valores por 100g</p>
            <div className={`p-3 rounded-lg mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
              <p>
                <strong>Calorías:</strong> {selectedFood.macros.calories.toFixed(1)} kcal
              </p>
              <p>
                <strong>Proteínas:</strong> {selectedFood.macros.protein.toFixed(1)} g
              </p>
              <p>
                <strong>Carbs:</strong> {selectedFood.macros.carbs.toFixed(1)} g
              </p>
              <p>
                <strong>Grasas:</strong> {selectedFood.macros.fat.toFixed(1)} g
              </p>
            </div>
            <label className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Cantidad (gramos)
            </label>
            <input
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className={`w-full p-2 rounded-lg ${inputClasses}`}
            />
            <button
              onClick={handleAddCalculatedFood}
              className="w-full mt-6 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Añadir a {mealType}
            </button>
          </div>
        )
      case "create":
      case "edit":
        return (
          <CustomFoodForm
            onSave={handleSaveCustomFood}
            onClose={() => setView("search")}
            initialData={foodToEdit}
            theme={theme}
          />
        )
      case "search":
      default:
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Buscar Alimento</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej: Pechuga de pollo"
                className={`w-full p-2 pl-10 rounded-lg ${inputClasses}`}
              />
            </div>
            <div className="h-64 overflow-y-auto pr-2">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  searchResults.map((food) => (
                    <div
                      key={food.id}
                      className={`p-2 rounded-lg mb-2 flex justify-between items-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <button onClick={() => handleSelectFood(food)} className="text-left flex-grow">
                        <p>{food.name}</p>
                      </button>
                      {String(food.id).startsWith("c_") && ( // Only show edit/delete for custom foods
                        <div className="flex items-center">
                          <button
                            onClick={() => handleEditFood(food)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomFood(food.id)}
                            className="p-1 text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No se encontraron resultados.</p>
                )
              ) : (
                <>
                  <h4 className="font-semibold text-gray-400 mb-2">Alimentos de la Base de Datos:</h4>
                  {foodDatabase.map((food) => (
                    <div
                      key={food.id}
                      className={`p-2 rounded-lg mb-2 flex justify-between items-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <button onClick={() => handleSelectFood(food)} className="text-left flex-grow">
                        <p>{food.name}</p>
                      </button>
                    </div>
                  ))}
                  <h4 className="font-semibold text-gray-400 mt-4 mb-2">Mis Alimentos Personalizados:</h4>
                  {customFoods.length > 0 ? (
                    customFoods.map((food) => (
                      <div
                        key={food.id}
                        className={`p-2 rounded-lg mb-2 flex justify-between items-center ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <button onClick={() => handleSelectFood(food)} className="text-left flex-grow">
                          <p>{food.name}</p>
                        </button>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleEditFood(food)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomFood(food.id)}
                            className="p-1 text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No tienes alimentos personalizados.</p>
                  )}
                </>
              )}
            </div>
            <button
              onClick={() => {
                setFoodToEdit(null)
                setView("create")
              }}
              className="w-full mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Crear Nuevo Alimento
            </button>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className={`relative p-6 rounded-2xl shadow-xl w-full max-w-sm ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-200">
          <X />
        </button>
        {renderContent()}
      </div>
    </div>
  )
}

const SetGoalsModal = ({ theme, onClose, onSetGoals, currentGoals }) => {
  const [goals, setGoals] = useState(currentGoals)

  const inputClasses = theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"

  const handleChange = (e) => {
    const { name, value } = e.target
    setGoals((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSave = () => {
    onSetGoals(goals)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div
        className={`p-6 rounded-2xl shadow-xl w-full max-w-sm ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Fijar Objetivos Diarios</h3>
        <div className="space-y-3">
          <label className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Calorías (kcal)
          </label>
          <input
            name="calories"
            type="number"
            value={goals.calories}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg ${inputClasses}`}
          />
          <label className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Proteínas (g)
          </label>
          <input
            name="protein"
            type="number"
            value={goals.protein}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg ${inputClasses}`}
          />
          <label className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Carbohidratos (g)
          </label>
          <input
            name="carbs"
            type="number"
            value={goals.carbs}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg ${inputClasses}`}
          />
          <label className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Grasas (g)</label>
          <input
            name="fat"
            type="number"
            value={goals.fat}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg ${inputClasses}`}
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

const MealCard = ({ theme, mealType, mealData, onAddFood, onRemoveFood, onNoteChange, onEditFood }) => {
  const { foods = [], notes = "" } = mealData
  const totals = foods.reduce(
    (acc, food) => {
      acc.calories += food.calories
      acc.protein += food.protein
      acc.carbs += food.carbs
      acc.fat += food.fat
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  const inputClasses = theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"

  return (
    <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{mealType}</h3>
        <button
          onClick={() => onAddFood(mealType)}
          className={`p-2 rounded-full ${
            theme === "dark" ? "bg-cyan-600 hover:bg-cyan-500" : "bg-cyan-400 hover:bg-cyan-500"
          } text-white`}
        >
          <PlusCircle size={20} />
        </button>
      </div>
      <div className="space-y-2 mb-3">
        {foods.map((food) => (
          <div
            key={food.id}
            className={`p-2 rounded-lg flex justify-between items-center ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <div>
              <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {food.name} <span className="text-sm text-gray-400">({food.grams}g)</span>
              </p>
              <p className="text-xs text-gray-400">
                {food.calories.toFixed(0)}kcal, P:{food.protein.toFixed(1)}g, C: {food.carbs.toFixed(1)}g, F:{" "}
                {food.fat.toFixed(1)}g
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Added a div for spacing */}
              <button onClick={() => onEditFood(food)} className="text-blue-400 hover:text-blue-300">
                <Edit size={16} />
              </button>
              <button onClick={() => onRemoveFood(mealType, food.id)} className="text-red-500 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-3 pt-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <h4 className="font-semibold text-right">{totals.calories.toFixed(0)} kcal</h4>
        <p className="text-xs text-gray-400 text-right">
          P: {totals.protein.toFixed(1)}g, C: {totals.carbs.toFixed(1)}g, F: {totals.fat.toFixed(1)}g
        </p>
      </div>
      <div className="mt-3">
        <textarea
          value={notes}
          onChange={(e) => onNoteChange(mealType, e.target.value)}
          placeholder="Anotaciones de la comida..."
          className={`w-full h-16 p-2 text-sm border rounded-lg transition-colors ${inputClasses} focus:ring-cyan-400 focus:border-cyan-400`}
        />
      </div>
    </div>
  )
}

const MacroProgressBar = ({ label, current, goal, color, theme }) => {
  const percentage = goal > 0 ? (current / goal) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold">{label}</span>
        <span>
          {current.toFixed(0)} / {goal} g
        </span>
      </div>
      <div className={`h-2 rounded-full w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
      </div>
    </div>
  )
}

const NutritionSection = ({ theme, nutritionData, setNutritionData, goals, setGoals, customFoods, setCustomFoods }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isFoodManagerModalOpen, setFoodManagerModalOpen] = useState(false)
  const [foodToEditInModal, setFoodToEditInModal] = useState(null) // New state for food being edited
  const [isGoalsModalOpen, setGoalsModalOpen] = useState(false)
  const [currentMealType, setCurrentMealType] = useState("")

  const dateKey = toYYYYMMDD(selectedDate)
  const initialMealState = { foods: [], notes: "" }
  const todaysData = nutritionData[dateKey] || {
    Desayuno: initialMealState,
    Almuerzo: initialMealState,
    Cena: initialMealState,
    Snacks: initialMealState,
  }

  const handleAddFood = (mealType, food) => {
    const newDayData = {
      ...todaysData,
      [mealType]: {
        ...todaysData[mealType],
        foods: [...todaysData[mealType].foods, food],
      },
    }
    setNutritionData((prev) => ({ ...prev, [dateKey]: newDayData }))
  }

  const handleRemoveFood = (mealType, foodId) => {
    const newFoods = todaysData[mealType].foods.filter((food) => food.id !== foodId)
    const newDayData = {
      ...todaysData,
      [mealType]: {
        ...todaysData[mealType],
        foods: newFoods,
      },
    }
    setNutritionData((prev) => ({ ...prev, [dateKey]: newDayData }))
  }

  const handleNoteChange = (mealType, newNotes) => {
    const newDayData = {
      ...todaysData,
      [mealType]: {
        ...todaysData[mealType],
        notes: newNotes,
      },
    }
    setNutritionData((prev) => ({ ...prev, [dateKey]: newDayData }))
  }

  const openFoodManagerModal = (mealType, food = null) => {
    setCurrentMealType(mealType)
    setFoodToEditInModal(food) // Set the food to be edited
    setFoodManagerModalOpen(true)
  }

  const totals = Object.values(todaysData)
    .flatMap((meal) => meal.foods)
    .reduce(
      (acc, food) => {
        acc.calories += food.calories
        acc.protein += food.protein
        acc.carbs += food.carbs
        acc.fat += food.fat
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )

  const changeDay = (offset) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + offset)
      return newDate
    })
  }

  return (
    <div className={`p-4 space-y-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div
        className={`flex justify-between items-center p-2 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <button
          onClick={() => changeDay(-1)}
          className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <ChevronLeft />
        </button>
        <h2 className="font-bold text-lg">
          {selectedDate.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h2>
        <button
          onClick={() => changeDay(1)}
          className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <ChevronRight />
        </button>
      </div>

      <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">Resumen Diario</h3>
          <button
            onClick={() => setGoalsModalOpen(true)}
            className="flex items-center gap-2 text-sm bg-cyan-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <Target size={16} />
            Objetivos
          </button>
        </div>
        <div className="text-center mb-4">
          <h4 className="text-4xl font-bold text-cyan-400">{totals.calories.toFixed(0)}</h4>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>/{goals.calories} kcal</p>
        </div>
        <div className="space-y-3">
          <MacroProgressBar
            label="Proteínas"
            current={totals.protein}
            goal={goals.protein}
            color="bg-sky-500"
            theme={theme}
          />
          <MacroProgressBar
            label="Carbohidratos"
            current={totals.carbs}
            goal={goals.carbs}
            color="bg-orange-500"
            theme={theme}
          />
          <MacroProgressBar label="Grasas" current={totals.fat} goal={goals.fat} color="bg-yellow-500" theme={theme} />
        </div>
      </div>

      <div className="space-y-4">
        <MealCard
          theme={theme}
          mealType="Desayuno"
          mealData={todaysData.Desayuno}
          onAddFood={openFoodManagerModal}
          onRemoveFood={handleRemoveFood}
          onNoteChange={handleNoteChange}
          onEditFood={(food) => openFoodManagerModal("Desayuno", food)} // Pass the edit function
        />
        <MealCard
          theme={theme}
          mealType="Almuerzo"
          mealData={todaysData.Almuerzo}
          onAddFood={openFoodManagerModal}
          onRemoveFood={handleRemoveFood}
          onNoteChange={handleNoteChange}
          onEditFood={(food) => openFoodManagerModal("Almuerzo", food)} // Pass the edit function
        />
        <MealCard
          theme={theme}
          mealType="Cena"
          mealData={todaysData.Cena}
          onAddFood={openFoodManagerModal}
          onRemoveFood={handleRemoveFood}
          onNoteChange={handleNoteChange}
          onEditFood={(food) => openFoodManagerModal("Cena", food)} // Pass the edit function
        />
        <MealCard
          theme={theme}
          mealType="Snacks"
          mealData={todaysData.Snacks}
          onAddFood={openFoodManagerModal}
          onRemoveFood={handleRemoveFood}
          onNoteChange={handleNoteChange}
          onEditFood={(food) => openFoodManagerModal("Snacks", food)} // Pass the edit function
        />
      </div>

      {isFoodManagerModalOpen && (
        <FoodManagerModal
          theme={theme}
          onClose={() => setFoodManagerModalOpen(false)}
          onAddFood={handleAddFood}
          mealType={currentMealType}
          customFoods={customFoods}
          setCustomFoods={setCustomFoods}
          initialFoodToEdit={foodToEditInModal} // Pass the food to be edited
        />
      )}

      {isGoalsModalOpen && (
        <SetGoalsModal
          theme={theme}
          onClose={() => setGoalsModalOpen(false)}
          onSetGoals={setGoals}
          currentGoals={goals}
        />
      )}
      <br />
      <br />
      <br />
    </div>
  )
}

export default NutritionSection
