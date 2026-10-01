import { hospitals } from "../data/staticData.js";

export function searchHospitals(city?: string) {
  if (!city) {
    return hospitals;
  }
  const cityHospitals = hospitals.filter((hospital) => {
    return hospital.city === city;
  });
  if (cityHospitals.length > 0) {
    return cityHospitals;
  }
  return hospitals;
}
