import { PlaceSchedule } from "@/features/PlacesSchedules/place_schedule";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React from "react";
import Tag from "../Tag/Tag";
import Label from "../Label/Label";

type ScheduleAccordionProps = {
  schedules: PlaceSchedule[];
};

const ScheduleAccordion: React.FC<ScheduleAccordionProps> = ({ schedules }) => {
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const todayIndex = new Date().getDay();
  const reorderedDays = [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)];

  const normalizeString = (str: string) =>
    str
      .toLocaleLowerCase("es")
      .replace(/[áéíóú]/g, match => "aeiou"["áéíóú".indexOf(match)]);

  // Ordena los horarios por hora de apertura ascendente
  const sortedSchedules = [...schedules].sort((a, b) => a.openingHour.localeCompare(b.openingHour));

  return (
    <Accordion style={{ backgroundColor: "transparent", boxShadow: "none" }} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{
        padding: 0,
      }}>
        <Tag text="Horarios" />
      </AccordionSummary>
      <AccordionDetails style={{
        padding: 0,
        paddingBottom: 5
      }}>
        {reorderedDays.map((day, index) => {
          const normalizedDay = normalizeString(day);
          const schedulesForDay = sortedSchedules.filter(schedule => normalizeString(schedule.dayOfWeek!.name) === normalizedDay);

          const schedulesText = schedulesForDay.length > 0
            ? schedulesForDay
              .map((schedule) => (
                schedule.openingHour !== "" && schedule.closingHour !== ""
                  ? `${schedule.openingHour.slice(0, 5)}-${schedule.closingHour.slice(0, 5)}`
                  : ""
              ))
              .filter(Boolean) // Filtramos los valores vacíos
              .join(" y ") // Unimos los horarios con " y "
            : "Cerrado";

          const labelText = `${day}: ${schedulesText}`;

          return (
            <Label
              id={"card_description"}
              text={labelText}
              key={index}
            />
          );
        })}
      </AccordionDetails>
    </Accordion >
  );
};

export default ScheduleAccordion;
