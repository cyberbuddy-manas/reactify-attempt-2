export function VTapHomepage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-teal-50 to-blue-50 flex flex-col">
      {/* Navigation */}
      <nav className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">VTap</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl w-full">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-gray-900">
            One Link. <span className="bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Infinite Possibilities</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Your restaurant&apos;s digital hub. Beautiful landing pages powered by subdomain magic.
          </p>
          
          {/* Demo Preview Cards */}
          <div className="mb-10">
            <p className="text-sm text-gray-600 mb-4 font-semibold">See it in action:</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="http://gusto2.localhost:3000"
                className="inline-block bg-white border-2 border-teal-200 px-6 py-4 rounded-lg hover:border-teal-400 hover:shadow-lg transition group hover:scale-105"
              >
                <div className="font-semibold text-gray-900">Gusto 2</div>
                <div className="text-xs text-gray-600 group-hover:text-teal-600">Italian Restaurant</div>
              </a>
              <a 
                href="/middleware-test"
                className="inline-block bg-white border-2 border-blue-200 px-6 py-4 rounded-lg hover:border-blue-400 hover:shadow-lg transition group hover:scale-105"
              >
                <div className="font-semibold text-gray-900">Test Page</div>
                <div className="text-xs text-gray-600 group-hover:text-blue-600">See the magic</div>
              </a>
              <a 
                href="/add-restaurant"
                className="inline-block bg-white border-2 border-purple-200 px-6 py-4 rounded-lg hover:border-purple-400 hover:shadow-lg transition group hover:scale-105"
              >
                <div className="font-semibold text-gray-900">Add Restaurant</div>
                <div className="text-xs text-gray-600 group-hover:text-purple-600">Create new</div>
              </a>
            </div>
          </div>

          {/* CTA Button */}

          {/* Footer Badge */}
          <p className="text-sm text-gray-600 mt-8">
            Built for restaurants • Powered by Next.js & VTap
          </p>
        </div>
      </section>
    </div>
  );
}
