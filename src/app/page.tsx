export default function Home() {
  return (
    <main className="py-6">
      {/* Hero */}
      <section className="text-center py-20 rounded gradient-hero fade-in">
        <h1 className="text-5xl font-extrabold mb-4">Discover Nigerian Businesses Near You</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Search salons, restaurants, pharmacies, mechanics and more. Business owners can list their business
          and get ratings from real customers.
        </p>
        <div className="flex gap-3 justify-center">
          <a href="/search" className="btn btn-primary">Search businesses</a>
          <a href="/register" className="btn btn-outline">List your business</a>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-4">Popular categories</h2>
        <div className="grid sm:grid-cols-4 gap-4 fade-in">
          {[
            { label: "food", href: "/search?q=food", img: "https://images.pexels.com/photos/33523254/pexels-photo-33523254.jpeg?auto=compress&cs=tinysrgb&w=800" },
            { label: "beauty", href: "/search?q=beauty", img: "https://cdn1.treatwell.net/images/view/v2.i15067338.w1280.h800.x806F6E21/?auto=compress&cs=tinysrgb&w=800" },
            { label: "health", href: "/search?q=health", img: "https://images.pexels.com/photos/8460150/pexels-photo-8460150.jpeg?auto=compress&cs=tinysrgb&w=800" },
            { label: "auto", href: "/search?q=auto", img: "https://images.pexels.com/photos/4488661/pexels-photo-4488661.jpeg?auto=compress&cs=tinysrgb&w=800" },
          ].map((c) => (
            <a key={c.label} href={c.href} className="card p-0 overflow-hidden hover:shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.label} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="font-semibold text-gray-900 dark:text-white">{c.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Click to explore nearby options</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-4 fade-in">
          <div className="rounded border p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Search" className="w-full h-32 object-cover rounded mb-3" />
            <div className="font-semibold mb-1">1. Search</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Find businesses by name, category or city.</div>
          </div>
          <div className="rounded border p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Compare" className="w-full h-32 object-cover rounded mb-3" />
            <div className="font-semibold mb-1">2. Compare</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Check ratings and details to pick the best.</div>
          </div>
          <div className="rounded border p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Connect" className="w-full h-32 object-cover rounded mb-3" />
            <div className="font-semibold mb-1">3. Connect</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Call or visit with confidence.</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-4">What people say</h2>
        <div className="grid sm:grid-cols-3 gap-4 fade-in">
          {[
            { name: "Chioma", text: "Found a great salon in Abuja. Very easy to use.", img: "https://images.pexels.com/photos/29118561/pexels-photo-29118561/free-photo-of-young-nigerian-woman-in-traditional-hijab.jpeg?auto=compress&cs=tinysrgb&w=400" },
            { name: "Emeka", text: "The ratings helped me pick the right mechanic in Kano.", img: "https://t3.ftcdn.net/jpg/03/43/55/84/360_F_343558406_tzgulGVRbnvmISA1MjLzxtYlY4nsrPKb.jpg?auto=compress&cs=tinysrgb&w=400" },
            { name: "Zainab", text: "Nice to see Nigerian businesses with clear details.", img: "https://www.shutterstock.com/image-photo/portrait-attractive-smiling-arabian-woman-260nw-2434783671.jpg?auto=compress&cs=tinysrgb&w=400" },
          ].map((t) => (
            <div key={t.name} className="rounded border p-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt={t.name} className="w-full h-32 object-cover" />
              <div className="p-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">“{t.text}”</div>
              <div className="mt-2 font-semibold">— {t.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 pt-6 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
        <div>© {new Date().getFullYear()} BizFinder</div>
        <div className="flex gap-3">
          <a href="/search">Search</a>
          <a href="/register">List business</a>
        </div>
      </footer>
    </main>
  );
}
