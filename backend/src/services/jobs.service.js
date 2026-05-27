const supabase = require("../config/supabase");

const sanitizeSearchText = (text) => {
  return String(text || "")
    .trim()
    .replace(/,/g, " ");
};

const formatSalary = (min, max, currency = "IDR") => {
  if (!min && !max) return "Gaji tidak dicantumkan";

  const formatMillion = (value) => {
    if (!value) return null;
    const million = Number(value) / 1000000;
    return `${million % 1 === 0 ? million : million.toFixed(1)}jt`;
  };

  if (min && max) {
    return `Rp ${formatMillion(min)} - ${formatMillion(max)}`;
  }

  if (min) {
    return `Mulai Rp ${formatMillion(min)}`;
  }

  if (max) {
    return `Hingga Rp ${formatMillion(max)}`;
  }

  return currency || "IDR";
};

const getEducation = (text = "") => {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("s1") || lowerText.includes("bachelor")) return "S1";
  if (lowerText.includes("d3")) return "D3";
  if (lowerText.includes("sma") || lowerText.includes("smk")) return "SMA/SMK";
  if (lowerText.includes("diploma")) return "Diploma";

  return "Tidak disebutkan";
};

const getLevel = (jobTitle = "", text = "") => {
  const combinedText = `${jobTitle} ${text}`.toLowerCase();

  if (combinedText.includes("intern") || combinedText.includes("magang")) {
    return "Internship";
  }

  if (combinedText.includes("junior") || combinedText.includes("fresh graduate")) {
    return "Junior Level";
  }

  if (combinedText.includes("senior") || combinedText.includes("lead")) {
    return "Senior Level";
  }

  if (combinedText.includes("manager") || combinedText.includes("head")) {
    return "Managerial Level";
  }

  return "Entry Level";
};

const getExperience = (text = "") => {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("fresh graduate")) return "Fresh Graduate";
  if (lowerText.includes("1 tahun") || lowerText.includes("1 year")) return "1 Tahun";
  if (lowerText.includes("2 tahun") || lowerText.includes("2 years")) return "1 - 2 Tahun";
  if (lowerText.includes("3 tahun") || lowerText.includes("3 years")) return "3 Tahun";
  if (lowerText.includes("5 tahun") || lowerText.includes("5 years")) return "5 Tahun";

  return "Tidak disebutkan";
};

const splitTextToList = (text = "", maxItems = 5) => {
  if (!text) return ["Tidak disebutkan"];

  return text
    .split(/\.|;|\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 20)
    .slice(0, maxItems);
};

const mapJobListItem = (job) => {
  return {
    id: job.id,
    judul: job.job_title,
    perusahaan: job.company_name || "Perusahaan tidak disebutkan",
    lokasi: job.locations || "Lokasi tidak disebutkan",
    kategori: job.categories_name || "Tidak disebutkan",
    pendidikan: getEducation(job.full_text || job.description),
    tipe: job.employment || "Tidak disebutkan",
    salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency)
  };
};

const mapJobDetailItem = (job) => {
  const text = job.full_text || job.description || "";

  return {
    id: job.id,
    judul: job.job_title,
    perusahaan: job.company_name || "Perusahaan tidak disebutkan",
    lokasi: job.locations || "Lokasi tidak disebutkan",
    salary: formatSalary(job.salary_min, job.salary_max, job.salary_currency),
    tipe: job.employment || "Tidak disebutkan",
    kategori: job.categories_name || "Tidak disebutkan",
    pendidikan: getEducation(text),
    pengalaman: getExperience(text),
    level: getLevel(job.job_title, text),
    persyaratan: splitTextToList(text, 5),
    tugas: splitTextToList(job.description || text, 5),
    perusahaan_detail: {
      tentang: job.company_name
        ? `${job.company_name} membuka lowongan untuk posisi ${job.job_title}.`
        : "Detail perusahaan belum tersedia.",
      website: null,
      industri: job.categories_name || "Tidak disebutkan",
      jumlah_karyawan: "Tidak disebutkan"
    }
  };
};

const getAllJobs = async (filters = {}) => {
  const {
    keyword,
    lokasi,
    kategori,
    tipe,
    page = 1,
    per_page = 6
  } = filters;

  const currentPage = Number(page) || 1;
  const currentPerPage = Number(per_page) || 6;
  const from = (currentPage - 1) * currentPerPage;
  const to = from + currentPerPage - 1;

  let query = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (keyword) {
    const safeKeyword = sanitizeSearchText(keyword);

    query = query.or(
      `job_title.ilike.%${safeKeyword}%,company_name.ilike.%${safeKeyword}%,description.ilike.%${safeKeyword}%,full_text.ilike.%${safeKeyword}%`
    );
  }

  if (lokasi) {
    query = query.ilike("locations", `%${lokasi}%`);
  }

  if (kategori) {
    query = query.or(
      `categories_name.ilike.%${kategori}%,job_title.ilike.%${kategori}%,full_text.ilike.%${kategori}%`
    );
  }

  if (tipe) {
    query = query.ilike("employment", `%${tipe}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    jobs: data.map(mapJobListItem),
    meta: {
      total: count,
      page: currentPage,
      per_page: currentPerPage,
      total_pages: Math.ceil(count / currentPerPage)
    }
  };
};

const getJobById = async (id) => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapJobDetailItem(data);
};

const getJobCategories = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("categories_name")
    .not("categories_name", "is", null)
    .limit(10000);

  if (error) {
    throw new Error(error.message);
  }

  return [...new Set(data.map((item) => item.categories_name).filter(Boolean))];
};

const getJobLocations = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("locations")
    .not("locations", "is", null)
    .limit(10000);

  if (error) {
    throw new Error(error.message);
  }

  return [...new Set(data.map((item) => item.locations).filter(Boolean))];
};

module.exports = {
  getAllJobs,
  getJobById,
  getJobCategories,
  getJobLocations
};