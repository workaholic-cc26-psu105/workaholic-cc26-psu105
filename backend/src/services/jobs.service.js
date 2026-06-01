const supabase = require("../config/supabase");

const getAllJobs = async (filters = {}) => {
  const { keyword, category, location } = filters;

  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (keyword) {
    query = query.or(
      `title.ilike.%${keyword}%,company.ilike.%${keyword}%,description.ilike.%${keyword}%`
    );
  }

  if (category) {
    query = query.ilike("category", `%${category}%`);
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
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

  return data;
};

module.exports = {
  getAllJobs,
  getJobById
};