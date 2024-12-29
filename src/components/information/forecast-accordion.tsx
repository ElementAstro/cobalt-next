import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Thermometer, Droplet } from "lucide-react";
import { Span } from "@/components/custom/span";

interface ForecastData {
  date: string;
  temperature: number;
  description: string;
}

interface ForecastAccordionProps {
  forecast: ForecastData[];
  units: "metric" | "imperial";
}

const ForecastAccordion: React.FC<ForecastAccordionProps> = ({
  forecast,
  units,
}) => {
  return (
    <Accordion type="single" collapsible className="mt-4">
      {forecast.map((f, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger>{f.date}</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Span icon={Thermometer} variant="info">
                {f.temperature.toFixed(1)}°{units === "metric" ? "C" : "F"}
              </Span>
              <Span icon={Droplet} variant="info">
                {f.description}
              </Span>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ForecastAccordion;
