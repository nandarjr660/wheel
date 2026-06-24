const API_URL = "https://api.synoxcloud.xyz/ai-chat/claude-opus-4.6";

// Internal helper — not exported to prevent direct misuse
async function callAI(prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000); // 15s timeout

  try {
    const res = await fetch(`${API_URL}?pesan=${encodeURIComponent(prompt)}`, {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`AI API responded with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.status) throw new Error(data.message || "AI API error");
    return data.result.reply as string;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateChallenge(
  topic: string,
  level: string,
  grade: string,
  winner: string
) {
  const languageGuidelines: Record<string, string> = {
    "SD": "Gunakan bahasa yang sangat sederhana, ramah anak, penuh semangat dan kata-kata lucu. Kalimat pendek dan mudah dimengerti.",
    "SMP": "Gunakan bahasa sedikit lebih formal dari SD, tetap semangat. Sesuai untuk remaja 12-15 tahun.",
    "SMA/SMK": "Gunakan bahasa dewasa dan menantang. Boleh pakai istilah ilmiah sesuai materi.",
    "Universitas": "Gunakan bahasa akademis. Boleh istilah teknis dan analitis."
  };

  const topicGuidance = `
Analisis topik "${topic}":
- Deskriptif/konseptual (definisi, proses, teori) → "Jelaskan...", "Apa itu...?", "Mengapa...?"
- Kuantitatif/numerik (matematika, fisika) → soal hitungan seperti "Berapa hasil...?", "Hitunglah..."
- Prosedural/praktik (langkah, cara) → "Sebutkan langkah...", "Bagaimana cara...?"
- Hafalan (tokoh, tanggal, istilah) → pertanyaan hafalan
Pilih yang paling cocok, jangan dipaksakan.
`;

  const gradeGuidance = (() => {
    if (level === "SD") {
      const g = parseInt(grade);
      if (g <= 2) return "Siswa kelas 1-2 SD: gunakan kata sangat sederhana (membaca baru lancar), soal konkret dan visual. Kalimat maks 8 kata. Contoh: '3 + 4 = ?' atau 'Apa warna daun?'.";
      if (g <= 4) return "Siswa kelas 3-4 SD: kalimat sederhana, boleh sedikit abstraksi. Kalimat maks 12 kata.";
      return "Siswa kelas 5-6 SD: boleh sedikit menantang, kalimat maks 15 kata. Mulai kenalkan istilah sederhana.";
    }
    if (level === "SMP") return `Siswa SMP kelas ${grade}: bahasa semi-formal, soal analitis ringan. Kalimat maks 20 kata.`;
    if (level === "SMA/SMK") return `Siswa SMA/SMK kelas ${grade}: bahasa dewasa, istilah ilmiah diperbolehkan. Bisa soal penalaran.`;
    if (level === "Universitas") return `Mahasiswa semester ${grade}: bahasa akademis, analitis, teknis.`;
    return "";
  })();

  const prompt = `Anda asisten guru kreatif dan adaptif.

Tugas: 1 pertanyaan untuk siswa "${winner}".
Topik: "${topic}"
Jenjang: ${level} (${grade})

${topicGuidance}

TINGKAT KELAS: ${gradeGuidance}
GAYA BAHASA: ${languageGuidelines[level] || "Sesuaikan dengan jenjang."}

Ketentuan:
- Maks 25 kata
- Sertakan jawaban

Output HARUS JSON:
{"question": "pertanyaan", "answer": "jawaban"}`;

  const reply = await callAI(prompt);
  const json = reply.match(/\{.*\}/s);
  const result = json ? JSON.parse(json[0]) : {};
  if (!result.question || !result.answer) throw new Error("Response tidak valid dari AI");
  return { question: result.question, answer: result.answer };
}


