const supabase = require("../config/supabase");

const getUserProfile = async (userId) => {
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { count: savedJobsCount } = await supabase
    .from("wishlists")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: cvAnalysisCount } = await supabase
    .from("cv_analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const { data: latestAnalysis } = await supabase
    .from("cv_analyses")
    .select("analysis_result")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    id: profile.id,
    nama: profile.nama,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    role: profile.role,
    education: profile.education,
    bio: profile.bio,
    avatar: profile.avatar,
    skills: profile.skills || [],
    stats: {
      saved_jobs_count: savedJobsCount || 0,
      applied_count: 0,
      cv_analysis_count: cvAnalysisCount || 0,
      ats_score: latestAnalysis?.analysis_result?.ats_score || 0,
    },
  };
};

const updateUserProfile = async (userId, payload) => {
  const allowedFields = [
    "nama",
    "phone",
    "location",
    "role",
    "education",
    "bio",
    "skills",
    "avatar",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  });

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updateData)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};