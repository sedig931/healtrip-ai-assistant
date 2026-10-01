import { searchDoctors } from "../functions/searchDoctors.js";
import { searchHospitals } from "../functions/searchHospitals.js";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function aiAgent(
  message: string,
  history: ChatMessage[] = [],
  language: "en" | "ar" = "en",
) {
  const text = message.toLowerCase();
  const isArabic = language === "ar";

  const lastMessage = history
    .filter((item) => item.role === "assistant")
    .at(-1);

  if (
    (lastMessage?.content.includes("chest pain") ||
      lastMessage?.content.includes("ألم شديد في الصدر")) &&
    (text.includes("yes") ||
      text.includes("severe") ||
      text.includes("نعم") ||
      text.includes("شديد"))
  ) {
    const hospitals = searchHospitals();

    const message =
      hospitals.length > 0
        ? isArabic
          ? `هذه الحالة تحتاج إلى عناية عاجلة. المستشفيات المتاحة للطوارئ: ${hospitals
              .map((hospital) => `${hospital.name} - ${hospital.city}`)
              .join(", ")}`
          : `This situation should be treated as urgent. Available emergency hospitals: ${hospitals
              .map((hospital) => `${hospital.name} - ${hospital.city}`)
              .join(", ")}`
        : isArabic
          ? "هذه الحالة تحتاج إلى عناية عاجلة، ولكن لا يوجد مستشفى طوارئ متاح حاليًا"
          : "This situation should be treated as urgent, but no emergency hospital is currently available";

    return {
      type: "tool_result",
      tool: "searchHospitals",
      message,
      results: hospitals,
    };
  }

  if (
    text.includes("chest pain") ||
    text.includes("chest") ||
    text.includes("ألم في الصدر") ||
    text.includes("ألم بالصدر") ||
    text.includes("الصدر")
  ) {
    return {
      type: "clarification",
      message: isArabic
        ? "هل تعاني من ألم شديد في الصدر أو ضيق في التنفس أو إغماء؟"
        : "Are you experiencing severe chest pain, shortness of breath, or fainting?",
    };
  }

  if (
    text.includes("cardiologist") ||
    text.includes("cardiology") ||
    text.includes("قلب")
  ) {
    let doctors;
    if (text.includes("dammam")) {
      doctors = searchDoctors("Cardiology", "Dammam");
    } else if (text.includes("riyadh")) {
      doctors = searchDoctors("Cardiology", "Riyadh");
    } else {
      doctors = searchDoctors("Cardiology");
    }
    const message =
      doctors.length > 0
        ? `I found ${doctors.length} cardiologists: ${doctors
            .map((doctor) => `${doctor.name} - ${doctor.city}`)
            .join(", ")}`
        : "I could not find an available cardiologist";

    return {
      type: "tool_result",
      tool: "searchDoctors",
      message,
      results: doctors,
    };
  }

  if (
    text.includes("second opinion") ||
    text.includes("رأي ثان") ||
    text.includes("رأي ثاني") ||
    text.includes("رأي آخر")  ||
    text.includes("آخر") 
  ) {
    return {
      type: "next_step",
      message: isArabic
        ? "يمكنك طلب رأي طبي ثاني من طبيب آخر في نفس التخصص للمقارنة قبل اتخاذ القرار"
        : "You can seek a second medical opinion from another doctor in the same specialty before making a decision",
    };
  }

  return {
    type: "clarification",
    message: isArabic ? "هل يمكنك تقديم المزيد من التفاصيل حول الأعراض وموقعك ؟" : "Could you provide more details about your symptoms and location?",
  };
}
