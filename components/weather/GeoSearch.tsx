"use client";
import { useState, useEffect, useRef } from "react";
import { searchCity } from "../../services/geocoding";

export const GeoSearch = ({ onSelect }: { onSelect: (city: any) => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 3) {
        const cities = await searchCity(query);
        setResults(cities);
        setIsOpen(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Fechar a lista ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md z-50">
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar cidade..."
          className="w-full bg-[#1b2635] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute mt-2 w-full bg-[#1b2635] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((city) => (
            <li
              key={city.id}
              onClick={() => {
                onSelect(city);
                setQuery(city.name);
                setIsOpen(false);
              }}
              className="px-5 py-3 hover:bg-white/5 cursor-pointer flex flex-col transition-colors border-b border-white/5 last:border-0"
            >
              <span className="font-bold text-white text-sm">{city.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {city.admin1}, {city.country_code}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
