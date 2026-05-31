const supabase = require("../config/supabase");
const aiService = require("./ai.service");
const { validateCvPdfContent } = require("./cvValidation.service");

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

  if (min && max) return `Rp ${formatMillion(min)} - Rp ${formatMillion(max)}`;
  if (min) return `Mulai Rp ${formatMillion(min)}`;
  if (max) return `Hingga Rp ${formatMillion(max)}`;

  return "Gaji tidak dicantumkan";
};

const formatEmployment = (employment) => {
  if (!employment || String(employment).toLowerCase() === "unknown") {
    return "Tidak disebutkan";
  }

  return employment;
};

const isValidJobUuid = (id) => {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id
    )
  );
};

const normalizeSearchText = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/[^\w\s+.#/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getMainKeyword = (value = "") => {
  const text = normalizeSearchText(value);

  return text
    .split(" ")
    .filter((word) => word.length >= 3)
    .slice(0, 4)
    .join("%");
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

const mapJobToRecommendation = (job) => {
  return {
    id: job.id,
    judul: job.job_title || "Lowongan tidak disebutkan",
    perusahaan: job.company_name || "Perusahaan tidak disebutkan",
    lokasi: job.locations || "Lokasi tidak disebutkan",
    tipe: formatEmployment(job.employment),
    gaji: formatSalary(job.salary_min, job.salary_max),
  };
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
    "Network & System Administrator": "network",
    "ERP & CRM Specialist": "erp",
    "UI/UX Designer": "design",
    "Digital Marketing Specialist": "marketing",
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

  return (data || []).map(mapJobToRecommendation);
};

const getFallbackJobs = async (limit = 10) => {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, job_title, company_name, locations, employment, salary_min, salary_max"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(mapJobToRecommendation);
};

const getRecommendationFields = (recommendation = {}) => {
  return {
    id: isValidJobUuid(recommendation.id) ? recommendation.id : null,

    title:
      recommendation.jobTitle ||
      recommendation.judul ||
      recommendation.title ||
      "",

    company:
      recommendation.companyName ||
      recommendation.perusahaan ||
      recommendation.company ||
      "",

    location:
      recommendation.locations ||
      recommendation.lokasi ||
      recommendation.location ||
      "",

    employment:
      recommendation.employment ||
      recommendation.tipe ||
      recommendation.type ||
      "",

    salary:
      recommendation.salary_range ||
      recommendation.gaji ||
      recommendation.salaryRange ||
      recommendation.salary ||
      "Gaji tidak dicantumkan",
  };
};

const querySingleJob = async ({ title, company, location }) => {
  let query = supabase
    .from("jobs")
    .select(
      "id, job_title, company_name, locations, employment, salary_min, salary_max"
    )
    .limit(1);

  if (title) {
    query = query.ilike("job_title", `%${title}%`);
  }

  if (company) {
    query = query.ilike("company_name", `%${company}%`);
  }

  if (location) {
    query = query.ilike("locations", `%${location}%`);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
};

const findMatchingJob = async (recommendation) => {
  const fields = getRecommendationFields(recommendation);

  if (isValidJobUuid(fields.id)) {
    const { data } = await supabase
      .from("jobs")
      .select(
        "id, job_title, company_name, locations, employment, salary_min, salary_max"
      )
      .eq("id", fields.id)
      .maybeSingle();

    if (data) return data;
  }

  const titleKeyword = getMainKeyword(fields.title);
  const companyKeyword = getMainKeyword(fields.company);
  const locationKeyword = getMainKeyword(fields.location);

  const attempts = [
    {
      title: titleKeyword,
      company: companyKeyword,
      location: locationKeyword,
    },
    {
      title: titleKeyword,
      company: companyKeyword,
    },
    {
      title: titleKeyword,
    },
    {
      company: companyKeyword,
      location: locationKeyword,
    },
    {
      company: companyKeyword,
    },
  ];

  for (const attempt of attempts) {
    const hasFilter = attempt.title || attempt.company || attempt.location;

    if (!hasFilter) continue;

    const matchedJob = await querySingleJob(attempt);

    if (matchedJob) {
      return matchedJob;
    }
  }

  return null;
};

const mapAiRecommendationToFrontend = async (recommendation) => {
  const fields = getRecommendationFields(recommendation);
  const matchedJob = await findMatchingJob(recommendation);

  const validMatchedId = isValidJobUuid(matchedJob?.id) ? matchedJob.id : null;

  return {
    id: validMatchedId,
    judul: matchedJob?.job_title || fields.title || "Lowongan tidak disebutkan",
    perusahaan:
      matchedJob?.company_name ||
      fields.company ||
      "Perusahaan tidak disebutkan",
    lokasi:
      matchedJob?.locations || fields.location || "Lokasi tidak disebutkan",
    tipe: formatEmployment(matchedJob?.employment || fields.employment),
    gaji:
      fields.salary ||
      formatSalary(matchedJob?.salary_min, matchedJob?.salary_max),
  };
};

const fillMissingRecommendationIds = async (recommendations, mainRole) => {
  const hasInvalidId = recommendations.some((job) => !isValidJobUuid(job.id));

  if (!hasInvalidId) {
    return recommendations;
  }

  let fallbackJobs = await getRecommendedJobsFromDatabase(mainRole);

  if (!fallbackJobs || fallbackJobs.length === 0) {
    fallbackJobs = await getFallbackJobs(10);
  }

  const usedIds = new Set(
    recommendations
      .filter((job) => isValidJobUuid(job.id))
      .map((job) => job.id)
  );

  let fallbackIndex = 0;

  return recommendations.map((job) => {
    if (isValidJobUuid(job.id)) {
      return job;
    }

    while (
      fallbackIndex < fallbackJobs.length &&
      usedIds.has(fallbackJobs[fallbackIndex].id)
    ) {
      fallbackIndex += 1;
    }

    const fallbackJob = fallbackJobs[fallbackIndex];

    if (!fallbackJob || !isValidJobUuid(fallbackJob.id)) {
      return {
        ...job,
        id: null,
      };
    }

    fallbackIndex += 1;
    usedIds.add(fallbackJob.id);

    return fallbackJob;
  });
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
  if (aiResult.status && aiResult.status !== "success") {
    throw new Error(aiResult.message || "AI gagal menganalisis CV");
  }

  const mainRole =
    aiResult.kecocokan_utama ||
    aiResult.predicted_category ||
    aiResult.kategori ||
    "Developer";

  const rawRecommendations =
    aiResult.rekomendasi || aiResult.recommendations || [];

  const mappedRecommendations = await Promise.all(
    rawRecommendations.map(mapAiRecommendationToFrontend)
  );

  const finalRecommendations = await fillMissingRecommendationIds(
    mappedRecommendations,
    mainRole
  );

  const skills = aiResult.skills || aiResult.skills_detected || [];

  const kategori = Array.isArray(aiResult.kategori)
    ? aiResult.kategori
    : Array.isArray(aiResult.top3_categories)
    ? aiResult.top3_categories.map((item) => item.category).filter(Boolean)
    : [aiResult.kategori || aiResult.predicted_category].filter(Boolean);

  const saran = Array.isArray(aiResult.saran)
    ? aiResult.saran
    : [aiResult.saran || "Tingkatkan skill yang sesuai dengan posisi tujuan."];

  return {
    file_name: file.originalname,
    date: formatDate(new Date()),
    ats_score: Math.round(aiResult.ats_score || aiResult.confidence_pct || 0),
    kecocokan_utama: mainRole || "Tidak disebutkan",
    kisaran_gaji:
      aiResult.kisaran_gaji ||
      aiResult.salary_estimate?.salary_range ||
      "Gaji tidak dicantumkan",
    skills: Array.isArray(skills) ? skills : [],
    kategori,
    saran,
    rekomendasi: finalRecommendations,
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

  await validateCvPdfContent(file);

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