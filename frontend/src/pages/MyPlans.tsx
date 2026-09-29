import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

type Plan = {
  id: number;
  date: string;
  target_calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water_liters: number;
};

export default function MyPlans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await api.get('/api/diet-plans/');
        setPlans(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
          'Unable to load your plans.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1512] flex items-center justify-center text-white">
        Loading your plans...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1512] px-6 py-16">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <p className="text-green-400 text-sm uppercase tracking-widest">
            NutriPlan
          </p>

          <h1 className="text-4xl font-bold text-white mt-2">
            My Plans
          </h1>

          <p className="text-white/40 mt-2">
            Your saved nutrition plans.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-300">
            {error}
          </div>
        )}

        {plans.length === 0 && !error && (
          <div className="rounded-3xl border border-green-500/10 bg-white/[0.03] p-12 text-center">
            <h2 className="text-2xl font-semibold text-white">
              No plans yet
            </h2>

            <p className="text-white/40 mt-2">
              Create your first personalized diet plan.
            </p>

            <button
              onClick={() => navigate('/planner')}
              className="mt-6 rounded-full px-7 py-3 font-semibold text-[#0b1512]"
              style={{
                background:
                  'linear-gradient(135deg,#22c55e,#16a34a)',
              }}
            >
              Build My Plan
            </button>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => navigate(`/my-plans/${plan.id}`)}
              className="text-left rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-green-500/30"
              style={{
                background: 'rgba(15,28,23,0.8)',
                border: '1px solid rgba(34,197,94,0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm">
                  Plan #{plan.id}
                </span>

                <span className="text-white/30 text-xs">
                  {new Date(plan.date).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mt-5">
                {plan.target_calories} kcal
              </h2>

              <p className="text-white/40 text-sm mt-1">
                Daily target
              </p>

              <div className="grid grid-cols-3 gap-3 mt-6">

                <div>
                  <p className="text-white/30 text-xs">
                    Protein
                  </p>
                  <p className="text-white font-semibold mt-1">
                    {plan.protein}g
                  </p>
                </div>

                <div>
                  <p className="text-white/30 text-xs">
                    Carbs
                  </p>
                  <p className="text-white font-semibold mt-1">
                    {plan.carbs}g
                  </p>
                </div>

                <div>
                  <p className="text-white/30 text-xs">
                    Fat
                  </p>
                  <p className="text-white font-semibold mt-1">
                    {plan.fat}g
                  </p>
                </div>

              </div>

              <div className="mt-6 text-green-400 text-sm">
                View full plan →
              </div>

            </button>
          ))}

        </div>
      </div>
    </div>
  );
}