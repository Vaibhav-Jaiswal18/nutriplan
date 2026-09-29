import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface Meal {
  time: string;
  meal: string;
  icon: string;
  name: string;
  items: string[];
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}


interface ApiMeal {
  meal_type: string;
  food_id: number;
  food_name: string;
  serving_size: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ApiResponse {
  bmi: number;
  bmi_category: string;
  bmr: number;
  tdee: number;
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_liters: number;
  meal_plan: ApiMeal[];
}

interface NutritionResults {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

function Ring({
  value,
  max,
  size = 180,
  stroke = 16,
  color = '#22c55e',
  label,
  sublabel,
  unit = '',
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  unit?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const filled = C * (animated / max);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={`g-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="rgba(34,197,94,0.06)" strokeWidth={stroke}
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={`url(#g-${label})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${Math.min(filled, C)} ${C}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <text x={size / 2} y={size / 2 - 8} textAnchor="middle" fill="#f0f9f4" fontSize={size > 150 ? 28 : 20} fontWeight="800" fontFamily="Outfit">
            {Math.round(value).toLocaleString()}
          </text>
          {unit && (
            <text x={size / 2} y={size / 2 + 10} textAnchor="middle" fill="rgba(240,249,244,0.4)" fontSize={size > 150 ? 11 : 9} fontFamily="Inter">
              {unit}
            </text>
          )}
        </svg>
      </div>
      {label && (
        <div className="text-center">
          <div className="text-sm font-semibold text-white" style={{ fontFamily: 'Outfit' }}>{label}</div>
          {sublabel && <div className="text-xs mt-0.5" style={{ color: 'rgba(240,249,244,0.4)' }}>{sublabel}</div>}
        </div>
      )}
    </div>
  );
}

function BMIIndicator({ bmi, category }: { bmi: number; category: string }) {
  const zones = [
    { label: 'Under', min: 0, max: 18.5, color: '#60a5fa' },
    { label: 'Normal', min: 18.5, max: 25, color: '#4ade80' },
    { label: 'Over', min: 25, max: 30, color: '#fbbf24' },
    { label: 'Obese', min: 30, max: 40, color: '#f87171' },
  ];

  const clampedBmi = Math.min(Math.max(bmi, 0), 40);
  const pct = (clampedBmi / 40) * 100;

  const categoryColors: Record<string, string> = {
    'Underweight': '#60a5fa',
    'Normal weight': '#4ade80',
    'Overweight': '#fbbf24',
    'Obese': '#f87171',
  };
  const catColor = categoryColors[category] || '#22c55e';

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(15, 28, 23, 0.7)',
        border: '1px solid rgba(34, 197, 94, 0.08)',
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'rgba(240,249,244,0.4)', fontFamily: 'Outfit' }}>
            Body Mass Index
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold" style={{ fontFamily: 'Outfit', color: catColor }}>
              {bmi}
            </span>
            <span className="text-xs" style={{ color: 'rgba(240,249,244,0.4)' }}>kg/m²</span>
          </div>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${catColor}18`,
            color: catColor,
            border: `1px solid ${catColor}30`,
            fontFamily: 'Outfit',
          }}
        >
          {category}
        </span>
      </div>

      {/* Scale bar */}
      <div className="relative mb-3">
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {zones.map((z) => (
            <div
              key={z.label}
              className="h-full rounded-sm opacity-30"
              style={{
                flex: z.max - z.min,
                background: z.color,
                opacity: category === z.label || (category === 'Normal weight' && z.label === 'Normal') ? 1 : 0.25,
              }}
            />
          ))}
        </div>
        {/* Pointer */}
        <div
          className="absolute top-0 w-3 h-3 rounded-full border-2 transition-all duration-1000 -translate-x-1/2"
          style={{
            left: `${pct}%`,
            background: catColor,
            borderColor: '#0b1512',
            boxShadow: `0 0 8px ${catColor}60`,
          }}
        />
      </div>

      <div className="flex justify-between">
        {zones.map((z) => (
          <span key={z.label} className="text-[9px]" style={{ color: 'rgba(240,249,244,0.3)' }}>
            {z.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MealCard({ meal, index }: { meal: Meal; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative flex gap-5">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg z-10 flex-shrink-0"
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          {meal.icon}
        </div>
        {index < 4 && (
          <div className="w-px flex-1 mt-2" style={{ background: 'rgba(34, 197, 94, 0.08)', minHeight: 24 }} />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl p-5 mb-4 transition-all duration-300 cursor-pointer hover:scale-[1.01] group"
        style={{
          background: 'rgba(15, 28, 23, 0.7)',
          border: `1px solid ${expanded ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.07)'}`,
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium" style={{ color: '#22c55e', fontFamily: 'Outfit' }}>
                {meal.time}
              </span>
              <span className="text-xs" style={{ color: 'rgba(240,249,244,0.3)' }}>·</span>
              <span className="text-xs" style={{ color: 'rgba(240,249,244,0.45)' }}>
                {meal.meal}
              </span>
            </div>
            <h4
              className="text-sm font-semibold text-white leading-snug"
              style={{ fontFamily: 'Outfit' }}
            >
              {meal.name}
            </h4>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold" style={{ fontFamily: 'Outfit', color: '#4ade80' }}>
              {meal.kcal}
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(240,249,244,0.35)' }}>kcal</div>
          </div>
        </div>

        {/* Macro row */}
        <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(34,197,94,0.06)' }}>
          {[
            { label: 'Protein', val: meal.protein, unit: 'g', color: '#4ade80' },
            { label: 'Carbs', val: meal.carbs, unit: 'g', color: '#86efac' },
            { label: 'Fat', val: meal.fat, unit: 'g', color: '#22c55e' },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
              <span className="text-xs font-semibold" style={{ color: m.color }}>{m.val}{m.unit}</span>
              <span className="text-[10px]" style={{ color: 'rgba(240,249,244,0.3)' }}>{m.label}</span>
            </div>
          ))}
          <div className="ml-auto">
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{
                color: 'rgba(240,249,244,0.3)',
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Expanded items */}
        {expanded && (
          <div className="mt-4 pt-4 animate-fade-in" style={{ borderTop: '1px solid rgba(34,197,94,0.06)' }}>
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: 'rgba(240,249,244,0.35)', fontFamily: 'Outfit' }}>
              Ingredients
            </p>
            <ul className="space-y-1.5">
              {meal.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(240,249,244,0.55)' }}>
                  <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(34,197,94,0.4)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function WaterTracker({ liters }: { liters: number }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setPct(0.7), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(15, 28, 23, 0.7)',
        border: '1px solid rgba(34, 197, 94, 0.08)',
      }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'rgba(240,249,244,0.4)', fontFamily: 'Outfit' }}>
        Daily Hydration
      </p>

