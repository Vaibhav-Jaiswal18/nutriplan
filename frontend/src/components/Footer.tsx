import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#050d09', borderTop: '1px solid rgba(34, 197, 94, 0.06)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2C8 2 3 5 3 9.5C3 12 5.5 14 8 14C10.5 14 13 12 13 9.5C13 5 8 2 8 2Z"
                    fill="white"
                    opacity="0.9"
                  />
                  <path
                    d="M8 6V11M6 8.5C6 8.5 7 7 8 7C9 7 10 8.5 10 8.5"
                    stroke="rgba(11,21,18,0.7)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span
                className="text-lg font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                NutriPlan
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(240,249,244,0.45)' }}>
              Personalized nutrition made simple. Science-backed plans tailored to your body, goals, and lifestyle.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <button
                  key={social}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 text-xs"
                  style={{
                    background: 'rgba(34, 197, 94, 0.07)',
                    color: 'rgba(240,249,244,0.4)',
                    border: '1px solid rgba(34, 197, 94, 0.1)',
                  }}
                  aria-label={social}
                >
                  {social[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: '#22c55e', fontFamily: 'var(--font-display)' }}
            >
              Product
            </p>
            <ul className="space-y-3">
              {['How it works', 'Features', 'Planner', 'Nutrition Science'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-sm transition-colors duration-200 hover:text-green-400"
                    style={{ color: 'rgba(240,249,244,0.45)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: '#22c55e', fontFamily: 'var(--font-display)' }}
            >
              Company
            </p>
            <ul className="space-y-3">
              {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-sm transition-colors duration-200 hover:text-green-400"
                    style={{ color: 'rgba(240,249,244,0.45)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(34, 197, 94, 0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(240,249,244,0.3)' }}>
            © 2024 NutriPlan. Built for your best self.
          </p>
          <p className="text-xs" style={{ color: 'rgba(240,249,244,0.2)' }}>
            Made with intention · Not medical advice
          </p>
        </div>
      </div>
    </footer>
  );
}
