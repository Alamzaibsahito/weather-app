"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, SunIcon, CloudRainIcon, Loader2 } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

const getGradient = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("sunny") || desc.includes("clear")) return "from-orange-400 to-blue-500";
  if (desc.includes("rain") || desc.includes("storm")) return "from-blue-700 to-gray-700";
  return "from-blue-400 to-purple-500";
};

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("sunny") || desc.includes("clear")) return <SunIcon className="w-16 h-16 text-yellow-300" />;
  if (desc.includes("rain")) return <CloudRainIcon className="w-16 h-16 text-blue-200" />;
  return <CloudIcon className="w-16 h-16 text-gray-200" />;
};

export default function Weather() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (location.trim() === "") {
      setError("Please enter a location.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location}`
      );
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      setWeather({
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      });
    } catch {
      setError("City not found.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br transition-all duration-1000 ${weather ? getGradient(weather.description) : "from-gray-800 to-gray-900"}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-white rounded-3xl">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Weather Finder</h1>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <Input
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl"
                placeholder="Enter city..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button type="submit" disabled={isLoading} className="bg-white/20 hover:bg-white/30 rounded-xl">
                {isLoading ? <Loader2 className="animate-spin" /> : "Search"}
              </Button>
            </form>

            <AnimatePresence mode="wait">
              {weather && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="flex justify-center mb-4">
                    {getWeatherIcon(weather.description)}
                  </motion.div>
                  <h2 className="text-3xl font-semibold mb-1">{weather.location}</h2>
                  <p className="text-xl opacity-80 mb-4">{weather.description}</p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-7xl font-bold">
                    {weather.temperature}°C
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            {error && <motion.p animate={{ x: [-5, 5, -5, 5, 0] }} className="text-red-300 text-center">{error}</motion.p>}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
