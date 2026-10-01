import { doctors } from "../data/staticData.js";

export function searchDoctors(specialty?: string, city?: string) {
  const specialtyDoctors = doctors.filter((doctor) => {
    return doctor.available && (!specialty || doctor.specialty === specialty);
  });

  if (!city) {
    return specialtyDoctors;
  }

  const cityDoctors = specialtyDoctors.filter((doctor) => {
    return doctor.city === city;
  });

  if (cityDoctors.length > 0) {
    return cityDoctors;
  }

  return specialtyDoctors;
}
