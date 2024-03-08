import React, { useMemo, useCallback } from 'react';
import { Weather } from '../../data/weatherData';

export enum TemperatureUnit {
  C,
  F,
}

interface WeatherCardProps {
  weather: Weather;
  unit: TemperatureUnit;
  onAddFavorite: (cityId: number) => void;
  onRemoveFavorite: (cityId: number) => void;
  isFavorite: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  unit,
  onAddFavorite,
  onRemoveFavorite,
  isFavorite,
}) => {
  const celsiusToFahrenheit = useCallback(function(celsius: number): number {
    return celsius * 9/5 + 32;
  }, []);

  const celsiusTemp = useMemo(() => weather.temperature, [weather.temperature]);
  const fahrenheitTemp = useMemo(() => celsiusToFahrenheit(celsiusTemp), [celsiusTemp, celsiusToFahrenheit]);
  const temperatureWithUnit = useMemo(() => unit === TemperatureUnit.C ? `${celsiusTemp.toFixed(1)}°C` : `${fahrenheitTemp.toFixed(1)}°F`, [unit, celsiusTemp, fahrenheitTemp]);

  return (
    <tr className="weather-card" data-testid={`weather-card-${weather.id}`}>
      <td>{ weather.city }</td>
      <td>{ temperatureWithUnit }</td>
      <td>{ weather.description }</td>
      <td>
        { 
          !isFavorite ?
            <button onClick={() => onAddFavorite(weather.id)} data-testid={`weather-card-action-${weather.id}`}>
              Add to favorites
            </button>
          :
            <button onClick={() => onRemoveFavorite(weather.id)} data-testid={`weather-card-action-${weather.id}`}>
              Remove from favorites
            </button>
        }
      </td>
    </tr>
  );
};

export default WeatherCard;

