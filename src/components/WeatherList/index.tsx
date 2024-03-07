import React, { useState, useRef, useEffect } from 'react';
import { Weather, weatherData } from '../../data/weatherData';
import WeatherCard, { TemperatureUnit } from '../WeatherCard';
import "./index.css";

/**
 * Weather data can change if it's fetched from an external source so is better to store 
 * the ids.
 * 
 * rawData - The array of all items.
 * searchListIds - The ids from the result of filtering with the input or all by default.
 * favoritesListIds - The ids of the items added to the favorites list.
 * tempUnit - The used unit which comes from the child component.
 */
const WeatherList: React.FC = () => {
  const [rawData, setRawData] = useState<Array<Weather>>([]);
  const [searchListIds, setSearchListIds] = useState<Array<Weather['id']>>([]);
  const [favoritesListIds, setFavoritesListIds] = useState<Array<Weather['id']>>([]);
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(TemperatureUnit.C);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * This is supposed to perform an async operation and set the data when the component loads
   * for the first time. The alternative is set this information directly in the `useState` hook.
   */
  useEffect(() => {
    setRawData([...weatherData]);
  }, [])

  /**
   * Initial values (all) for the search list.
   * This part can also be placed in the same hook where the raw data is loaded.
   */
  useEffect(() => {
    const cityIdsList = rawData.map(weather => weather.id)
    setSearchListIds(cityIdsList);
  }, [rawData])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cityNameLowerCase = event.target.value.toLowerCase();
    const cityIds = weatherData
      .filter(weather => weather?.city?.toLowerCase().includes(cityNameLowerCase))
      .map(weather => weather.id);

    setSearchListIds(cityIds);
  };

  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      setSearchListIds(weatherData.map(weather => weather.id));
    }
  };

  const handleUnitChange = () => {
    tempUnit === TemperatureUnit.C ? setTempUnit(TemperatureUnit.F) : setTempUnit(TemperatureUnit.C);
  };

  const handleAddFavorite = (cityId: number) => {
    const isCityFavorite = favoritesListIds.includes(cityId);
    if (!isCityFavorite) {
      setFavoritesListIds(favoritesListIds => [...favoritesListIds, cityId]);
    }
  };

  const handleRemoveFavorite = (cityId: number) => {
    setFavoritesListIds(favoritesListIds => favoritesListIds.filter(favoriteCityId => favoriteCityId !== cityId));
  };

  /**
   * @remarks Prefix to render different keys in each list item.
   */
  function getWeatherCardList(ids: (Weather['id'])[], keyPrefix: string) {
    const filteredData = rawData.filter(weather => ids.includes(weather.id));

    return (
      filteredData.map(weather => {
        return (
          <WeatherCard
            key={`${keyPrefix}-${weather.id}`}
            weather={weather}
            unit={tempUnit}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            isFavorite={favoritesListIds.includes(weather.id)}
          />
        )
      })
    )
  }

  const tempUnitButtonLabel = `Switch to ${tempUnit === TemperatureUnit.C ? 'Fahrenheit' : 'Celsius'}`;

  return (
    <div className="layout-column align-items-center justify-content-start weather-list" data-testid="weather-list">
      <h3>Dashboard</h3>
      <p className="city-details">Search for Current Temperature in cities like: New York, London, Paris etc.</p>
      <div className="card w-300 pt-20 pb-5 mt-5">
        <section className="layout-row align-items-center justify-content-center mt-20 mr-20 ml-20">
          <input
            type="text"
            placeholder="Search city"
            onChange={handleSearch}
            data-testid="search-input"
            ref={searchInputRef}
          />
          <button onClick={handleClearSearch} data-testid="clear-search-button">
            Clear search
          </button>
        </section>
        <table className="table search-results">
          <thead>
            <tr>
              <th>City</th>
              <th>Temperature</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getWeatherCardList(searchListIds, 'search')}
          </tbody>
        </table>
        <section className="layout-row align-items-center justify-content-center mt-20 mr-20 ml-20">
          <button onClick={handleUnitChange} data-testid="unit-change-button" className="outlined">
            {tempUnitButtonLabel}
          </button>
        </section>
      </div>
      <h3>Favourite Cities</h3>
      <div className="card w-300 pt-20 pb-5">
        <table className="table favorites">
          <thead>
            <tr>
              <th>City</th>
              <th>Temperature</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getWeatherCardList(favoritesListIds, 'favorites')}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherList;
