const supabase = require("../config/supabase");

const register = async ({ nama, email, password }) => {
  if (!nama || !email || !password) {
    const error = new Error("Nama, email, dan password wajib diisi");
    error.statusCode = 422;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Password minimal 8 karakter");
    error.statusCode = 422;
    throw error;
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nama,
      },
    },
  });

  if (authError) {
    const error = new Error(authError.message);
    error.statusCode = 400;
    throw error;
  }

  const user = authData.user;
  const session = authData.session;

  if (!user) {
    const error = new Error("Registrasi gagal");
    error.statusCode = 400;
    throw error;
  }

  const { error: profileError } = await supabase.from("user_profiles").insert({
    id: user.id,
    nama,
    email,
  });

  if (profileError) {
    const error = new Error(profileError.message);
    error.statusCode = 400;
    throw error;
  }

  return {
    id: user.id,
    nama,
    email,
    token: session?.access_token || null,
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email dan password wajib diisi");
    error.statusCode = 422;
    throw error;
  }

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !data.user || !data.session) {
    const error = new Error("Email atau password salah");
    error.statusCode = 401;
    throw error;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      nama: profile?.nama || data.user.user_metadata?.nama || "",
      email: data.user.email,
      role: profile?.role || null,
      avatar: profile?.avatar || null,
    },
  };
};

module.exports = {
  register,
  login,
};