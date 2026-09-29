import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

interface UserData {
  age: string;
  gender: 'male' | 'female' | '';
  height: string;
  weight: string;
  goal: 'lose' | 'maintain' | 'gain' | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | '';
  dietType: 'vegetarian' | 'non_vegetarian' | '';
}

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-medium"
          style={{ color: '#22c55e', fontFamily: 'var(--font-display)' }}
        >
          Step {step} of {total}
        </span>
        <span className="text-xs" style={{ color: 'rgba(240,249,244,0.35)' }}>
          {Math.round((step / total) * 100)}% complete
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(34,197,94,0.1)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(step / total) * 100}%`,
            background: 'linear-gradient(90deg, #22c55e, #4ade80)',
          }}
        />
      </div>
    </div>
  );
}

function SelectCard({
  selected,
  onClick,
  icon,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] focus:outline-none"
      style={{
        background: selected ? 'rgba(34, 197, 94, 0.12)' : 'rgba(15, 28, 23, 0.7)',
        border: `1px solid ${selected ? 'rgba(34, 197, 94, 0.45)' : 'rgba(34, 197, 94, 0.07)'}`,
        boxShadow: selected ? '0 0 20px rgba(34, 197, 94, 0.12)' : 'none',
      }}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <div
            className="font-semibold text-sm"
            style={{ fontFamily: 'var(--font-display)', color: selected ? '#4ade80' : '#f0f9f4' }}
          >
            {label}
          </div>
          {description && (
            <div className="text-xs mt-0.5" style={{ color: 'rgba(240,249,244,0.45)' }}>
              {description}
            </div>
          )}
        </div>
        <div className="ml-auto">
          <div
            className="w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center"
            style={{
              borderColor: selected ? '#22c55e' : 'rgba(240,249,244,0.15)',
              background: selected ? '#22c55e' : 'transparent',
            }}
          >
            {selected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="#0b1512" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  unit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  unit?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-xs font-semibold mb-2 tracking-wide"
        style={{ fontFamily: 'var(--font-display)', color: focused ? '#22c55e' : 'rgba(240,249,244,0.55)' }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200"
          style={{
            background: 'rgba(15, 28, 23, 0.8)',
            border: `1px solid ${focused ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.08)'}`,
            color: '#f0f9f4',
            fontFamily: 'var(--font-body)',
            boxShadow: focused ? '0 0 0 3px rgba(34, 197, 94, 0.07)' : 'none',
          }}
        />
        {unit && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: 'rgba(240,249,244,0.3)', fontFamily: 'var(--font-display)' }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Planner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<UserData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
    dietType: '',
  });

  const update = (key: keyof UserData, val: string) =>
    setData((prev) => ({ ...prev, [key]: val }));

  function canProceed() {
    if (step === 1) return data.age && data.gender && data.height && data.weight;
    if (step === 2) return !!data.goal;
    if (step === 3) return !!data.activityLevel;
    if (step === 4) return !!data.dietType;
    return false;
  }

 async function handleNext() {
  if (step < 4) {
    setStep((s) => s + 1);
    return;
  }

  setGenerating(true);
  setError('');

  try {
    const payload = {
      age: Number(data.age),
      gender: data.gender,
      height_cm: Number(data.height),
      weight_kg: Number(data.weight),
      activity_level: data.activityLevel,
      goal: data.goal,
      diet: data.dietType,
    };

    // 1. Calculate nutrition for the results dashboard
    const nutritionResponse = await api.post(
      '/api/nutrition/calculate',
      payload
    );

    // 2. Save the generated plan for the logged-in user
    const savedPlanResponse = await api.post(
      '/api/diet-plans/',
      payload
    );

    // 3. Send both results to the Results page
    navigate('/results', {
      state: {
        userData: data,
        apiResponse: nutritionResponse.data,
        dietPlanId: savedPlanResponse.data.diet_plan_id,
      },
    });

  } catch (error: any) {
    console.error('Diet plan generation error:', error);

    const message =
      error.response?.data?.detail ||
      'Unable to generate your diet plan. Please try again.';

    setError(message);
    setGenerating(false);
  }
}

  const goals = [
    { val: 'lose', icon: '📉', label: 'Lose Weight', desc: 'Caloric deficit, fat reduction' },
    { val: 'maintain', icon: '⚖️', label: 'Maintain Weight', desc: 'Balanced energy intake' },
    { val: 'gain', icon: '💪', label: 'Gain Weight', desc: 'Caloric surplus, muscle building' },
  ];

  const activities = [
    { val: 'sedentary', icon: '🪑', label: 'Sedentary', desc: 'Desk job, little to no exercise' },
    { val: 'light', icon: '🚶', label: 'Lightly Active', desc: 'Light exercise 1–3 days/week' },
    { val: 'moderate', icon: '🏃', label: 'Moderately Active', desc: 'Moderate exercise 3–5 days/week' },
    { val: 'active', icon: '🏋️', label: 'Very Active', desc: 'Hard exercise 6–7 days/week' },
    { val: 'very_active', icon: '⚡', label: 'Extremely Active', desc: 'Athlete / physical job' },
  ];

  const diets = [
    { val: 'vegetarian', icon: '🥦', label: 'Vegetarian', desc: 'Plant-based, no meat or fish' },
    { val: 'non_vegetarian', icon: '🍗', label: 'Non-Vegetarian', desc: 'Includes meat, fish & eggs' },
  ];

  const stepTitles = [
    { num: '01', title: 'Tell us about yourself', sub: 'Your physical stats help us calculate your unique metabolic needs.' },
    { num: '02', title: "What's your goal?", sub: 'This determines your target calorie adjustment.' },
    { num: '03', title: 'How active are you?', sub: 'Your activity level affects how many calories you burn daily.' },
    { num: '04', title: "What's your diet?", sub: "We'll build your meal plan around your food preferences." },
  ];

  const current = stepTitles[step - 1];

  if (generating) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0b1512' }}
      >
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <svg width="96" height="96" viewBox="0 0 96 96" className="animate-spin-slow">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="40" fill="none" stroke="#22c55e" strokeWidth="6"
                strokeLinecap="round" strokeDasharray="60 191"
                transform="rotate(-90 48 48)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🌿</span>
          </div>
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Building your plan
          </h2>
          <p className="text-sm" style={{ color: 'rgba(240,249,244,0.45)' }}>
            Calculating your personalized nutrition targets…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-28 px-4"
      style={{ background: '#0b1512' }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(34,197,94,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative w-full max-w-xl">
        {/* Step header */}
        <div className="mb-10 animate-slide-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              fontFamily: 'var(--font-display)',
            }}
          >
            Step {current.num}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {current.title}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(240,249,244,0.45)' }}>
            {current.sub}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 relative"
          style={{
            background: 'rgba(15, 28, 23, 0.6)',
            border: '1px solid rgba(34, 197, 94, 0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <StepIndicator step={step} total={4} />
          {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

          {/* Step 1: Personal info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Age" value={data.age} onChange={(v) => update('age', v)} type="number" placeholder="25" unit="yrs" />
                <InputField label="Height" value={data.height} onChange={(v) => update('height', v)} type="number" placeholder="170" unit="cm" />
              </div>
              <InputField label="Weight" value={data.weight} onChange={(v) => update('weight', v)} type="number" placeholder="70" unit="kg" />
              <div>
                <label
                  className="block text-xs font-semibold mb-3 tracking-wide"
                  style={{ fontFamily: 'var(--font-display)', color: 'rgba(240,249,244,0.55)' }}
                >
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'male', icon: '♂', label: 'Male' },
                    { val: 'female', icon: '♀', label: 'Female' },
                  ].map((g) => (
                    <SelectCard
                      key={g.val}
                      selected={data.gender === g.val}
                      onClick={() => update('gender', g.val)}
                      icon={g.icon}
                      label={g.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              {goals.map((g) => (
                <SelectCard
                  key={g.val}
                  selected={data.goal === g.val}
                  onClick={() => update('goal', g.val)}
                  icon={g.icon}
                  label={g.label}
                  description={g.desc}
                />
              ))}
            </div>
          )}

          {/* Step 3: Activity */}
          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
              {activities.map((a) => (
                <SelectCard
                  key={a.val}
                  selected={data.activityLevel === a.val}
                  onClick={() => update('activityLevel', a.val)}
                  icon={a.icon}
                  label={a.label}
                  description={a.desc}
                />
              ))}
            </div>
          )}

          {/* Step 4: Diet */}
          {step === 4 && (
            <div className="space-y-3 animate-fade-in">
              {diets.map((d) => (
                <SelectCard
                  key={d.val}
                  selected={data.dietType === d.val}
                  onClick={() => update('dietType', d.val)}
                  icon={d.icon}
                  label={d.label}
                  description={d.desc}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'rgba(240,249,244,0.04)',
                  color: 'rgba(240,249,244,0.6)',
                  border: '1px solid rgba(240,249,244,0.07)',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                fontFamily: 'var(--font-display)',
                background: canProceed()
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'rgba(34, 197, 94, 0.15)',
                color: canProceed() ? '#0b1512' : 'rgba(240,249,244,0.4)',
                boxShadow: canProceed() ? '0 0 20px rgba(34, 197, 94, 0.2)' : 'none',
              }}
            >
              {step === 4 ? 'Generate My Plan →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
