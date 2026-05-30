const supabase = require("../config/supabase");
const aiService = require("./ai.service");

const USE_AI_MOCK = process.env.USE_AI_MOCK === "true";

const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
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
    "Cybersecurity Analyst": [
      "Linux",
      "Network Security",
      "Cybersecurity",
      "Risk Analysis",
    ],
    "Mobile Developer": ["Flutter", "Dart", "Firebase", "Mobile UI"],
  };

  return skillMap[role] || skillMap["Frontend Developer"];
};

const getRecommendedJobsFromDatabase = async (role) => {
  const keywordMap = {
    "Backend Developer": "backend",
    "Frontend Developer": "frontend",
    "Data Analyst": "data",
    "Data Scientist": "data",
    "Cybersecurity Analyst": "security",
    "Mobile Developer": "mobile",
    "Software Engineer": "software",
    "Web Developer": "web",
  };

  const keyword = keywordMap[role] || "developer";

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, job_title, company_name, locations, employment, salary_min, salary_max"
    )
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
    tipe: formatEmployment(job.employment),
    gaji: formatSalary(job.salary_min, job.salary_max),
  }));
};

const findMatchingJob = async (recommendation) => {
  const jobTitle = recommendation.jobTitle || "";
  const companyName = recommendation.companyName || "";
  const locations = recommendation.locations || "";

  let query = supabase
    .from("jobs")
    .select(
      "id, job_title, company_name, locations, employment, salary_min, salary_max"
    )
    .limit(1);

  if (jobTitle) {
    query = query.ilike("job_title", `%${jobTitle}%`);
  }

  if (companyName) {
    query = query.ilike("company_name", `%${companyName}%`);
  }

  if (locations) {
    query = query.ilike("locations", `%${locations}%`);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
};

const mapAiRecommendationToFrontend = async (recommendation) => {
  const matchedJob = await findMatchingJob(recommendation);

  return {
    id: matchedJob?.id || null,
    judul:
      matchedJob?.job_title ||
      recommendation.jobTitle ||
      "Lowongan tidak disebutkan",
    perusahaan:
      matchedJob?.company_name ||
      recommendation.companyName ||
      "Perusahaan tidak disebutkan",
    lokasi:
      matchedJob?.locations ||
      recommendation.locations ||
      "Lokasi tidak disebutkan",
    tipe: formatEmployment(matchedJob?.employment || recommendation.employment),
    gaji:
      recommendation.salary_range ||
      formatSalary(matchedJob?.salary_min, matchedJob?.salary_max),
  };
};

const createMockAnalysis = async (file) => {
  const role = detectMockRole(file.originalname);
  const skills = getMockSkills(role);
  const rekomendasi = await getRecommendedJobsFromDatabase(role);

  return {
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
      "Gunakan format CV yang rapi dan mudah dibaca sistem ATS",
    ],
    rekomendasi,
  };
};

const createAnalysisFromAi = async (file, aiResult) => {
  if (aiResult.status !== "success") {
    throw new Error(aiResult.message || "AI gagal menganalisis CV");
  }

  const mappedRecommendations = await Promise.all(
    (aiResult.rekomendasi || []).map(mapAiRecommendationToFrontend)
  );

  return {
    file_name: file.originalname,
    date: formatDate(new Date()),
    ats_score: Math.round(aiResult.ats_score || aiResult.confidence_pct || 0),
    kecocokan_utama:
      aiResult.kecocokan_utama ||
      aiResult.predicted_category ||
      aiResult.kategori ||
      "Tidak disebutkan",
    kisaran_gaji:
      aiResult.kisaran_gaji ||
      aiResult.salary_estimate?.salary_range ||
      "Gaji tidak dicantumkan",
    skills: Array.isArray(aiResult.skills) ? aiResult.skills : [],
    kategori: Array.isArray(aiResult.kategori)
      ? aiResult.kategori
      : [aiResult.kategori || aiResult.predicted_category].filter(Boolean),
    saran: Array.isArray(aiResult.saran)
      ? aiResult.saran
      : [aiResult.saran || "Tingkatkan skill yang sesuai dengan posisi tujuan."],
    rekomendasi: mappedRecommendations,
  };
};

const saveAnalysis = async (userId, fileName, analysisResult) => {
  const { data, error } = await supabase
    .from("cv_analyses")
    .insert({
      user_id: userId,
      file_name: fileName,
      analysis_result: analysisResult,
    })
    .select("id, analysis_result")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    ...data.analysis_result,
  };
};

const analyzeCv = async (userId, file) => {
  if (!file) {
    const error = new Error("File harus berformat PDF dan maksimal 2MB");
    error.statusCode = 422;
    throw error;
  }

  let analysisResult;

  if (USE_AI_MOCK) {
    analysisResult = await createMockAnalysis(file);
  } else {
    const aiResult = await aiService.predictCvFromPdf(file);
    analysisResult = await createAnalysisFromAi(file, aiResult);
  }

  return saveAnalysis(userId, file.originalname, analysisResult);
};

const getCvHistory = async (userId) => {
  const { data, error } = await supabase
    .from("cv_analyses")
    .select("id, analysis_result, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => ({
    id: item.id,
    ...item.analysis_result,
  }));
};

const deleteCvHistory = async (userId, id) => {
  const { error } = await supabase
    .from("cv_analyses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Riwayat analisis berhasil dihapus",
  };
};

module.exports = {
  analyzeCv,
  getCvHistory,
  deleteCvHistory,
};