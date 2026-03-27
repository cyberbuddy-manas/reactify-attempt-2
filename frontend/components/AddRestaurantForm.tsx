'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';

interface LinkItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  url: string;
}

interface Hour {
  day: string;
  time: string;
}

const field = "w-full h-10 px-3 text-sm text-zinc-900 bg-white border border-zinc-200 rounded-md outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 transition placeholder:text-zinc-400";
const label = "block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide";

export function AddRestaurantForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    subdomain: '',
    name: '',
    tagline: '',
    description: '',
    logo: '',
    priceRange: '€€',
    openingNote: 'Opens at 5:30 PM',
    language: 'English',
    address: '',
    phone: '',
    email: '',
    primaryColor: '#18181b',
    secondaryColor: '#52525b',
    pageTitle: '',
    favicon: '',
  });

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [hours, setHours] = useState<Hour[]>([]);

  const [newLink, setNewLink] = useState<LinkItem>({ id: '', icon: '', title: '', description: '', url: '' });
  const [newHour, setNewHour] = useState<Hour>({ day: '', time: '' });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, logo: base64 }));
        setError(null);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    // reset input so re-selecting the same file triggers onChange
    e.target.value = '';
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Favicon must be under 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const SIZE = 64;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const base64 = canvas.toDataURL('image/png');
        setFormData(prev => ({ ...prev, favicon: base64 }));
        setError(null);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLink = () => {
    if (!newLink.title) { setError('Link title is required'); return; }
    setLinks([...links, { ...newLink, id: Date.now().toString() }]);
    setNewLink({ id: '', icon: '', title: '', description: '', url: '' });
    setError(null);
  };

  const addHour = () => {
    if (!newHour.day || !newHour.time) { setError('Day and time are required'); return; }
    setHours([...hours, newHour]);
    setNewHour({ day: '', time: '' });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.subdomain.trim() || !formData.name.trim()) throw new Error('Subdomain and name are required');
      if (formData.subdomain.includes(' ')) throw new Error('Subdomain cannot contain spaces');

      const response = await fetch('http://localhost:5000/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, links, hours }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create restaurant');
      }

      const result = await response.json();
      setSuccess(true);
      setFormData({ subdomain: '', name: '', tagline: '', description: '', logo: '', priceRange: '€€', openingNote: 'Opens at 5:30 PM', language: 'English', address: '', phone: '', email: '', primaryColor: '#18181b', secondaryColor: '#52525b', pageTitle: '', favicon: '' });
      setLinks([]);
      setHours([]);
      setTimeout(() => { window.location.href = `http://${result.subdomain}.localhost:3000`; }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Status */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-3">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-4 py-3">Restaurant created — redirecting...</p>
      )}

      {/* Section: Identity */}
      <section className="space-y-5">
        <div className="border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-semibold text-zinc-900">Identity</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Subdomain <span className="text-red-400">*</span></label>
            <input name="subdomain" value={formData.subdomain} onChange={handleInputChange} placeholder="my-restaurant" className={field} required />
            {formData.subdomain && (
              <p className="mt-1.5 text-xs text-zinc-400">{formData.subdomain}.localhost:3000</p>
            )}
          </div>
          <div>
            <label className={label}>Name <span className="text-red-400">*</span></label>
            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Restaurant name" className={field} required />
          </div>
          <div>
            <label className={label}>Tagline</label>
            <input name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="Short description" className={field} />
          </div>
          <div>
            <label className={label}>Page title <span className="text-zinc-400 normal-case font-normal">(browser tab)</span></label>
            <input name="pageTitle" value={formData.pageTitle} onChange={handleInputChange} placeholder={formData.name || 'My Restaurant'} className={field} />
          </div>
          <div>
            <label className={label}>Favicon</label>
            <input ref={faviconInputRef} type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
            <div className="flex gap-3 items-center">
              {formData.favicon ? (
                <div className="relative h-10 w-10 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.favicon} alt="Favicon preview" className="h-10 w-10 rounded border border-zinc-200 object-cover" />
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, favicon: '' }))} className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-700 transition">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-10 w-10 shrink-0 rounded border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-300">
                  <Upload className="h-4 w-4" />
                </div>
              )}
              <button type="button" onClick={() => faviconInputRef.current?.click()} className="flex items-center gap-1.5 text-sm text-zinc-600 border border-zinc-200 rounded-md px-3 h-9 hover:bg-zinc-50 transition">
                <Upload className="h-3.5 w-3.5" />
                {formData.favicon ? 'Replace' : 'Upload favicon'}
              </button>
            </div>
          </div>
          <div>
            <label className={label}>Logo image</label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div className="flex gap-3 items-center">
              {formData.logo ? (
                <div className="relative h-16 w-16 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.logo} alt="Logo preview" className="h-16 w-16 rounded-lg object-cover border border-zinc-200" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-700 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-300">
                  <Upload className="h-5 w-5" />
                </div>
              )}
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center gap-1.5 text-sm text-zinc-600 border border-zinc-200 rounded-md px-3 h-9 hover:bg-zinc-50 transition"
              >
                <Upload className="h-3.5 w-3.5" />
                {formData.logo ? 'Replace' : 'Upload image'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell customers about your restaurant..." rows={3} className={`${field} h-auto py-2.5 resize-none`} />
        </div>
      </section>

      {/* Section: Contact */}
      <section className="space-y-5">
        <div className="border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-semibold text-zinc-900">Contact</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={label}>Address</label>
            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St, City" className={field} />
          </div>
          <div>
            <label className={label}>Phone</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 8900" className={field} />
          </div>
          <div>
            <label className={label}>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="hello@restaurant.com" className={field} />
          </div>
          <div>
            <label className={label}>Price range</label>
            <select name="priceRange" value={formData.priceRange} onChange={handleInputChange} className={field}>
              <option value="€">€ — Budget</option>
              <option value="€€">€€ — Moderate</option>
              <option value="€€€">€€€ — Expensive</option>
            </select>
          </div>
          <div>
            <label className={label}>Opening note</label>
            <input name="openingNote" value={formData.openingNote} onChange={handleInputChange} placeholder="Opens at 5:30 PM" className={field} />
          </div>
        </div>
      </section>

      {/* Section: Appearance */}
      <section className="space-y-5">
        <div className="border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-semibold text-zinc-900">Appearance</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Primary color</label>
            <div className="flex gap-2 items-center">
              <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleInputChange} className="h-10 w-10 shrink-0 rounded border border-zinc-200 cursor-pointer p-0.5" />
              <input type="text" value={formData.primaryColor} readOnly className={`${field} flex-1 bg-zinc-50 font-mono text-xs`} />
            </div>
          </div>
          <div>
            <label className={label}>Secondary color</label>
            <div className="flex gap-2 items-center">
              <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleInputChange} className="h-10 w-10 shrink-0 rounded border border-zinc-200 cursor-pointer p-0.5" />
              <input type="text" value={formData.secondaryColor} readOnly className={`${field} flex-1 bg-zinc-50 font-mono text-xs`} />
            </div>
          </div>
          <div>
            <label className={label}>Language</label>
            <input name="language" value={formData.language} onChange={handleInputChange} placeholder="English" className={field} />
          </div>
        </div>
      </section>

      {/* Section: Links */}
      <section className="space-y-5">
        <div className="border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-semibold text-zinc-900">Links</h2>
        </div>

        {links.length > 0 && (
          <div className="space-y-2">
            {links.map(link => (
              <div key={link.id} className="flex items-center justify-between px-4 py-3 border border-zinc-100 rounded-md bg-zinc-50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{link.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{link.title}</p>
                    {link.description && <p className="text-xs text-zinc-400">{link.description}</p>}
                  </div>
                </div>
                <button type="button" onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="text-zinc-300 hover:text-zinc-500 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 p-4 border border-dashed border-zinc-200 rounded-md">
          <div>
            <label className={label}>Icon</label>
            <input value={newLink.icon} onChange={e => setNewLink({ ...newLink, icon: e.target.value })} maxLength={2} className={`${field} text-center text-lg`} />
          </div>
          <div>
            <label className={label}>Title</label>
            <input value={newLink.title} onChange={e => setNewLink({ ...newLink, title: e.target.value })} placeholder="Menu" className={field} />
          </div>
          <div>
            <label className={label}>Description</label>
            <input value={newLink.description} onChange={e => setNewLink({ ...newLink, description: e.target.value })} placeholder="View online" className={field} />
          </div>
          <div>
            <label className={label}>URL</label>
            <input type="url" value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://" className={field} />
          </div>
          <div className="col-span-2">
            <button type="button" onClick={addLink} className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition">
              <Plus className="h-3.5 w-3.5" /> Add link
            </button>
          </div>
        </div>
      </section>

      {/* Section: Hours */}
      <section className="space-y-5">
        <div className="border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-semibold text-zinc-900">Hours</h2>
        </div>

        {hours.length > 0 && (
          <div className="space-y-2">
            {hours.map((hour, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border border-zinc-100 rounded-md bg-zinc-50">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{hour.day}</p>
                  <p className="text-xs text-zinc-400">{hour.time}</p>
                </div>
                <button type="button" onClick={() => setHours(hours.filter((_, idx) => idx !== i))} className="text-zinc-300 hover:text-zinc-500 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 p-4 border border-dashed border-zinc-200 rounded-md">
          <div>
            <label className={label}>Day</label>
            <input value={newHour.day} onChange={e => setNewHour({ ...newHour, day: e.target.value })} placeholder="Mon – Fri" className={field} />
          </div>
          <div>
            <label className={label}>Time</label>
            <input value={newHour.time} onChange={e => setNewHour({ ...newHour, time: e.target.value })} placeholder="9:00 AM – 10:00 PM" className={field} />
          </div>
          <div className="col-span-2">
            <button type="button" onClick={addHour} className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition">
              <Plus className="h-3.5 w-3.5" /> Add hours
            </button>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-zinc-100">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-10 px-6 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Creating...' : 'Create restaurant'}
        </button>
        <Link href="/" className="h-10 px-6 flex items-center text-sm font-medium text-zinc-600 border border-zinc-200 rounded-md hover:bg-zinc-50 transition">
          Cancel
        </Link>
      </div>

    </form>
  );
}

