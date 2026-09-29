import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import api from '../services/api';

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      try {
        const response = await api.get(
          `/api/diet-plans/${id}`
        );

        setPlan(response.data);
      } catch {
        navigate('/my-plans');
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1512] flex items-center justify-center text-white">
        Loading plan...
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-[#0b1512] px-6 py-16">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate('/my-plans')}
          className="text-green-400 text-sm mb-8"
        >
          ← Back to My Plans
        </button>

        <h1 className="text-4xl font-bold text-white">
          {plan.target_calories} kcal Daily Plan
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

          {[
            ['Protein', `${plan.protein}g`],
            ['Carbs', `${plan.carbs}g`],
            ['Fat', `${plan.fat}g`],
            ['Water', `${plan.water_liters}L`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(15,28,23,0.8)',
                border: '1px solid rgba(34,197,94,0.08)',
              }}
            >
              <p className="text-white/30 text-sm">
                {label}
              </p>
              <p className="text-2xl font-bold text-white mt-2">
                {value}
              </p>
            </div>
          ))}

        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-5">
          Meal Plan
        </h2>

        <div className="space-y-4">

          {plan.meals.map((meal: any) => (
            <div
              key={meal.id}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(15,28,23,0.8)',
                border: '1px solid rgba(34,197,94,0.08)',
              }}
            >
              <p className="text-green-400 text-sm uppercase">
                {meal.meal_type.replace('_', ' ')}
              </p>

              <h3 className="text-xl font-bold text-white mt-2">
                {meal.food_name}
              </h3>

              <p className="text-white/40 text-sm mt-1">
                {meal.serving_size}
              </p>

              <div className="flex flex-wrap gap-5 mt-4 text-sm text-white/60">
                <span>{meal.calories} kcal</span>
                <span>{meal.protein}g protein</span>
                <span>{meal.carbs}g carbs</span>
                <span>{meal.fat}g fat</span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}