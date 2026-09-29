import { useNavigate } from 'react-router';
import Footer from '../components/Footer';

function NutritionViz() {
  const cals = 2017;
  const maxCals = 2600;
  const pct = cals / maxCals;

  const R = 90;
  const C = 2 * Math.PI * R;
  const filled = C * pct;

  const macros = [
    {
      label: 'Protein',
      value: '128g',
      pct: 0.64,
      color: '#4ade80',
      r: 28,
      pos: { top: '16%', right: '2%' },
    },
    {
      label: 'Carbs',
      value: '218g',
      pct: 0.72,
      color: '#86efac',
      r: 28,
      pos: { bottom: '20%', right: '0%' },
    },
    {
      label: 'Fat',
      value: '62g',
      pct: 0.52,
      color: '#22c55e',
      r: 28,
      pos: { bottom: '8%', left: '8%' },
    },
  ];

  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ minHeight: 480 }}
    >
      {/* Glow behind */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: 340,
          height: 340,
          background:
            'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Outer dashed ring */}
      <div
        className="absolute rounded-full animate-spin-slow"
        style={{
          width: 340,
          height: 340,
          border: '1px dashed rgba(34, 197, 94, 0.2)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div
        className="absolute rounded-full animate-spin-reverse"
        style={{
          width: 280,
          height: 280,
          border: '1px dashed rgba(34, 197, 94, 0.1)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Main calorie ring */}
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        className="relative z-10"
      >
        <defs>
          <linearGradient
            id="ringGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke="rgba(34,197,94,0.07)"
          strokeWidth="16"
        />

        {/* Fill */}
        <circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${C - filled}`}
          transform="rotate(-90 110 110)"
          filter="url(#glow)"
          style={{
            transition:
              'stroke-dasharray 1.5s ease-out',
          }}
        />

        {/* Center text */}
        <text
          x="110"
          y="100"
          textAnchor="middle"
          fill="#f0f9f4"
          fontSize="32"
          fontWeight="800"
          fontFamily="Outfit"
        >
          {cals.toLocaleString()}
        </text>

        <text
          x="110"
          y="122"
          textAnchor="middle"
          fill="rgba(240,249,244,0.4)"
          fontSize="11"
          fontFamily="Inter"
        >
          kcal / day
        </text>

        <text
          x="110"
          y="142"
          textAnchor="middle"
          fill="#4ade80"
          fontSize="10"
          fontWeight="600"
          fontFamily="Inter"
        >
          TARGET
        </text>
      </svg>

      {/* Macro satellite rings */}
      {macros.map((m) => {
        const c = 2 * Math.PI * m.r;
        const f = c * m.pct;

        return (
          <div
            key={m.label}
            className="absolute z-20 animate-float"
            style={m.pos}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                width: m.r * 2 + 20,
                height: m.r * 2 + 20,
                background:
                  'rgba(11, 21, 18, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '50%',
                border:
                  '1px solid rgba(34, 197, 94, 0.15)',
              }}
            >
              <svg
                width={m.r * 2 + 16}
                height={m.r * 2 + 16}
                viewBox={`0 0 ${m.r * 2 + 16} ${
                  m.r * 2 + 16
                }`}
                className="absolute inset-0"
              >
                <circle
                  cx={m.r + 8}
                  cy={m.r + 8}
                  r={m.r}
                  fill="none"
                  stroke="rgba(34,197,94,0.07)"
                  strokeWidth="6"
                />

                <circle
                  cx={m.r + 8}
                  cy={m.r + 8}
                  r={m.r}
                  fill="none"
                  stroke={m.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${f} ${c - f}`}
                  transform={`rotate(-90 ${m.r + 8} ${
                    m.r + 8
                  })`}
                />
              </svg>

              <div className="relative z-10 text-center">
                <div
                  className="text-xs font-bold leading-none"
                  style={{
                    color: m.color,
                    fontFamily: 'Outfit',
                  }}
                >
                  {m.value}
                </div>

                <div
                  className="text-[9px] leading-none mt-0.5"
                  style={{
                    color:
                      'rgba(240,249,244,0.4)',
                  }}
                >
                  {m.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating stat chips */}
      {[
        {
          label: 'BMI',
          value: '24.5',
          sub: 'Normal',
          pos: {
            top: '4%',
            left: '6%',
          },
          delay: '0s',
        },
        {
          label: 'Water',
          value: '2.8L',
          sub: 'Daily',
          pos: {
            top: '4%',
            right: '18%',
          },
          delay: '1.2s',
        },
        {
          label: 'BMR',
          value: '1,742',
          sub: 'kcal/day',
          pos: {
            bottom: '2%',
            right: '14%',
          },
          delay: '0.6s',
        },
      ].map((chip) => (
        <div
          key={chip.label}
          className="absolute z-20"
          style={{
            ...chip.pos,
            animation: `float 6s ease-in-out ${chip.delay} infinite`,
          }}
        >
          <div
            className="px-3 py-2 rounded-xl"
            style={{
              background:
                'rgba(11, 21, 18, 0.75)',
              backdropFilter: 'blur(12px)',
              border:
                '1px solid rgba(34, 197, 94, 0.15)',
              minWidth: 72,
            }}
          >
            <div
              className="text-[10px] font-medium mb-0.5"
              style={{
                color:
                  'rgba(240,249,244,0.4)',
              }}
            >
              {chip.label}
            </div>

            <div
              className="text-sm font-bold text-white"
              style={{
                fontFamily: 'Outfit',
              }}
            >
              {chip.value}
            </div>

            <div
              className="text-[9px] mt-0.5"
              style={{
                color: '#4ade80',
              }}
            >
              {chip.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  className = '',
  style = {},
}: {
  icon: string;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group ${className}`}
      style={{
        background:
          'rgba(15, 28, 23, 0.8)',
        border:
          '1px solid rgba(34, 197, 94, 0.08)',
        ...style,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform duration-200 group-hover:scale-110"
        style={{
          background:
            'rgba(34, 197, 94, 0.12)',
        }}
      >
        {icon}
      </div>

      <h3
        className="text-base font-semibold text-white mb-2"
        style={{
          fontFamily: 'var(--font-display)',
        }}
      >
        {title}
      </h3>

      <p
        className="text-sm leading-relaxed"
        style={{
          color:
            'rgba(240,249,244,0.5)',
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  /* Authentication-aware navigation */
  const isAuthenticated =
    !!localStorage.getItem('access_token');

  const handleBuildPlan = () => {
    navigate(
      isAuthenticated
        ? '/planner'
        : '/login'
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#0b1512',
      }}
    >
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background blobs */}
        <div
          className="absolute animate-blob"
          style={{
            width: 600,
            height: 600,
            background:
              'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)',
            top: '-10%',
            right: '-5%',
            borderRadius:
              '60% 40% 30% 70% / 60% 30% 70% 40%',
          }}
        />

        <div
          className="absolute animate-blob"
          style={{
            width: 400,
            height: 400,
            background:
              'radial-gradient(circle, rgba(21, 128, 61, 0.06) 0%, transparent 70%)',
            bottom: '5%',
            left: '-5%',
            animationDelay: '4s',
            borderRadius:
              '30% 60% 70% 40% / 50% 60% 30% 60%',
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)',
            backgroundSize:
              '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left */}
            <div className="animate-slide-up">

              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
                style={{
                  background:
                    'rgba(34, 197, 94, 0.08)',
                  border:
                    '1px solid rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  fontFamily:
                    'var(--font-display)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#22c55e',
                    boxShadow:
                      '0 0 6px #22c55e',
                  }}
                />

                Science-backed nutrition planning
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
                style={{
                  fontFamily:
                    'var(--font-display)',
                  color: '#f0f9f4',
                }}
              >
                Your body
                <br />
                has a goal.
                <br />

                <span
                  style={{
                    background:
                      'linear-gradient(90deg, #22c55e, #4ade80)',
                    WebkitBackgroundClip:
                      'text',
                    WebkitTextFillColor:
                      'transparent',
                  }}
                >
                  Your nutrition
                </span>

                <br />
                should too.
              </h1>

              <p
                className="text-lg leading-relaxed mb-10 max-w-md"
                style={{
                  color:
                    'rgba(240,249,244,0.55)',
                  fontFamily:
                    'var(--font-body)',
                }}
              >
                NutriPlan generates your
                personalized daily nutrition
                targets and complete meal plan —
                calibrated to your body, goals, and
                lifestyle.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">

                {/* Build My Plan */}
                <button
                  onClick={handleBuildPlan}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-2xl"
                  style={{
                    fontFamily:
                      'var(--font-display)',
                    background:
                      'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#0b1512',
                    boxShadow:
                      '0 0 30px rgba(34, 197, 94, 0.25)',
                  }}
                >
                  Build My Plan

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  className="px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    fontFamily:
                      'var(--font-display)',
                    background:
                      'rgba(240,249,244,0.04)',
                    color:
                      'rgba(240,249,244,0.75)',
                    border:
                      '1px solid rgba(240,249,244,0.1)',
                  }}
                  onClick={() => {
                    document
                      .getElementById(
                        'how-it-works'
                      )
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      });
                  }}
                >
                  Explore NutriPlan
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6">
                {[
                  {
                    val: '10K+',
                    label: 'Plans generated',
                  },
                  {
                    val: '98%',
                    label: 'Accuracy rate',
                  },
                  {
                    val: 'Free',
                    label: 'Always & forever',
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="text-xl font-bold"
                      style={{
                        fontFamily:
                          'var(--font-display)',
                        color: '#22c55e',
                      }}
                    >
                      {stat.val}
                    </div>

                    <div
                      className="text-xs"
                      style={{
                        color:
                          'rgba(240,249,244,0.4)',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visualization */}
            <div
              className="relative"
              style={{
                animationDelay: '0.3s',
              }}
            >
              <div
                className="relative rounded-3xl overflow-hidden p-4"
                style={{
                  background:
                    'rgba(15, 28, 23, 0.5)',
                  border:
                    '1px solid rgba(34, 197, 94, 0.1)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <NutritionViz />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-bounce">

          <div
            className="text-xs tracking-widest uppercase"
            style={{
              color:
                'rgba(240,249,244,0.25)',
              fontFamily:
                'var(--font-display)',
            }}
          >
            Scroll
          </div>

          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
          >
            <path
              d="M8 1v18M1 12l7 7 7-7"
              stroke="rgba(34,197,94,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative py-28 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.03) 50%, transparent 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

          <div className="text-center mb-20">

            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{
                color: '#22c55e',
                fontFamily:
                  'var(--font-display)',
              }}
            >
              The Process
            </p>

            <h2
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{
                fontFamily:
                  'var(--font-display)',
                color: '#f0f9f4',
              }}
            >
              From you to your plan
              <br />
              in four steps.
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Connecting line */}
            <div
              className="absolute top-8 left-[12.5%] right-[12.5%] h-px hidden md:block"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(34,197,94,0.2) 20%, rgba(34,197,94,0.2) 80%, transparent)',
              }}
            />

            {[
              {
                step: '01',
                label: 'Your basics',
                desc:
                  'Age, gender, height, and weight.',
              },
              {
                step: '02',
                label: 'Your goal',
                desc:
                  'Lose, maintain, or build mass.',
              },
              {
                step: '03',
                label: 'Activity level',
                desc:
                  'How active is your lifestyle?',
              },
              {
                step: '04',
                label: 'Diet preference',
                desc:
                  'Vegetarian or non-vegetarian.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-lg font-bold z-10"
                  style={{
                    background:
                      'rgba(34, 197, 94, 0.1)',
                    border:
                      '1px solid rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    fontFamily:
                      'var(--font-display)',
                    boxShadow:
                      '0 0 20px rgba(34, 197, 94, 0.07)',
                  }}
                >
                  {s.step}
                </div>

                <h3
                  className="text-base font-semibold text-white mb-2"
                  style={{
                    fontFamily:
                      'var(--font-display)',
                  }}
                >
                  {s.label}
                </h3>

                <p
                  className="text-sm"
                  style={{
                    color:
                      'rgba(240,249,244,0.45)',
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="mb-16">

            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{
                color: '#22c55e',
                fontFamily:
                  'var(--font-display)',
              }}
            >
              What you get
            </p>

            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                fontFamily:
                  'var(--font-display)',
                color: '#f0f9f4',
              }}
            >
              Everything your body needs.
              <br />
              Nothing it doesn't.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Large card */}
            <div
              className="md:col-span-2 rounded-2xl p-8 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15,28,23,0.9) 0%, rgba(22,36,25,0.8) 100%)',
                border:
                  '1px solid rgba(34, 197, 94, 0.1)',
              }}
            >
              <div
                className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                style={{
                  background:
                    'radial-gradient(circle, #22c55e 0%, transparent 70%)',
                  transform:
                    'translate(30%, -30%)',
                }}
              />

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-6"
                style={{
                  background:
                    'rgba(34, 197, 94, 0.12)',
                }}
              >
                🎯
              </div>

              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{
                  fontFamily:
                    'var(--font-display)',
                }}
              >
                Precision-calibrated nutrition
              </h3>

              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{
                  color:
                    'rgba(240,249,244,0.5)',
                }}
              >
                We use the Mifflin-St Jeor equation
                and activity multipliers to compute
                your exact BMR, TDEE, and macro targets
                — no guesswork, no generic advice.
              </p>

              <div className="mt-8 flex gap-3 flex-wrap">
                {[
                  'BMR',
                  'TDEE',
                  'Macros',
                  'Water',
                  'BMI',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background:
                        'rgba(34, 197, 94, 0.08)',
                      color: '#4ade80',
                      border:
                        '1px solid rgba(34, 197, 94, 0.12)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <FeatureCard
              icon="🥗"
              title="Smart meal plans"
              description="Structured daily meals timed for your metabolism, respecting your dietary preferences."
            />

            <FeatureCard
              icon="💧"
              title="Hydration targets"
              description="Personalized daily water intake calculated from your body weight and activity."
            />

            <FeatureCard
              icon="📊"
              title="Visual dashboard"
              description="Clean, intuitive charts for calories, macros, BMI, and your full meal timeline."
            />

            <FeatureCard
              icon="⚡"
              title="Instant results"
              description="Generate your complete nutrition plan in seconds. No sign-up, no waiting."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 70%)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)',
            backgroundSize:
              '40px 40px',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">

          <h2
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
            style={{
              fontFamily:
                'var(--font-display)',
              color: '#f0f9f4',
            }}
          >
            Ready to eat with
            <br />

            <span
              style={{
                background:
                  'linear-gradient(90deg, #22c55e, #4ade80)',
                WebkitBackgroundClip:
                  'text',
                WebkitTextFillColor:
                  'transparent',
              }}
            >
              intention?
            </span>
          </h2>

          <p
            className="text-lg mb-10 leading-relaxed"
            style={{
              color:
                'rgba(240,249,244,0.5)',
            }}
          >
            Build your personalized nutrition plan
            in under 2 minutes. Free, science-backed,
            and built for real bodies.
          </p>

          {/* Authentication-aware CTA */}
          <button
            onClick={handleBuildPlan}
            className="px-10 py-4 rounded-full font-bold text-base transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-2xl"
            style={{
              fontFamily:
                'var(--font-display)',
              background:
                'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#0b1512',
              boxShadow:
                '0 0 40px rgba(34, 197, 94, 0.3)',
            }}
          >
            Build My Plan — It's Free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}