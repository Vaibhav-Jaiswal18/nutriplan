import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated =
    !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    setMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Planner', href: '/planner' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(11, 21, 18, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(34, 197, 94, 0.08)'
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div
          className="flex items-center justify-between transition-all duration-300"
          style={{
            height: scrolled ? '60px' : '76px',
          }}
        >

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, #22c55e, #16a34a)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
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
              className="text-lg font-bold tracking-tight text-white"
              style={{
                fontFamily: 'var(--font-display)',
              }}
            >
              NutriPlan
            </span>
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">

            {navLinks.map((link) => {
              const active =
                location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: active
                      ? '#22c55e'
                      : 'rgba(240, 249, 244, 0.65)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color =
                        '#f0f9f4';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color =
                        'rgba(240, 249, 244, 0.65)';
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* My Plans - logged in only */}
            {isAuthenticated && (
              <Link
                to="/my-plans"
                className="text-sm font-medium transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-display)',
                  color:
                    location.pathname.startsWith('/my-plans')
                      ? '#22c55e'
                      : 'rgba(240, 249, 244, 0.65)',
                }}
              >
                My Plans
              </Link>
            )}
          </div>


          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/my-plans')}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background:
                      'rgba(34, 197, 94, 0.1)',
                    color: '#4ade80',
                    border:
                      '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  My Plans
                </button>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background:
                      'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#0b1512',
                    boxShadow:
                      '0 0 20px rgba(34, 197, 94, 0.2)',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                style={{
                  fontFamily: 'var(--font-display)',
                  background:
                    'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#0b1512',
                  boxShadow:
                    '0 0 20px rgba(34, 197, 94, 0.2)',
                }}
              >
                Get Started
              </button>
            )}
          </div>


          {/* Mobile Burger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className="w-5 h-0.5 bg-white/70 transition-all duration-200 rounded"
              style={{
                transform: menuOpen
                  ? 'rotate(45deg) translateY(6px)'
                  : 'none',
              }}
            />

            <span
              className="w-5 h-0.5 bg-white/70 rounded transition-all duration-200"
              style={{
                opacity: menuOpen ? 0 : 1,
              }}
            />

            <span
              className="w-5 h-0.5 bg-white/70 transition-all duration-200 rounded"
              style={{
                transform: menuOpen
                  ? 'rotate(-45deg) translateY(-6px)'
                  : 'none',
              }}
            />
          </button>

        </div>
      </div>


      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          background: 'rgba(11, 21, 18, 0.97)',
          backdropFilter: 'blur(20px)',
        }}
      >

        <div className="px-6 py-4 flex flex-col gap-4 border-t border-white/5">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-base font-medium text-white/75 hover:text-white transition-colors py-1"
              style={{
                fontFamily: 'var(--font-display)',
              }}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/my-plans')}
                className="mt-2 px-5 py-3 rounded-xl text-sm font-semibold w-full text-center"
                style={{
                  fontFamily: 'var(--font-display)',
                  background:
                    'rgba(34, 197, 94, 0.1)',
                  color: '#4ade80',
                  border:
                    '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                My Plans
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-3 rounded-xl text-sm font-semibold w-full text-center"
                style={{
                  fontFamily: 'var(--font-display)',
                  background:
                    'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#0b1512',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="mt-2 px-5 py-3 rounded-xl text-sm font-semibold w-full text-center"
              style={{
                fontFamily: 'var(--font-display)',
                background:
                  'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#0b1512',
              }}
            >
              Get Started
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}