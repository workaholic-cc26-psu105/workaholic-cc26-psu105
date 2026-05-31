const supabase = require("../config/supabase");

const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || "http://localhost:5173";
};

const register = async (payload) => {
  const nama = payload.nama || payload.name || payload.full_name;
  const email = payload.email;
  const password = payload.password;

  if (!nama || !email || !password) {
    const error = new Error("Nama, email, dan password wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nama,
        role: "Fresh Graduate",
      },
    },
  });

  if (signUpError) {
    const error = new Error(signUpError.message);
    error.statusCode = 400;
    throw error;
  }

  const user = data.user;

  if (user) {
    await supabase.from("users").upsert({
      id: user.id,
      nama,
      email,
      role: "Fresh Graduate",
      updated_at: new Date().toISOString(),
    });
  }

  return {
    token: data.session?.access_token || null,
    user: {
      id: user?.id,
      nama,
      email,
      role: "Fresh Graduate",
    },
  };
};

const login = async (payload) => {
  const email = payload.email;
  const password = payload.password;

  if (!email || !password) {
    const error = new Error("Email dan password wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    const error = new Error("Email atau password salah");
    error.statusCode = 401;
    throw error;
  }

  const user = data.user;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    token: data.session.access_token,
    user: {
      id: user.id,
      email: user.email,
      nama:
        profile?.nama ||
        user.user_metadata?.nama ||
        user.user_metadata?.name ||
        "User",
      role: profile?.role || user.user_metadata?.role || "Fresh Graduate",
      avatar: profile?.avatar || null,
    },
  };
};

const forgotPassword = async (payload) => {
  const email =
    typeof payload === "string"
      ? payload
      : payload?.email;

  if (!email) {
    const error = new Error("Email wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${frontendUrl}/reset-password`,
    }
  );

  if (resetError) {
    const error = new Error(resetError.message);
    error.statusCode = 400;
    throw error;
  }

  return {
    message: "Link reset password berhasil dikirim ke email.",
  };
};

const resetPassword = async (payload) => {
  const accessToken = payload.accessToken || payload.access_token;
  const refreshToken = payload.refreshToken || payload.refresh_token;
  const password = payload.password || payload.newPassword || payload.new_password;

  if (!password) {
    const error = new Error("Password baru wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  if (accessToken && refreshToken) {
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      const error = new Error(sessionError.message);
      error.statusCode = 400;
      throw error;
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) {
    const error = new Error(updateError.message);
    error.statusCode = 400;
    throw error;
  }

  return {
    message: "Password berhasil diperbarui.",
  };
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};