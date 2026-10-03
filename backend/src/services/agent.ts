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
      lastMessage?.content.includes("my chest") ||
      lastMessage?.content.includes("chest") ||
      lastMessage?.content.includes("ألم شديد في الصدر") ||
      lastMessage?.content.includes("الم شديد في الصدر") ||
      lastMessage?.content.includes("ألم في الصدر") ||
      lastMessage?.content.includes("الم في الصدر") ||
      lastMessage?.content.includes("الم في صدري") ||
      lastMessage?.content.includes("ألم الصدر") ||
      lastMessage?.content.includes("الم الصدر") ||
      lastMessage?.content.includes("صدر") ||
      lastMessage?.content.includes("صدري") ||
      lastMessage?.content.includes("الم صدر")) &&
    (text.includes("yes") ||
      text.includes("yah") ||
      text.includes("severe") ||
      text.includes("نعم") ||
      text.includes("نعم") ||
      text.includes("ايوا") ||
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
          ? "هذه الحالة تحتاج إلى عناية عاجلة، ولكن لا يوجد مستشفى طوارئ متاح حاليا"
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
    text.includes("my chest") ||
    text.includes("ألم في الصدر") ||
    text.includes("ألم بالصدر") ||
    text.includes("الم بالصدر") ||
    text.includes("الم في الصدر") ||
    text.includes("الم في صدري") ||
    text.includes("صدر") ||
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
    text.includes("heart") ||
    text.includes("قلب") ||
    text.includes("القلب") ||
    text.includes("قلبي")
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
        ? `${isArabic ? 'وجدت ' : 'I founde '} ${doctors.length} ${isArabic ? 'أطباء قلب : ' : 'cardiologist : '} ${doctors
            .map((doctor) => `${doctor.name} - ${doctor.city}`)
            .join(", ")}`
        :isArabic ? 'لم أتمكن من العثور على طبيب قلب متاح' : "I could not find an available cardiologist";
    return {
      type: "tool_result",
      tool: "searchDoctors",
      message,
      results: doctors,
    };
  }

  if (
    text.includes("second opinion") ||
    text.includes("other opinion") ||
    text.includes("other") ||
    text.includes("opinion") ||
    text.includes("choise") ||
    text.includes("رأي ثان") ||
    text.includes("رأي ثاني") ||
    text.includes("راي ثاني") ||
    text.includes("رأي آخر") ||
    text.includes("راي اخر") ||
    text.includes("حل اخر") ||
    text.includes("سؤال اخر") ||
    text.includes("سؤال") ||
    text.includes("استفسار") ||
    text.includes("اخر") ||
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
    message: isArabic
      ? "هل يمكنك تقديم المزيد من التفاصيل حول الأعراض وموقعك ؟"
      : "Could you provide more details about your symptoms and location?",
  };
}
