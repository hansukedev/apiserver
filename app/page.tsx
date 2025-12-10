import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Shield, Key, Cloud, ArrowRight, Check } from 'lucide-react';

export default async function LandingPage() {
  const cookieStore = await cookies();

  // Create Supabase Client safely for server component
  // Check env vars to prevent crash during build if missing
  const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;

  if (hasEnvVars) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Server Components can't set cookies, middleware handles this usually
            // or specific route handlers. For reading user, this is fine.
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100 selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">APIServer</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard/packages" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            v1.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-500">
            The Ultimate Game <br className="hidden md:block" /> License Manager
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            Secure your game mods and software with our enterprise-grade licensing system.
            Hardware locking, instant delivery, and a powerful dashboard in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard/packages"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-indigo-600 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-indigo-600 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-100 dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure HWID Lock',
                desc: 'Prevent account sharing by locking licenses to unique hardware identifiers automatically.'
              },
              {
                icon: Key,
                title: 'Instant Key Gen',
                desc: 'Generate thousands of secure license keys in seconds using our cryptic algorithm.'
              },
              {
                icon: Cloud,
                title: 'Cloud Dashboard',
                desc: 'Manage users, keys, and devices from a beautiful, responsive dashboard anywhere.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800/50 hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 bg-gray-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500">Choose the plan that fits your needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="$0"
              features={['Up to 10 Keys', 'Basic Dashboard', 'Community Support']}
            />
            <PricingCard
              title="VIP"
              price="$29"
              period="/mo"
              featured={true}
              features={['Unlimited Keys', 'HWID Locking', 'Priority Support', 'API Access']}
            />
            <PricingCard
              title="Enterprise"
              price="$999"
              features={['Custom Domain', 'White Label', '24/7 Support', 'SLA']}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} APIServer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ title, price, period = '', features, featured = false }: any) {
  return (
    <div className={`p-8 rounded-2xl border ${featured ? 'border-primary bg-primary/5 dark:bg-primary/5' : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'} relative`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
          POPULAR
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="text-gray-500">{period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Check className={`h-5 w-5 ${featured ? 'text-primary' : 'text-gray-400'}`} />
            {feat}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${featured ? 'bg-primary text-white hover:bg-indigo-600' : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'}`}>
        Choose Plan
      </button>
    </div>
  )
}
