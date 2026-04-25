import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  MapPin,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Season = "winter" | "summer" | "monsoon" | "autumn";
type Condition = "Sunny" | "Partly Cloudy" | "Cloudy" | "Rainy" | "Windy";

interface WeatherData {
  location: string;
  lat: number;
  lng: number;
  temperature: number;
  feelsLike: number;
  condition: Condition;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  rainfall: number;
  season: Season;
  forecast: ForecastDay[];
}

interface ForecastDay {
  date: Date;
  high: number;
  low: number;
  condition: Condition;
  rainfallChance: number;
  rainfall: number;
}

interface Advisory {
  level: "info" | "warning" | "danger";
  title: string;
  description: string;
}

// ─── Mock Weather Engine ──────────────────────────────────────────────────────

function getSeason(month: number): Season {
  if (month >= 1 && month <= 3) return "winter";
  if (month >= 4 && month <= 6) return "summer";
  if (month >= 7 && month <= 9) return "monsoon";
  return "autumn";
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getLatOffset(lat: number): number {
  if (lat > 25) return -3;
  if (lat < 15) return 3;
  return 0;
}

function getCoastalOffsets(
  lng: number,
  lat: number,
): { temp: number; humidity: number } {
  const isCoastal =
    (lng < 74 && lat < 22) ||
    (lng > 79.5 && lat < 16) ||
    (lng > 88 && lat < 22);
  return isCoastal ? { temp: -1, humidity: 15 } : { temp: 0, humidity: 0 };
}

function deriveCondition(
  season: Season,
  humidity: number,
  rainfall: number,
  wind: number,
): Condition {
  if (rainfall > 5) return "Rainy";
  if (season === "monsoon" && humidity > 75) return "Cloudy";
  if (wind > 25) return "Windy";
  if (humidity > 65) return "Partly Cloudy";
  if (season === "winter" && humidity > 55) return "Cloudy";
  return "Sunny";
}

function deriveLocationName(lat: number, lng: number): string {
  if (lat > 30 && lng > 75 && lng < 82) return "Punjab / Himachal";
  if (lat > 28 && lat <= 30 && lng > 76 && lng < 78) return "Delhi NCR";
  if (lat > 26 && lat <= 28 && lng > 78 && lng < 84) return "Uttar Pradesh";
  if (lat > 20 && lat <= 26 && lng > 73 && lng < 79) return "Madhya Pradesh";
  if (lat > 22 && lat <= 26 && lng > 87 && lng < 92) return "West Bengal";
  if (lat > 17 && lat <= 21 && lng > 73 && lng < 80) return "Maharashtra";
  if (lat > 15 && lat <= 17 && lng > 74 && lng < 78) return "Karnataka";
  if (lat > 10 && lat <= 15 && lng > 77 && lng < 80) return "Tamil Nadu";
  if (lat > 8 && lat <= 11 && lng > 76 && lng < 78) return "Kerala";
  if (lat > 17 && lat <= 22 && lng > 80 && lng < 85) return "Telangana / AP";
  if (lat > 20 && lat <= 24 && lng > 68 && lng < 74) return "Gujarat";
  if (lat > 24 && lat <= 28 && lng > 69 && lng < 78) return "Rajasthan";
  if (lat > 25 && lat <= 30 && lng > 84 && lng < 88) return "Bihar";
  return `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
}

function generateWeather(lat: number, lng: number): WeatherData {
  const now = new Date();
  const month = now.getMonth() + 1;
  const season = getSeason(month);
  const latOff = getLatOffset(lat);
  const coastal = getCoastalOffsets(lng, lat);

  const baseRanges: Record<Season, { min: number; max: number }> = {
    winter: { min: 8, max: 22 },
    summer: { min: 28, max: 42 },
    monsoon: { min: 24, max: 32 },
    autumn: { min: 16, max: 28 },
  };

  const range = baseRanges[season];
  const variation = (seededRandom(lat * 100 + lng + now.getDate()) - 0.5) * 10;
  const temperature = Math.round(
    (range.min + range.max) / 2 + latOff + coastal.temp + variation,
  );

  const baseHumidity: Record<Season, number> = {
    winter: 45,
    summer: 30,
    monsoon: 80,
    autumn: 60,
  };
  const humidity = Math.min(
    98,
    Math.max(
      20,
      baseHumidity[season] +
        coastal.humidity +
        Math.round((seededRandom(lat + lng) - 0.5) * 20),
    ),
  );

  const baseWind: Record<Season, number> = {
    winter: 12,
    summer: 18,
    monsoon: 22,
    autumn: 14,
  };
  const windSpeed = Math.max(
    5,
    Math.round(baseWind[season] + (seededRandom(lat * lng) - 0.5) * 10),
  );

  const baseRainfall: Record<Season, number> = {
    winter: 0,
    summer: 0,
    monsoon: 15,
    autumn: 2,
  };
  const rainfall = Math.max(
    0,
    Math.round(
      baseRainfall[season] +
        seededRandom(lat + month) * (season === "monsoon" ? 30 : 4),
    ),
  );

  const uvBase: Record<Season, number> = {
    winter: 3,
    summer: 10,
    monsoon: 5,
    autumn: 6,
  };
  const uvIndex = Math.min(
    12,
    Math.max(1, Math.round(uvBase[season] + (seededRandom(lat * 3) - 0.5) * 2)),
  );

  const condition = deriveCondition(season, humidity, rainfall, windSpeed);
  const location = deriveLocationName(lat, lng);

  const forecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => {
    const forecastDate = new Date(now);
    forecastDate.setDate(now.getDate() + i + 1);
    const seed = lat + lng + i + forecastDate.getDate();
    const dayVar = (seededRandom(seed) - 0.5) * 8;
    const nightVar = (seededRandom(seed + 1) - 0.5) * 6;
    const high = Math.round(temperature + Math.abs(dayVar));
    const low = Math.round(temperature - Math.abs(nightVar) - 4);
    const rainfallChance = Math.round(
      season === "monsoon"
        ? 50 + seededRandom(seed + 2) * 45
        : season === "autumn"
          ? 15 + seededRandom(seed + 2) * 25
          : seededRandom(seed + 2) * 20,
    );
    const fc = deriveCondition(
      season,
      humidity,
      rainfallChance > 60 ? 10 : 0,
      windSpeed,
    );
    return {
      date: forecastDate,
      high,
      low,
      condition: fc,
      rainfallChance,
      rainfall:
        rainfallChance > 60 ? Math.round(seededRandom(seed + 3) * 20 + 2) : 0,
    };
  });

  return {
    location,
    lat,
    lng,
    temperature,
    feelsLike: Math.round(temperature + (humidity > 70 ? 2 : -1)),
    condition,
    humidity,
    windSpeed,
    uvIndex,
    rainfall,
    season,
    forecast,
  };
}

// ─── Advisory Engine ──────────────────────────────────────────────────────────

function generateAdvisories(weather: WeatherData): Advisory[] {
  const advisories: Advisory[] = [];
  const { season, condition, temperature, humidity, uvIndex } = weather;

  if (season === "monsoon") {
    advisories.push({
      level: "danger",
      title: "High Disease Risk",
      description:
        "Monsoon humidity creates ideal conditions for fungal diseases. Apply preventive fungicides (Mancozeb / Copper oxychloride) every 10–14 days.",
    });
    advisories.push({
      level: "warning",
      title: "Waterlogging Alert",
      description:
        "Ensure proper field drainage to prevent root rot. Avoid irrigation unless soil moisture is critically low.",
    });
  }

  if (season === "summer" || temperature > 35) {
    advisories.push({
      level: "warning",
      title: "Increase Irrigation Frequency",
      description:
        "High temperatures cause rapid evapotranspiration. Water crops in early morning or evening to minimize losses.",
    });
    advisories.push({
      level: "info",
      title: "Heat Stress Protection",
      description:
        "Consider mulching to retain soil moisture. Spray dilute potassium nitrate (0.5%) to reduce heat stress in sensitive crops.",
    });
  }

  if (season === "winter" || temperature < 12) {
    advisories.push({
      level: "warning",
      title: "Frost Protection Needed",
      description:
        "Night temperatures may drop near freezing. Cover sensitive crops with agro-nets and avoid irrigation before frost nights.",
    });
    advisories.push({
      level: "info",
      title: "Reduced Pest Activity",
      description:
        "Most insects are less active in winter. Good time to apply systemic insecticides for soil-borne pests.",
    });
  }

  if (season === "autumn") {
    advisories.push({
      level: "info",
      title: "Ideal Rabi Sowing Window",
      description:
        "Excellent season for wheat, mustard, chickpea, and lentils. Prepare fields with basal fertilizer before sowing.",
    });
  }

  if (condition === "Rainy") {
    advisories.push({
      level: "warning",
      title: "Postpone Spraying",
      description:
        "Pesticide or fertilizer spraying is ineffective during rain. Wait for a dry window of at least 4 hours.",
    });
  }

  if (uvIndex >= 8) {
    advisories.push({
      level: "info",
      title: "High UV — Good for Solar Drying",
      description:
        "Use this sunny period to dry harvested produce and seeds. Shade UV-sensitive crops like leafy greens.",
    });
  }

  if (humidity > 75) {
    advisories.push({
      level: "warning",
      title: "Blight & Mildew Risk",
      description:
        "High humidity favors late blight and powdery mildew. Scout fields daily and apply copper-based fungicides if symptoms appear.",
    });
  }

  return advisories;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConditionIcon({
  condition,
  size = 24,
  className = "",
}: {
  condition: Condition;
  size?: number;
  className?: string;
}) {
  const props = { size, className };
  switch (condition) {
    case "Sunny":
      return <Sun {...props} />;
    case "Partly Cloudy":
      return <Cloud {...props} />;
    case "Cloudy":
      return <Cloud {...props} />;
    case "Rainy":
      return <CloudRain {...props} />;
    case "Windy":
      return <Wind {...props} />;
  }
}

const conditionColorMap: Record<Condition, string> = {
  Sunny: "text-yellow-500",
  "Partly Cloudy": "text-sky-400",
  Cloudy: "text-muted-foreground",
  Rainy: "text-blue-500",
  Windy: "text-teal-500",
};

const seasonBg: Record<Season, string> = {
  winter: "from-sky-900/80 to-slate-700/80",
  summer: "from-orange-600/80 to-amber-500/80",
  monsoon: "from-blue-900/80 to-teal-700/80",
  autumn: "from-amber-700/80 to-yellow-600/80",
};

const advisoryStyles: Record<
  Advisory["level"],
  { container: string; icon: React.ReactNode }
> = {
  info: {
    container: "bg-secondary border-primary/20 text-secondary-foreground",
    icon: <Zap size={16} className="text-primary shrink-0 mt-0.5" />,
  },
  warning: {
    container:
      "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-200",
    icon: (
      <Wind
        size={16}
        className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
      />
    ),
  },
  danger: {
    container:
      "bg-red-50 border-red-300 text-red-900 dark:bg-red-950/40 dark:border-red-700 dark:text-red-200",
    icon: (
      <CloudRain
        size={16}
        className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
      />
    ),
  },
};

function WeatherStatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit?: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold text-foreground">
        {value}
        {unit && (
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function ForecastCard({ day, index }: { day: ForecastDay; index: number }) {
  const dayName = day.date.toLocaleDateString("en-IN", { weekday: "short" });
  const dateStr = day.date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const colorClass = conditionColorMap[day.condition];

  return (
    <div
      className="flex flex-col items-center gap-2 bg-card border border-border rounded-xl p-3 min-w-[96px]"
      data-ocid={`weather.forecast.item.${index}`}
    >
      <p className="text-xs font-semibold text-foreground">{dayName}</p>
      <p className="text-xs text-muted-foreground">{dateStr}</p>
      <ConditionIcon
        condition={day.condition}
        size={28}
        className={colorClass}
      />
      <div className="flex gap-1 text-sm font-medium">
        <span className="text-foreground">{day.high}°</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{day.low}°</span>
      </div>
      {day.rainfallChance > 0 && (
        <div className="flex items-center gap-1 text-xs text-blue-500">
          <Droplets size={12} />
          {day.rainfallChance}%
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEFAULT_LAT = 28.6;
const DEFAULT_LNG = 77.2;

type GeoState = "idle" | "loading" | "success" | "denied";

const seasonLabels: Record<Season, string> = {
  winter: "Winter",
  summer: "Summer",
  monsoon: "Monsoon",
  autumn: "Autumn",
};

export default function WeatherInsights() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData>(() =>
    generateWeather(DEFAULT_LAT, DEFAULT_LNG),
  );
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [usingDefault, setUsingDefault] = useState(true);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setUsingDefault(true);
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setWeather(generateWeather(latitude, longitude));
        setGeoState("success");
        setUsingDefault(false);
      },
      () => {
        setGeoState("denied");
        setUsingDefault(true);
        setWeather(generateWeather(DEFAULT_LAT, DEFAULT_LNG));
      },
      { timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const advisories = generateAdvisories(weather);
  const condColorClass = conditionColorMap[weather.condition];

  return (
    <div className="min-h-full bg-background" data-ocid="weather.page">
      {/* Page Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold font-display text-foreground">
            {t("weather.title")}
          </h1>
          {usingDefault && geoState !== "loading" && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing default location (Delhi). Use your location for accurate
              data.
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={requestLocation}
          disabled={geoState === "loading"}
          className="gap-2 shrink-0"
          data-ocid="weather.use_location_button"
        >
          {geoState === "loading" ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <MapPin size={14} />
          )}
          {geoState === "loading" ? "Locating…" : "Use My Location"}
        </Button>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Current Weather Hero */}
        {geoState === "loading" ? (
          <Skeleton
            className="h-56 w-full rounded-2xl"
            data-ocid="weather.loading_state"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            data-ocid="weather.current_card"
          >
            <div
              className={`rounded-2xl bg-gradient-to-br ${seasonBg[weather.season]} p-6 sm:p-8 text-white relative overflow-hidden`}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
                    <MapPin size={14} />
                    <span>{weather.location}</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-7xl font-display font-bold leading-none">
                      {weather.temperature}°
                    </span>
                    <div className="mb-2">
                      <p className="text-white/90 font-medium text-lg">
                        {weather.condition}
                      </p>
                      <p className="text-white/60 text-sm">
                        Feels like {weather.feelsLike}°C
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <ConditionIcon
                    condition={weather.condition}
                    size={64}
                    className="text-white/80"
                  />
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    {seasonLabels[weather.season]}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          data-ocid="weather.stats_section"
        >
          <WeatherStatCard
            icon={<Droplets size={13} />}
            label={t("weather.humidity")}
            value={weather.humidity}
            unit="%"
          />
          <WeatherStatCard
            icon={<Wind size={13} />}
            label={t("weather.windSpeed")}
            value={weather.windSpeed}
            unit="km/h"
          />
          <WeatherStatCard
            icon={<CloudRain size={13} />}
            label={t("weather.rainfall")}
            value={weather.rainfall}
            unit="mm"
          />
          <WeatherStatCard
            icon={<Eye size={13} />}
            label="UV Index"
            value={weather.uvIndex}
          />
        </motion.div>

        {/* 5-Day Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          data-ocid="weather.forecast_section"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sun size={16} className={condColorClass} />
                5-Day Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {weather.forecast.map((day, i) => (
                  <ForecastCard
                    key={day.date.toISOString()}
                    day={day}
                    index={i + 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agricultural Advisory */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          data-ocid="weather.advisory_section"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Thermometer size={16} className="text-primary" />
                {t("weather.advisory")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {advisories.length === 0 && (
                <p
                  className="text-muted-foreground text-sm"
                  data-ocid="weather.advisory.empty_state"
                >
                  No special advisories for current conditions.
                </p>
              )}
              {advisories.map((adv, i) => {
                const style = advisoryStyles[adv.level];
                return (
                  <motion.div
                    key={adv.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    className={`flex gap-3 p-4 rounded-xl border ${style.container}`}
                    data-ocid={`weather.advisory.item.${i + 1}`}
                  >
                    {style.icon}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{adv.title}</p>
                      <p className="text-sm mt-0.5 opacity-90 leading-relaxed">
                        {adv.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Location Info Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground text-center pb-2"
          data-ocid="weather.location_info"
        >
          {geoState === "denied"
            ? '⚠ Location access denied — showing Delhi default. Click "Use My Location" to retry.'
            : `📍 ${weather.location} · ${weather.lat.toFixed(2)}°N, ${weather.lng.toFixed(2)}°E · Weather simulated from season & region`}
        </motion.p>
      </div>
    </div>
  );
}
