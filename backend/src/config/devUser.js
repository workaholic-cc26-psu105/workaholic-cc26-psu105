const DEV_USER_ID = process.env.DEV_USER_ID;

if (!DEV_USER_ID) {
  throw new Error("DEV_USER_ID belum diatur di file .env");
}

module.exports = {
  DEV_USER_ID
};