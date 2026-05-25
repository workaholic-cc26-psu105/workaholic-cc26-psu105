const supabase = require("../config/supabase");

const { DEV_USER_ID } = require("../config/devUser");

const getKeywordFromRole = (role = "") => {
  const lowerRole = role.toLowerCase();

  if (lowerRole.includes("backend")) return "backend";
  if (lowerRole.includes("frontend")) return "frontend";
  if (lowerRole.includes("data analyst")) return "data";
  if (lowerRole.includes("data scientist")) return "data";
  if (lowerRole.includes("cyber")) return "security";
  if (lowerRole.includes("mobile")) return "mobile";
  if (lowerRole.includes("web")) return "web";
  if (lowerRole.includes("software")) return "software";

  return "developer";
};

const getMatchingJobsCount = async (role) => {
  if (!role) return 0;

  const keyword = getKeywordFromRole(role);

  const { count, error } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .or(`job_title.ilike.%${keyword}%,full_text.ilike.%${keyword}%`);

  if (error) {
    throw new Error(error.message);
  }

  return count || 0;
};

const getHomeStats = async (userId) => {
  const { data: latestAnalysis, error } = await supabase
    .from("cv_analyses")
    .select("id, file_name, analysis_result, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!latestAnalysis) {
    return {
      has_analysis: false,
      lowongan_cocok: 0,
      ats_score: 0,
      status_profile: "Active",
      latest_cv_analysis: null
    };
  }

  const analysis = latestAnalysis.analysis_result;
  const lowonganCocok = await getMatchingJobsCount(analysis.kecocokan_utama);

  return {
    has_analysis: true,
    lowongan_cocok: lowonganCocok,
    ats_score: analysis.ats_score || 0,
    status_profile: "Active",
    latest_cv_analysis: {
      id: latestAnalysis.id,
      file_name: analysis.file_name || latestAnalysis.file_name,
      ats_score: analysis.ats_score || 0,
      kecocokan_utama: analysis.kecocokan_utama || "Tidak disebutkan",
      date: analysis.date
    }
  };
};

module.exports = {
  getHomeStats
};