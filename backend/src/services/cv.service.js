const supabase = require("../config/supabase");

const { DEV_USER_ID } = require("../config/devUser");

const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  }).format(new Date(date));
};

const formatSalary = (min, max) => {
  if (!min && !max) return "Gaji tidak dicantumkan";

  const formatMillion = (value) => {
    if (!value) return null;
    const million = Number(value) / 1000000;
    return `${million % 1 === 0 ? million : million.toFixed(1)}jt`;
  };

  if (min && max) return `Rp ${formatMillion(min)} - ${formatMillion(max)}`;
  if (min) return `Mulai Rp ${formatMillion(min)}`;
  if (max) return `Hingga Rp ${formatMillion(max)}`;

  return "Gaji tidak dicantumkan";
};

const formatEmployment = (employment) => {
  if (!employment || employment.toLowerCase() === "unknown") {
    return "Tidak disebutkan";
  }

  return employment;
};

const detectMockRole = (fileName = "") => {
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.includes("backend")) return "Backend Developer";
  if (lowerFileName.includes("frontend")) return "Frontend Developer";
  if (lowerFileName.includes("data")) return "Data Analyst";
  if (lowerFileName.includes("cyber")) return "Cybersecurity Analyst";
  if (lowerFileName.includes("mobile")) return "Mobile Developer";

  return "Frontend Developer";
};

const getMockSkills = (role) => {
  const skillMap = {
    "Backend Developer": ["Node.js", "Express", "PostgreSQL", "REST API"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React"],
    "Data Analyst": ["Python", "SQL", "Excel", "Data Visualization"],
    "Cybersecurity Analyst": ["Linux", "Network Security", "Cybersecurity", "Risk Analysis"],
    "Mobile Developer": ["Flutter", "Dart", "Firebase", "Mobile UI"]
  };

  return skillMap[role] || skillMap["Frontend Developer"];
};

const getRecommendedJobs = async (role) => {
  const keywordMap = {
    "Backend Developer": "backend",
    "Frontend Developer": "frontend",
    "Data Analyst": "data",
    "Cybersecurity Analyst": "security",
    "Mobile Developer": "mobile"
  };

  const keyword = keywordMap[role] || "developer";

  const { data, error } = await supabase
    .from("jobs")
    .select("id, job_title, company_name, locations, employment, salary_min, salary_max")
    .or(`job_title.ilike.%${keyword}%,full_text.ilike.%${keyword}%`)
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((job) => ({
    id: job.id,
    judul: job.job_title,
    perusahaan: job.company_name || "Perusahaan tidak disebutkan",
    lokasi: job.locations || "Lokasi tidak disebutkan",
    tipe: job.employment || "Tidak disebutkan",
    gaji: formatSalary(job.salary_min, job.salary_max)
  }));
};

const analyzeCv = async (file) => {
  if (!file) {
    const error = new Error("File harus berformat PDF dan maksimal 2MB");
    error.statusCode = 422;
    throw error;
  }

  const role = detectMockRole(file.originalname);
  const skills = getMockSkills(role);
  const rekomendasi = await getRecommendedJobs(role);

  const analysisResult = {
    file_name: file.originalname,
    date: formatDate(new Date()),
    ats_score: 86,
    kecocokan_utama: role,
    kisaran_gaji: "Rp 4.000.000 - Rp 8.000.000 / bulan",
    skills,
    kategori: [role, "Web Developer", "Software Engineer"],
    saran: [
      "Lengkapi CV dengan pengalaman proyek yang relevan",
      "Tambahkan skill teknis yang sesuai dengan posisi tujuan",
      "Gunakan format CV yang rapi dan mudah dibaca sistem ATS"
    ],
    rekomendasi
  };

  const { data, error } = await supabase
    .from("cv_analyses")
    .insert({
      user_id: DEV_USER_ID,
      file_name: file.originalname,
      analysis_result: analysisResult
    })
    .select("id, created_at, analysis_result")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    ...data.analysis_result
  };
};

const getCvHistory = async () => {
  const { data, error } = await supabase
    .from("cv_analyses")
    .select("id, analysis_result, created_at")
    .eq("user_id", DEV_USER_ID)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => ({
    id: item.id,
    ...item.analysis_result
  }));
};

const deleteCvHistory = async (id) => {
  const { error } = await supabase
    .from("cv_analyses")
    .delete()
    .eq("id", id)
    .eq("user_id", DEV_USER_ID);

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Riwayat analisis berhasil dihapus"
  };
};

module.exports = {
  analyzeCv,
  getCvHistory,
  deleteCvHistory
};