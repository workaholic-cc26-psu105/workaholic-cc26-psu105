const supabaseAdmin = require("../config/supabaseAdmin");

const uploadAvatar = async (userId, file) => {
  if (!file) {
    const error = new Error("File avatar wajib diupload");
    error.statusCode = 422;
    throw error;
  }

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const avatarUrl = publicUrlData.publicUrl;

  const { error: updateError } = await supabaseAdmin
    .from("user_profiles")
    .update({
      avatar: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return {
    avatar_url: avatarUrl,
  };
};

module.exports = {
  uploadAvatar,
};