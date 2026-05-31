const pdfParse = require("pdf-parse");

const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

const hasAnyKeyword = (text, keywords) => {
  return keywords.some((keyword) => text.includes(keyword));
};

const validateCvPdfContent = async (file) => {
  if (!file) {
    throw new Error("File CV tidak ditemukan.");
  }

  const isPdfMime = file.mimetype === "application/pdf";
  const isPdfExt = file.originalname.toLowerCase().endsWith(".pdf");

  if (!isPdfMime || !isPdfExt) {
    throw new Error("CV wajib menggunakan format PDF.");
  }

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error("File PDF kosong atau tidak dapat diproses.");
  }

  const pdfHeader = file.buffer.subarray(0, 4).toString();

  if (pdfHeader !== "%PDF") {
    throw new Error("File tidak terdeteksi sebagai PDF yang valid.");
  }

  let parsed;

  try {
    parsed = await pdfParse(file.buffer);
  } catch (error) {
    console.log("PDF parse error:", error.message);

    throw new Error(
      "PDF tidak dapat dibaca sebagai CV ATS. Pastikan file PDF berbasis teks, bukan hasil scan/gambar, dan tidak diproteksi."
    );
  }

  const rawText = parsed.text || "";
  const text = normalizeText(rawText);

  console.log("CV validation info:", {
    fileName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    textLength: text.length,
  });

  if (text.length < 250) {
    throw new Error(
      "PDF tidak terdeteksi sebagai CV ATS. Pastikan CV berbasis teks, bukan hasil scan/gambar."
    );
  }

  const hasContact =
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(rawText) ||
    /(\+62|62|0)8[0-9]{8,13}/.test(text) ||
    text.includes("linkedin") ||
    text.includes("github") ||
    text.includes("portfolio") ||
    text.includes("portofolio");

  const hasProfile = hasAnyKeyword(text, [
    "profil",
    "profile",
    "summary",
    "objective",
    "about me",
    "tentang saya",
    "ringkasan",
    "career objective",
    "professional summary",
    "informatics student",
    "backend developer",
    "frontend developer",
    "full stack",
    "software engineer",
    "data analyst",
    "ui/ux",
  ]);

  const hasEducation = hasAnyKeyword(text, [
    "pendidikan",
    "education",
    "universitas",
    "university",
    "sekolah",
    "college",
    "bachelor",
    "sarjana",
    "diploma",
    "gpa",
    "ipk",
    "teknik informatika",
    "informatika",
    "computer science",
    "information systems",
  ]);

  const hasExperience = hasAnyKeyword(text, [
    "pengalaman",
    "experience",
    "work experience",
    "project",
    "projects",
    "proyek",
    "magang",
    "internship",
    "freelance",
    "organization",
    "organisasi",
    "volunteer",
    "achievement",
    "achievements",
    "activities",
    "kegiatan",
    "capstone",
    "developed",
    "built",
    "designed",
    "created",
    "led",
    "collaborated",
  ]);

  const hasSkills = hasAnyKeyword(text, [
    "skill",
    "skills",
    "keahlian",
    "kemampuan",
    "technical skills",
    "area of expertise",
    "tools",
    "workflow",
    "programming",
    "bahasa pemrograman",
    "framework",
    "database",
    "node.js",
    "express",
    "react",
    "javascript",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "laravel",
    "php",
    "python",
    "java",
    "sql",
    "mysql",
    "postgresql",
    "supabase",
    "figma",
    "git",
    "github",
    "postman",
    "docker",
  ]);

  const hasCvCommonWords = hasAnyKeyword(text, [
    "curriculum vitae",
    "resume",
    "cv",
    "contact",
    "kontak",
    "email",
    "phone",
    "telepon",
    "alamat",
    "languages",
    "bahasa",
    "certification",
    "certifications",
    "sertifikat",
    "penghargaan",
    "references",
    "referensi",
  ]);

  const cvScore = [
    hasContact,
    hasProfile,
    hasEducation,
    hasExperience,
    hasSkills,
    hasCvCommonWords,
  ].filter(Boolean).length;

  if (cvScore < 3) {
    throw new Error(
      "File PDF tidak terdeteksi sebagai CV. Upload CV ATS yang berisi informasi kontak, profil, pendidikan, pengalaman/proyek, dan skill."
    );
  }

  if (!hasContact) {
    throw new Error(
      "File PDF belum memenuhi format CV ATS karena tidak ditemukan informasi kontak seperti email, nomor telepon, LinkedIn, GitHub, atau portfolio."
    );
  }

  if (!hasSkills) {
    throw new Error(
      "File PDF belum memenuhi format CV ATS karena tidak ditemukan bagian skill atau keahlian."
    );
  }

  return {
    isValid: true,
    textLength: text.length,
    cvScore,
  };
};

module.exports = {
  validateCvPdfContent,
};