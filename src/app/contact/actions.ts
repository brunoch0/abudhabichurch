"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitInquiry(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // honeypot — bots fill hidden fields
  const website = String(formData.get("website") ?? "");

  if (website) {
    return { status: "success", message: "문의가 접수되었습니다." };
  }

  if (!name || !contact || !message) {
    return { status: "error", message: "이름, 연락처, 문의 내용을 모두 입력해주세요." };
  }
  if (message.length > 2000) {
    return { status: "error", message: "문의 내용은 2000자 이내로 입력해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name: name.slice(0, 100),
    contact: contact.slice(0, 100),
    email: email ? email.slice(0, 200) : null,
    message,
  });

  if (error) {
    return { status: "error", message: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  return {
    status: "success",
    message: "문의가 접수되었습니다. 확인 후 남겨주신 연락처로 답변드리겠습니다.",
  };
}
