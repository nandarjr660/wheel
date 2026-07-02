const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Internal helper — not exported to prevent direct misuse
async function callAI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000); // 15s timeout

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API responded with status ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('Empty response from Gemini API');
    return reply as string;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateChallenge(
  topic: string,
  level: string,
  grade: string,
  winner: string,
  lang: string = 'id',
) {
  const promptLang = lang === 'en' ? 'English' : 'Indonesian';

  const languageGuidelines: Record<string, string> = {
    "SD": lang === 'en'
      ? "Use very simple, child-friendly, enthusiastic language. Short and easy to understand sentences."
      : "Gunakan bahasa yang sangat sederhana, ramah anak, penuh semangat dan kata-kata lucu. Kalimat pendek dan mudah dimengerti.",
    "SMP": lang === 'en'
      ? "Use slightly more formal language, still enthusiastic. Suitable for teens aged 12-15."
      : "Gunakan bahasa sedikit lebih formal dari SD, tetap semangat. Sesuai untuk remaja 12-15 tahun.",
    "SMA/SMK": lang === 'en'
      ? "Use adult, challenging language. Scientific terms related to the material are allowed."
      : "Gunakan bahasa dewasa dan menantang. Boleh pakai istilah ilmiah sesuai materi.",
    "Universitas": lang === 'en'
      ? "Use academic language. Technical and analytical terms are allowed."
      : "Gunakan bahasa akademis. Boleh istilah teknis dan analitis."
  };

  const topicGuidance = lang === 'en'
    ? `Analyze the topic "${topic}":
- Descriptive/conceptual (definitions, processes, theories) → "Explain...", "What is...?", "Why...?"
- Quantitative/numerical (math, physics) → calculation questions like "What is the result of...?", "Calculate..."
- Procedural/practical (steps, methods) → "List the steps...", "How do you...?"
- Memorization (figures, dates, terms) → memorization questions
Choose the most appropriate type, don't force it.
`
    : `Analisis topik "${topic}":
- Deskriptif/konseptual (definisi, proses, teori) → "Jelaskan...", "Apa itu...?", "Mengapa...?"
- Kuantitatif/numerik (matematika, fisika) → soal hitungan seperti "Berapa hasil...?", "Hitunglah..."
- Prosedural/praktik (langkah, cara) → "Sebutkan langkah...", "Bagaimana cara...?"
- Hafalan (tokoh, tanggal, istilah) → pertanyaan hafalan
Pilih yang paling cocok, jangan dipaksakan.
`;

  const gradeGuidance = (() => {
    if (level === "SD") {
      const g = parseInt(grade);
      if (g <= 2) return lang === 'en'
        ? "Grade 1-2 students: very simple words (just learning to read), concrete and visual questions. Max 8 words per sentence. Example: '3 + 4 = ?' or 'What color is the leaf?'."
        : "Siswa kelas 1-2 SD: gunakan kata sangat sederhana (membaca baru lancar), soal konkret dan visual. Kalimat maks 8 kata. Contoh: '3 + 4 = ?' atau 'Apa warna daun?'.";
      if (g <= 4) return lang === 'en'
        ? "Grade 3-4 students: simple sentences, some abstraction allowed. Max 12 words per sentence."
        : "Siswa kelas 3-4 SD: kalimat sederhana, boleh sedikit abstraksi. Kalimat maks 12 kata.";
      return lang === 'en'
        ? "Grade 5-6 students: slightly challenging, max 15 words per sentence. Introduce simple terms."
        : "Siswa kelas 5-6 SD: boleh sedikit menantang, kalimat maks 15 kata. Mulai kenalkan istilah sederhana.";
    }
    if (level === "SMP") return lang === 'en'
      ? `Middle school grade ${grade}: semi-formal language, light analytical questions. Max 20 words per sentence.`
      : `Siswa SMP kelas ${grade}: bahasa semi-formal, soal analitis ringan. Kalimat maks 20 kata.`;
    if (level === "SMA/SMK") return lang === 'en'
      ? `High school grade ${grade}: adult language, scientific terms allowed. Can include reasoning questions.`
      : `Siswa SMA/SMK kelas ${grade}: bahasa dewasa, istilah ilmiah diperbolehkan. Bisa soal penalaran.`;
    if (level === "Universitas") return lang === 'en'
      ? `University semester ${grade}: academic, analytical, technical language.`
      : `Mahasiswa semester ${grade}: bahasa akademis, analitis, teknis.`;
    return "";
  })();

  const prompt = lang === 'en'
    ? `You are a creative and adaptive teaching assistant.

Task: Generate 1 question for student "${winner}".
Topic: "${topic}"
Level: ${level} (${grade})
Output language: ${promptLang}

${topicGuidance}

GRADE LEVEL: ${gradeGuidance}
LANGUAGE STYLE: ${languageGuidelines[level] || "Adapt to the level."}

Requirements:
- Max 25 words
- Include the answer
- Output MUST be valid JSON only, no other text:
{"question": "question text", "answer": "answer text"}`
    : `Anda asisten guru kreatif dan adaptif.

Tugas: Buat 1 pertanyaan untuk siswa "${winner}".
Topik: "${topic}"
Jenjang: ${level} (${grade})
Bahasa output: ${promptLang}

${topicGuidance}

TINGKAT KELAS: ${gradeGuidance}
GAYA BAHASA: ${languageGuidelines[level] || "Sesuaikan dengan jenjang."}

Ketentuan:
- Maks 25 kata
- Sertakan jawaban
- Output HARUS JSON valid saja, tanpa teks lain:
{"question": "teks pertanyaan", "answer": "teks jawaban"}`;

  const reply = await callAI(prompt);
  const json = reply.match(/\{.*\}/s);
  const result = json ? JSON.parse(json[0]) : {};
  if (!result.question || !result.answer) throw new Error(lang === 'en' ? "Invalid response from AI" : "Response tidak valid dari AI");
  return { question: result.question, answer: result.answer };
}
