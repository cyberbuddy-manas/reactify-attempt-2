'use client';

import { useEffect, useState } from 'react';

export function RestaurantTemplate({ subdomain }: { subdomain: string }) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/restaurants/${subdomain}`);
        
        if (!response.ok) {
          throw new Error('Restaurant not found'); 
        }
        
        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load restaurant');
        // Fallback to placeholder data if API fails
        setRestaurant({
          name: subdomain,
          tagline: "Premium Restaurant Experience",
          description: "Coming soon...",
          logo: "",
          priceRange: "€€-€€€",
          openingNote: "Opens at 5:30 PM",
          language: "English",
          links: [],
          hours: [],
          address: "TBD",
          phone: "TBD",
        });
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchRestaurant();
    }
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-zinc-200 border-t-zinc-800 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Restaurant not found'}</p>
          <p className="text-gray-600 text-sm">Subdomain: {subdomain}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header Bar */}
      <div className="border-b border-teal-200 bg-white py-3 text-center">
        <p className="text-xs tracking-widest text-gray-500">
          {subdomain.toUpperCase()} • KOBLENZ
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-teal-200 bg-linear-to-br from-teal-100 to-blue-100 shadow-lg overflow-hidden">
            {restaurant.logo && restaurant.logo.startsWith('data:image') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={restaurant.logo} alt={restaurant.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-teal-700">
                {restaurant.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 capitalize">
            {restaurant.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{restaurant.description}</p>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-block bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 rounded-full">
              {restaurant.priceRange}
            </span>
            <span className="inline-block bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 rounded-full">
              {restaurant.openingNote}
            </span>
            <span className="inline-block bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 rounded-full">
              {restaurant.language}
            </span>
          </div>
        </div>

        {/* Link Cards Grid */}
        <div className="mb-8 grid gap-3">
          {restaurant.links && restaurant.links.length > 0 ? (
            restaurant.links.map((link: any) => (
              <button
                key={link.id}
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{link.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{link.title}</p>
                    <p className="text-xs text-gray-500">{link.description}</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-teal-600">→</span>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">No links available</p>
          )}
        </div>

        {/* Opening Hours */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-4 font-bold text-gray-900">Opening Hours</h3>
          <div className="space-y-2 text-sm">
            {restaurant.hours && restaurant.hours.length > 0 ? (
              <>
                {restaurant.hours.map((h: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-medium text-gray-600">{h.day}</span>
                    <span className="text-gray-500">{h.time}</span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500 text-sm py-4">Hours not available</p>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 font-bold text-gray-900">Contact</h3>
          <p className="mb-2 text-sm text-gray-700">{restaurant.address}</p>
          <p className="text-sm font-bold text-gray-900">
            Phone: <span className="text-red-600">{restaurant.phone}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white py-3 hover:border-teal-300 hover:bg-teal-50">
            <span className="text-xs font-semibold text-gray-700">Call</span>
          </button>
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white py-3 hover:border-teal-300 hover:bg-teal-50">
            <span className="text-xs font-semibold text-gray-700">Route</span>
          </button>
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white py-3 hover:border-teal-300 hover:bg-teal-50">
            <span className="text-xs font-semibold text-gray-700">Reserve</span>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          <p>© 2026 {restaurant.name.charAt(0).toUpperCase() + restaurant.name.slice(1)}</p>
          <p className="mt-1">Powered by <span className="font-bold text-teal-600">VTap</span></p>
        </div>
      </div>
    </div>
  );
}
