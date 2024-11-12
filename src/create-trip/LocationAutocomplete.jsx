/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const LocationAutocomplete = ({ selectProps }) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with existing place if provided
  useEffect(() => {
    if (selectProps?.place) {
      setSearchText(selectProps.place.label || '');
    }
  }, [selectProps?.place]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchText.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchText)}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`,
          { method: 'GET' }
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const handleSelect = (suggestion) => {
    const formattedSelection = {
      label: suggestion.properties.formatted,
      value: {
        description: suggestion.properties.formatted,
        place_id: suggestion.properties.place_id,
        structured_formatting: {
          main_text: suggestion.properties.city || suggestion.properties.name,
          secondary_text: suggestion.properties.country
        },
        // Adding coordinates if needed
        geometry: {
          location: {
            lat: suggestion.properties.lat,
            lng: suggestion.properties.lon
          }
        }
      }
    };

    setSearchText(formattedSelection.label);
    setSuggestions([]);
    
    // Call the onChange handler with formatted data
    if (selectProps?.onChange) {
      selectProps.onChange(formattedSelection);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400"
          placeholder="Enter a destination..."
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <div className="animate-spin">⟳</div>
          ) : (
            <span>🔍</span>
          )}
        </div>
      </div>
      
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-100 rounded-xl mt-2 max-h-64 overflow-y-auto z-50 shadow-xl">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.properties.place_id}
              className="px-6 py-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-50 last:border-none"
              onClick={() => handleSelect(suggestion)}
            >
              <div className="flex items-center gap-3">
                <span className="text-blue-500">📍</span>
                <div>
                  <p className="font-medium text-gray-900">
                    {suggestion.properties.city || suggestion.properties.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {suggestion.properties.country}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;