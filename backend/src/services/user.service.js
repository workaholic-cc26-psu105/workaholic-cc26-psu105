const supabase = require("../config/supabase");

const getAuthUserInfo = (authUser) => {
  if (typeof authUser === "string") {
    return {
      id: authUser,
      email: "",
      nama: "User",
      role: "Fresh Graduate",
    };
  }

  return {
    id: authUser?.id,
    email: authUser?.email || "",
    nama:
      authUser?.user_metadata?.nama ||
      authUser?.user_metadata?.name ||
      "User",
    role: authUser?.user_metadata?.role || "Fresh Graduate",
  };
};

const getProfileFromUserProfiles = async (userId) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getStats = async (userId) => {
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
    saved_jobs_count: savedJobsCount || 0,
    applied_count: 0,
    cv_analysis_count: cvAnalysisCount || 0,
    ats_score: latestAnalysis?.analysis_result?.ats_score || 0,
  };
};

const normalizeProfileResponse = async (authInfo, profile) => {
  const stats = await getStats(authInfo.id);

  return {
    id: authInfo.id,
    nama: profile?.nama || authInfo.nama || "User",
    email: profile?.email || authInfo.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    role: profile?.role || authInfo.role || "Fresh Graduate",
    education: profile?.education || "",
    bio: profile?.bio || "",
    avatar: profile?.avatar || null,
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    stats,
  };
};

const getUserProfile = async (authUser) => {
  const authInfo = getAuthUserInfo(authUser);

  if (!authInfo.id) {
    throw new Error("User tidak valid");
  }

  const profile = await getProfileFromUserProfiles(authInfo.id);

  return normalizeProfileResponse(authInfo, profile);
};

const updateUserProfile = async (authUser, payload) => {
  const authInfo = getAuthUserInfo(authUser);

  if (!authInfo.id) {
    throw new Error("User tidak valid");
  }

  const oldProfile = await getProfileFromUserProfiles(authInfo.id);

  const profileData = {
    id: authInfo.id,
    nama: payload.nama ?? oldProfile?.nama ?? authInfo.nama ?? "User",
    email: oldProfile?.email ?? authInfo.email ?? payload.email ?? "",
    phone: payload.phone ?? oldProfile?.phone ?? "",
    location: payload.location ?? oldProfile?.location ?? "",
    role: payload.role ?? oldProfile?.role ?? authInfo.role ?? "Fresh Graduate",
    education: payload.education ?? oldProfile?.education ?? "",
    bio: payload.bio ?? oldProfile?.bio ?? "",
    skills: Array.isArray(payload.skills)
      ? payload.skills
      : Array.isArray(oldProfile?.skills)
      ? oldProfile.skills
      : [],
    avatar: payload.avatar ?? oldProfile?.avatar ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedProfile, error } = await supabase
    .from("user_profiles")
    .upsert(profileData, {
      onConflict: "id",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeProfileResponse(authInfo, updatedProfile);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};