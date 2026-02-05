import { useState, useEffect } from 'react';
import { Country, City } from 'country-state-city';
import { MapPin } from 'lucide-react';

const LocationSelector = ({ onLocationSelect, defaultCountry, defaultCity, label = "Lieu", error }) => {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(defaultCountry || '');
    const [selectedCity, setSelectedCity] = useState(defaultCity || '');

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            const countryData = countries.find(c => c.name === selectedCountry || c.isoCode === selectedCountry);
            if (countryData) {
                setCities(City.getCitiesOfCountry(countryData.isoCode));
            } else {
                setCities([]);
            }
        }
    }, [selectedCountry, countries]);

    const handleCountryChange = (e) => {
        const countryName = e.target.value;
        setSelectedCountry(countryName);
        setSelectedCity(''); // Reset city
        onLocationSelect({ country: countryName, city: '' });
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setSelectedCity(cityName);
        onLocationSelect({ country: selectedCountry, city: cityName });
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="grid grid-cols-2 gap-4">
                {/* Country Selector */}
                <div>
                    <select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent`}
                    >
                        <option value="">Pays...</option>
                        {countries.map((c) => (
                            <option key={c.isoCode} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* City Selector */}
                <div>
                    <select
                        value={selectedCity}
                        onChange={handleCityChange}
                        disabled={!selectedCountry}
                        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                        <option value="">Ville...</option>
                        {cities.map((c) => (
                            <option key={c.name} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default LocationSelector;
