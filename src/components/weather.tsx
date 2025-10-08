"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function Weather() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getTemperatureMessage = (temperature: number, unit: string): string => {
    if (unit === "C") {
      if (temperature < 0) return `It's freezing at ${temperature}°C! Bundle up!`;
      if (temperature < 10) return `Quite cold at ${temperature}°C. Wear warm clothes.`;
      if (temperature < 20) return `Nice weather at ${temperature}°C. Light jacket time!`;
      if (temperature < 30) return `Pleasant ${temperature}°C. Enjoy your day!`;
      return `It's hot at ${temperature}°C. Stay hydrated!`;
    } else {
      return `${temperature}°${unit}`;
    }
  };

  const getWeatherMessage = (desc: string): string => {
    switch (desc.toLowerCase()) {
      case "sunny":
        return "Beautiful sunny day!";
      case "partly cloudy":
        return "Some clouds, some sunshine.";
      case "cloudy":
        return "Overcast skies today.";
      case "rain":
        return "Don't forget your umbrella!";
      case "thunderstorm":
        return "Thunderstorms expected. Stay safe.";
      default:
        return desc;
    }
  };

  const getLocationMessage = (location: string): string => {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;
    return `${location} ${isNight ? "at Night" : "during the Day"}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              🌦️ Weather Finder
            </CardTitle>
            <CardDescription className="text-center">
              Search Weather By City Name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center mb-2">{error}</p>
            )}

            {weather && (
              <div className="mt-4 text-center space-y-2">
                <h2 className="text-xl font-semibold text-blue-800 dark:text-pink-800">
                  {getLocationMessage(weather.location)}
                </h2>
                <p className="text-lg font-medium text-red-800 ">
                  {getWeatherMessage(weather.description)}
                </p>
                <p className="text-5xl font-bold text-green-600 ">
                  {weather.temperature}°{weather.unit}
                </p>
                <p className="text-sm text-gray-600 dark:text-yellow-500">
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </p>
                <footer className="mt-6 text-center text-sm text-pink-600 dark:text-gray-400">
                  Made with ❤️ by <span className="font-semibold text-blue-700 dark:text-yellow-400">Alam Zaib</span>
                </footer>
                <div className="flex justify-center gap-4">
                  <a href="https://github.com/Alamzaibsahito" target="_blank" className="hover:text-blue-800 dark:hover:text-yellow-300 transition-colors">
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/alamzaib-sahito-7276972ba/" target="_blank" className="hover:text-blue-800 dark:hover:text-yellow-300 transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>

            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
