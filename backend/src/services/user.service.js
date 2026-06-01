const supabase = require("../config/supabase");

const getUserFromUsersTable = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
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

const normalizeProfileResponse = async (userId, profile, userRow) => {
  const stats = await getStats(userId);

  return {
    id: userId,
    nama: profile?.nama || userRow?.nama || "User",
    email: profile?.email || userRow?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    role: profile?.role || userRow?.role || "Fresh Graduate",
    education: profile?.education || "",
    bio: profile?.bio || "",
    avatar: profile?.avatar || userRow?.avatar || null,
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    stats,
  };
};

const getUserProfile = async (userId) => {
  const profile = await getProfileFromUserProfiles(userId);
  const userRow = await getUserFromUsersTable(userId);

  return normalizeProfileResponse(userId, profile, userRow);
};

const updateUserProfile = async (userId, payload) => {
  const oldProfile = await getProfileFromUserProfiles(userId);
  const userRow = await getUserFromUsersTable(userId);

  const updateData = {
    id: userId,
    nama: payload.nama ?? oldProfile?.nama ?? userRow?.nama ?? "User",
    email: oldProfile?.email ?? userRow?.email ?? payload.email ?? "",
    phone: payload.phone ?? oldProfile?.phone ?? "",
    location: payload.location ?? oldProfile?.location ?? "",
    role: payload.role ?? oldProfile?.role ?? userRow?.role ?? "Fresh Graduate",
    education: payload.education ?? oldProfile?.education ?? "",
    bio: payload.bio ?? oldProfile?.bio ?? "",
    skills: Array.isArray(payload.skills)
      ? payload.skills
      : Array.isArray(oldProfile?.skills)
      ? oldProfile.skills
      : [],
    avatar: payload.avatar ?? oldProfile?.avatar ?? userRow?.avatar ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedProfile, error: profileError } = await supabase
    .from("user_profiles")
    .upsert(updateData, {
      onConflict: "id",
    })
    .select("*")
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  await supabase
    .from("users")
    .update({
      nama: updatedProfile.nama,
      role: updatedProfile.role,
      avatar: updatedProfile.avatar,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  return getUserProfile(userId);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};