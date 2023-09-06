import Button from "@/components/Button/Button";
import { findById } from "@/features/Places/hooks/useFindByIdQuery";
import { putPlace } from "@/features/Places/hooks/usePutPlaceQuery";
import { Place } from "@/features/Places/place";
import { PlaceSchedule } from "@/features/PlacesSchedules/place_schedule";
import BasicLayout from "@/layouts/BasicLayout";
import MainLayout from "@/layouts/MainLayout";
import CloseIcon from "@mui/icons-material/Close";
import { FormControlLabel, IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditPlace: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [placeData, setPlaceData] = useState<Place | null>(null);
  const [schedules, setSchedules] = useState<PlaceSchedule[]>([]);

  const [showScheduleInputs, setShowScheduleInputs] = useState<boolean>(false);
  const [daysOfWeek, setDayOfWeek] = useState<any[]>([
    {
      day: "LUNES",
      checked: false,
      schedules: [],
    },
    {
      day: "MARTES",
      checked: false,
      schedules: [],
    },
    {
      day: "MIERCOLES",
      checked: false,
      schedules: [],
    },
    {
      day: "JUEVES",
      checked: false,
      schedules: [],
    },
    {
      day: "VIERNES",
      checked: false,
      schedules: [],
    },
    {
      day: "SABADO",
      checked: false,
      schedules: [],
    },
    {
      day: "DOMINGO",
      checked: false,
      schedules: [],
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaceData() {
      try {
        if (typeof id === "string") {
          const place = await findById(id);
          setPlaceData(place.data);
          // Copy the schedules from place.data.schedules to daysOfWeek
          const updatedDaysOfWeek = daysOfWeek.map((day) => {
            const schedulesForDay = place.data.schedules.filter(
              (schedule: { dayOfWeek: { name: any } }) =>
                schedule.dayOfWeek.name === day.day
            );
            if (schedulesForDay.length > 0) {
              return {
                ...day,
                checked: true,
                schedules: schedulesForDay,
              };
            }
            return day;
          });

          setDayOfWeek(updatedDaysOfWeek);

          setSchedules(place.data.schedules);
        }
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    }
    fetchPlaceData();
  }, [id]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (placeData) {
        const formData = new FormData();

        const updatedSchedules: PlaceSchedule[] = [...schedules]; // Create a copy of existing schedules

        // Iterate through daysOfWeek to gather updated schedules
        daysOfWeek.forEach((day) => {
          if (day.checked) {
            day.schedules.forEach(
              (schedule: { openingHour: string; closingHour: string }) => {
                const existingScheduleIndex = updatedSchedules.findIndex(
                  (s) =>
                    s.dayOfWeek?.name === day.day &&
                    s.openingHour === schedule.openingHour &&
                    s.closingHour === schedule.closingHour
                );

                if (existingScheduleIndex === -1) {
                  // Only add the schedule if it's not already in updatedSchedules
                  updatedSchedules.push({
                    place: placeData,
                    dayOfWeek: { name: day.day },
                    openingHour: schedule.openingHour,
                    closingHour: schedule.closingHour,
                  });
                }
              }
            );
          }
        });

        formData.append('id', placeData.id as string);
        formData.append('name', placeData.name);
        formData.append('description', placeData.description);
        formData.append('note', placeData.note);
        formData.append('schedules', JSON.stringify(updatedSchedules))
        formData.append('principalCategory', JSON.stringify(placeData.principalCategory))
        formData.append('categories', JSON.stringify(placeData.categories))
        formData.append('url', placeData.url);
        formData.append('phone', placeData.phone);
        formData.append('domicile', placeData.domicile);
        formData.append('origin', placeData.origin);
        formData.append('location', JSON.stringify(placeData.location));
        formData.append('photos', JSON.stringify(placeData.photos));

        const response = await putPlace(formData);
        console.log("Changes saved:", response);
      } else {
        console.error("No place data to update.");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
    // router.push(`/places`);
  };

  const handleOpeningHourChange = (
    newOpeningHour: string,
    dayIndex: number,
    scheduleIndex: string | number
  ) => {
    const updatedDaysOfWeek = [...daysOfWeek];
    updatedDaysOfWeek[dayIndex].schedules[scheduleIndex].openingHour =
      newOpeningHour;
    setDayOfWeek(updatedDaysOfWeek);
  };

  const handleClosingHourChange = (
    newClosingHour: string,
    dayIndex: number,
    scheduleIndex: string | number
  ) => {
    const updatedDaysOfWeek = [...daysOfWeek];
    updatedDaysOfWeek[dayIndex].schedules[scheduleIndex].closingHour =
      newClosingHour;
    setDayOfWeek(updatedDaysOfWeek);
  };

  const removeSchedule = (dayIndex: number, openingHour: string) => {
    const updatedSchedules = [...schedules];
    const day = daysOfWeek[dayIndex];

    const daySchedules = updatedSchedules.filter(
      (schedule) =>
        schedule.dayOfWeek?.name === day.day &&
        schedule.openingHour === openingHour
    );

    daySchedules.forEach((scheduleToRemove) => {
      const index = updatedSchedules.findIndex(
        (schedule) =>
          schedule.dayOfWeek?.name === scheduleToRemove.dayOfWeek?.name &&
          schedule.openingHour === scheduleToRemove.openingHour &&
          schedule.closingHour === scheduleToRemove.closingHour
      );

      if (index !== -1) {
        updatedSchedules.splice(index, 1);
      }
    });

    setSchedules(updatedSchedules);

    const updatedDaysOfWeek = [...daysOfWeek];
    updatedDaysOfWeek[dayIndex].schedules = day.schedules.filter(
      (schedule: any) => schedule.openingHour !== openingHour
    );
    setDayOfWeek(updatedDaysOfWeek);
  };

  const addNewSchedule = (dayIndex: number) => {
    const updatedDaysOfWeek = [...daysOfWeek];
    updatedDaysOfWeek[dayIndex].schedules.push({
      openingHour: "",
      closingHour: "",
    });
    setDayOfWeek(updatedDaysOfWeek);
  };

  return (
    <div>
      <MainLayout>
        <BasicLayout title="Editar">
          <form onSubmit={handleSaveChanges}>
            {daysOfWeek.map((currentDay, index) => (
              <div key={currentDay.day} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ flex: 1 }}>{currentDay.day}</span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentDay.checked}
                        onChange={() => {
                          const updatedDaysOfWeek = [...daysOfWeek];
                          updatedDaysOfWeek[index].checked =
                            !updatedDaysOfWeek[index].checked;
                          setDayOfWeek(updatedDaysOfWeek);
                          setShowScheduleInputs(!showScheduleInputs);
                        }}
                      />
                    }
                    label={currentDay.checked ? "Abierto" : "Cerrado"}
                  />
                </div>
                {currentDay.checked && (
                  <div style={{ marginLeft: "40px" }}>
                    {currentDay.schedules.map(
                      (
                        schedule: {
                          openingHour:
                          | string
                          | number
                          | readonly string[]
                          | undefined;
                          closingHour:
                          | string
                          | number
                          | readonly string[]
                          | undefined;
                        },
                        scheduleIndex: number
                      ) => (
                        <div key={scheduleIndex}>
                          <div
                            style={{
                              marginBottom: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <input
                              type="time"
                              value={schedule.openingHour}
                              onChange={(e) =>
                                handleOpeningHourChange(
                                  e.target.value,
                                  index,
                                  scheduleIndex
                                )
                              }
                            />

                            <input
                              type="time"
                              value={schedule.closingHour}
                              onChange={(e) =>
                                handleClosingHourChange(
                                  e.target.value,
                                  index,
                                  scheduleIndex
                                )
                              }
                            />
                            <IconButton
                              onClick={() =>
                                removeSchedule(index, schedule.openingHour as string)
                              }
                              aria-label="Remove schedule"
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                        </div>
                      )
                    )}
                    <Button
                      onClick={() => addNewSchedule(index)}
                      color="primary"
                      variant="text"
                    >
                      Agregar horario
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button type="submit">Guardar cambios</Button>
          </form>
        </BasicLayout>
      </MainLayout>
    </div>
  );
};

export default EditPlace;