      <div className="flex items-end gap-6">
        {/* Bottle illustration */}
        <div className="relative flex-shrink-0" style={{ width: 56, height: 100 }}>
          <svg width="56" height="100" viewBox="0 0 56 100" fill="none">
            {/* Bottle cap */}
            <rect x="20" y="0" width="16" height="8" rx="3" fill="rgba(34,197,94,0.3)" />
            {/* Bottle neck */}
            <rect x="18" y="8" width="20" height="10" rx="2" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
            {/* Bottle body */}
            <rect x="8" y="18" width="40" height="76" rx="8" fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
            {/* Water fill (animated) */}
            <clipPath id="bottleClip">
              <rect x="9" y="19" width="38" height="74" rx="7" />
            </clipPath>
            <rect
              x="9"
              y={`${19 + 74 * (1 - pct)}`}
              width="38"
              height={`${74 * pct}`}
              fill="rgba(34,197,94,0.2)"
              clipPath="url(#bottleClip)"
              style={{ transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            {/* Shimmer */}
            <rect x="16" y="30" width="4" height="40" rx="2" fill="rgba(255,255,255,0.04)" />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-extrabold" style={{ fontFamily: 'Outfit', color: '#4ade80' }}>
              {liters}
            </span>
            <span className="text-sm font-medium" style={{ color: 'rgba(240,249,244,0.4)' }}>L / day</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,249,244,0.45)' }}>
            Stay hydrated throughout the day. Spread intake across 8–10 glasses.
          </p>

          {/* Mini glasses progress */}
          <div className="flex gap-1.5 mt-4 flex-wrap">
            {Array.from({ length: 10 }).map((_, i) => {
              const filled = i < Math.round(liters / 0.28);
              return (
                <div
                  key={i}
                  className="w-5 h-7 rounded-sm border transition-all duration-300"
                  style={{
                    borderColor: filled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.1)',
                    background: filled ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultResults: NutritionResults = {
  bmi: 24.5,
  bmiCategory: 'Normal weight',
  bmr: 1742,
  tdee: 2200,
  targetCalories: 2017,
  protein: 126,
  carbs: 218,
  fat: 62,
  water: 2.8,
};

const defaultMeals: Meal[] = [
  { time: '07:30', meal: 'Breakfast', icon: '🍳', name: 'Scrambled Eggs with Whole Grain Toast', items: ['3 whole eggs', '2 slices whole grain bread', 'Spinach', '1 tsp olive oil'], kcal: 412, protein: 26, carbs: 32, fat: 14 },
  { time: '10:30', meal: 'Morning Snack', icon: '🍌', name: 'Banana with Peanut Butter', items: ['1 large banana', '2 tbsp peanut butter'], kcal: 200, protein: 8, carbs: 30, fat: 8 },
  { time: '13:30', meal: 'Lunch', icon: '🍗', name: 'Grilled Chicken & Brown Rice Bowl', items: ['180g chicken breast', '100g brown rice', 'Roasted vegetables', '1 tbsp olive oil'], kcal: 536, protein: 42, carbs: 48, fat: 10 },
  { time: '17:00', meal: 'Evening Snack', icon: '🐟', name: 'Tuna on Whole Grain Crackers', items: ['85g canned tuna', '5 crackers', '1 tsp mustard'], kcal: 166, protein: 18, carbs: 14, fat: 4 },
  { time: '20:30', meal: 'Dinner', icon: '🐠', name: 'Baked Salmon with Roasted Vegetables', items: ['180g salmon', 'Broccoli & carrots', '1 tbsp olive oil', 'Herbs & lemon'], kcal: 478, protein: 36, carbs: 20, fat: 18 },
];

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const apiResponse = (location.state as { apiResponse?: ApiResponse } | null)?.apiResponse;

  const results: NutritionResults = apiResponse
    ? {
        bmi: apiResponse.bmi,
        bmiCategory: apiResponse.bmi_category,
        bmr: apiResponse.bmr,
        tdee: apiResponse.tdee,
        targetCalories: apiResponse.target_calories,
        protein: apiResponse.protein_g,
        carbs: apiResponse.carbs_g,
        fat: apiResponse.fat_g,
        water: apiResponse.water_liters,
      }
    : defaultResults;

  const meals: Meal[] = apiResponse?.meal_plan?.map((meal, index) => ({
    time: ['07:30', '10:30', '13:30', '17:00', '20:30'][index] || '',
    meal: meal.meal_type.replace('_', ' '),
    icon: ['🥣', '🍎', '🍛', '🥗', '🌙'][index] || '🍽️',
    name: meal.food_name,
    items: [`${meal.quantity} × ${meal.serving_size}`],
    kcal: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
  })) || defaultMeals;

  const r = results;
  const m = meals;

  const totalMealCal = m.reduce((s, meal) => s + meal.kcal, 0);

  return (
    <div className="min-h-screen" style={{ background: '#0b1512' }}>
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 pt-28 pb-24">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              color: '#4ade80',
              fontFamily: 'Outfit',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            Plan generated successfully
          </div>
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white mb-4"
            style={{ fontFamily: 'Outfit' }}
          >
            Your Plan Is Ready.
          </h1>
          <p className="text-lg" style={{ color: 'rgba(240,249,244,0.5)' }}>
            Personalized to your body, goals, and lifestyle.
          </p>
        </div>

        {/* Quick stat chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'BMI', val: r.bmi.toString(), sub: r.bmiCategory, color: '#4ade80' },
            { label: 'Target Calories', val: r.targetCalories.toLocaleString(), sub: 'kcal / day', color: '#22c55e' },
            { label: 'Protein', val: `${r.protein}g`, sub: 'daily target', color: '#86efac' },
            { label: 'Water', val: `${r.water}L`, sub: 'daily intake', color: '#4ade80' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(15, 28, 23, 0.7)',
                border: '1px solid rgba(34, 197, 94, 0.08)',
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,249,244,0.35)', fontFamily: 'Outfit' }}>
                {s.label}
              </p>
              <p className="text-2xl font-extrabold" style={{ fontFamily: 'Outfit', color: s.color }}>
                {s.val}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(240,249,244,0.35)' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid: Calorie ring + Macros */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {/* Calorie ring */}
          <div
            className="lg:col-span-2 rounded-2xl p-8 flex flex-col items-center justify-center"
            style={{
              background: 'rgba(15, 28, 23, 0.7)',
              border: '1px solid rgba(34, 197, 94, 0.08)',
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-6" style={{ color: 'rgba(240,249,244,0.35)', fontFamily: 'Outfit' }}>
              Daily Calories
            </p>
            <Ring
              value={r.targetCalories}
              max={Math.max(r.targetCalories * 1.3, 3000)}
              size={200}
              stroke={18}
              color="#22c55e"
              unit="kcal / day"
            />
            <div className="mt-6 flex gap-6 text-center">
              <div>
                <p className="text-xs font-bold" style={{ fontFamily: 'Outfit', color: '#4ade80' }}>{r.bmr.toLocaleString()}</p>
                <p className="text-[10px]" style={{ color: 'rgba(240,249,244,0.3)' }}>BMR</p>
              </div>
              <div style={{ width: 1, background: 'rgba(34,197,94,0.1)' }} />
              <div>
                <p className="text-xs font-bold" style={{ fontFamily: 'Outfit', color: '#4ade80' }}>{r.tdee.toLocaleString()}</p>
                <p className="text-[10px]" style={{ color: 'rgba(240,249,244,0.3)' }}>TDEE</p>
              </div>
            </div>
          </div>

          {/* Macro breakdown */}
          <div
            className="lg:col-span-3 rounded-2xl p-6"
            style={{
              background: 'rgba(15, 28, 23, 0.7)',
              border: '1px solid rgba(34, 197, 94, 0.08)',
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-6" style={{ color: 'rgba(240,249,244,0.35)', fontFamily: 'Outfit' }}>
              Macro Breakdown
            </p>
            <div className="flex items-center justify-around flex-wrap gap-4">
              <Ring
                value={r.protein}
                max={300}
                size={130}
                stroke={12}
                color="#4ade80"
                label="Protein"
                sublabel={`${Math.round((r.protein * 4 / r.targetCalories) * 100)}% of calories`}
                unit="g"
              />
              <Ring
                value={r.carbs}
                max={500}
                size={130}
                stroke={12}
                color="#86efac"
                label="Carbohydrates"
                sublabel={`${Math.round((r.carbs * 4 / r.targetCalories) * 100)}% of calories`}
                unit="g"
              />
              <Ring
                value={r.fat}
                max={200}
                size={130}
                stroke={12}
                color="#22c55e"
                label="Fat"
                sublabel={`${Math.round((r.fat * 9 / r.targetCalories) * 100)}% of calories`}
                unit="g"
              />
            </div>

            {/* Macro bar */}
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(34,197,94,0.06)' }}>
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                {[
                  { val: r.protein * 4, color: '#4ade80' },
                  { val: r.carbs * 4, color: '#86efac' },
                  { val: r.fat * 9, color: '#22c55e' },
                ].map((seg, i) => (
                  <div
                    key={i}
                    className="h-full rounded-sm"
                    style={{
                      flex: seg.val,
                      background: seg.color,
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {[
                  { label: 'P', color: '#4ade80' },
                  { label: 'C', color: '#86efac' },
                  { label: 'F', color: '#22c55e' },
                ].map((seg) => (
                  <span key={seg.label} className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(240,249,244,0.35)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                    {seg.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BMI + Water row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <BMIIndicator bmi={r.bmi} category={r.bmiCategory} />
          <WaterTracker liters={r.water} />
        </div>

        {/* Meal timeline */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{
            background: 'rgba(15, 28, 23, 0.7)',
            border: '1px solid rgba(34, 197, 94, 0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(240,249,244,0.35)', fontFamily: 'Outfit' }}>
                Meal Journey
              </p>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>
                Your Daily Meal Plan
              </h2>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.15)',
                fontFamily: 'Outfit',
              }}
            >
              {totalMealCal.toLocaleString()} kcal total
            </div>
          </div>

          <div>
            {m.map((meal, i) => (
              <MealCard key={i} meal={meal} index={i} />
            ))}
          </div>
        </div>

        {/* Daily summary */}
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(15,28,23,0.8) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.12)',
          }}
        >
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit' }}>
                Daily Summary
              </h2>
              <p className="text-sm" style={{ color: 'rgba(240,249,244,0.45)' }}>
                You're approximately on target
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <span className="text-xs font-semibold" style={{ color: '#4ade80', fontFamily: 'Outfit' }}>
                On Track
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Calories', val: `${r.targetCalories.toLocaleString()} kcal`, color: '#22c55e' },
              { label: 'Protein', val: `${r.protein}g`, color: '#4ade80' },
              { label: 'Carbs', val: `${r.carbs}g`, color: '#86efac' },
              { label: 'Fat', val: `${r.fat}g`, color: '#22c55e' },
              { label: 'Water', val: `${r.water}L`, color: '#4ade80' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-extrabold mb-1" style={{ fontFamily: 'Outfit', color: s.color }}>
                  {s.val}
                </div>
                <div className="text-xs" style={{ color: 'rgba(240,249,244,0.35)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Completion indicator */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(34,197,94,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'rgba(240,249,244,0.4)' }}>Plan completion</span>
              <span className="text-xs font-semibold" style={{ color: '#4ade80', fontFamily: 'Outfit' }}>100%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(34,197,94,0.08)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                  transition: 'width 1.5s ease-out',
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => navigate('/planner')}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                fontFamily: 'Outfit',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#0b1512',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
              }}
            >
              Recalculate Plan
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                fontFamily: 'Outfit',
                background: 'rgba(240,249,244,0.04)',
                color: 'rgba(240,249,244,0.6)',
                border: '1px solid rgba(240,249,244,0.07)',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
