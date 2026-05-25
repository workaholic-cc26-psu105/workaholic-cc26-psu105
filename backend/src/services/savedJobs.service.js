const supabase = require("../config/supabase");

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

const getEducation = (text = "") => {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("s1") || lowerText.includes("bachelor")) return "S1";
  if (lowerText.includes("d3")) return "D3";
  if (lowerText.includes("sma") || lowerText.includes("smk")) return "SMA/SMK";
  if (lowerText.includes("diploma")) return "Diploma";

  return "Tidak disebutkan";
};

const mapSavedJob = (wishlist) => {
  const job = wishlist.jobs;

  return {
    id: job.id,
    judul: job.job_title,
    perusahaan: job.company_name || "Perusahaan tidak disebutkan",
    lokasi: job.locations || "Lokasi tidak disebutkan",
    kategori: job.categories_name || "Tidak disebutkan",
    tipe: formatEmployment(job.employment),
    salary: formatSalary(job.salary_min, job.salary_max),
    pendidikan: getEducation(job.full_text || job.description),
    saved_at: wishlist.created_at,
  };
};

const getSavedJobs = async (userId) => {
  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      id,
      created_at,
      jobs (
        id,
        job_title,
        company_name,
        locations,
        categories_name,
        employment,
        salary_min,
        salary_max,
        full_text,
        description
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapSavedJob);
};

const toggleSavedJob = async (userId, jobId) => {
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    throw new Error("Lowongan tidak ditemukan");
  }

  const { data: existingSavedJob, error: checkError } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (existingSavedJob) {
    const { error: deleteError } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", existingSavedJob.id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return {
      saved: false,
      message: "Lowongan dihapus dari simpanan",
    };
  }

  const { error: insertError } = await supabase.from("wishlists").insert({
    user_id: userId,
    job_id: jobId,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return {
    saved: true,
    message: "Lowongan berhasil disimpan",
  };
};

const deleteSavedJob = async (userId, jobId) => {
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Lowongan dihapus dari simpanan",
  };
};

module.exports = {
  getSavedJobs,
  toggleSavedJob,
  deleteSavedJob,
};