import {onCall} from "firebase-functions/v2/https";
import {GoogleGenerativeAI} from "@google/generative-ai";
import * as functions from "firebase-functions";

// 1. Mengambil kunci API dari KONFIGURASI yang sudah kita atur sebelumnya
const GEMINI_API_KEY = functions.config().gemini.key;

// 2. Ini adalah fungsi utama kita yang bisa dipanggil dari aplikasi Ionic
export const askGemini = onCall(async (request) => {
  // Validasi keamanan: pastikan kunci API ada di server
  if (!GEMINI_API_KEY) {
    throw new Error("Kunci API Gemini belum diatur di server.");
  }

  // Inisialisasi model AI Gemini
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({model: "gemini-pro"});

  // Ambil teks pertanyaan yang dikirim dari aplikasi Ionic
  const prompt = request.data.prompt || "";
  if (prompt === "") {
    return {response: "Tolong berikan pertanyaan yang jelas."};
  }

  try {
    // Kirim pertanyaan ke Gemini dan tunggu jawaban
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Kirim kembali jawaban dari Gemini ke aplikasi Ionic
    return {response: text};
  } catch (error) {
    console.error("Error dari Gemini API:", error);
    return {response: "Maaf, terjadi sedikit gangguan dengan AI saat ini."};
  }
});
