import { hospitals } from "../data/staticData.js";
export function searchHospitals(city) {
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
//# sourceMappingURL=searchHospitals.js.map