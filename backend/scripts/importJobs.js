const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config();

const supabase = require("../src/config/supabase");

const filePath = path.join(__dirname, "../../data/loker_clean.csv");

const jobs = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    if (!row.jobTitle) return;

    jobs.push({
      job_title: row.jobTitle,
      company_name: row.companyName || null,
      description: row.description || null,
      employment: row.employment || null,
      categories_name: row.categoriesName || null,
      locations: row.locations || null,
      salary_min: row.salaryMin ? Number(row.salaryMin) : null,
      salary_max: row.salaryMax ? Number(row.salaryMax) : null,
      salary_currency: row.salarycurrency || null,
      selling_points: row.sellingPoints || null,
      salary_available:
        row.salary_available === "True" || row.salary_available === "true",
      full_text: row.full_text || null,
      has_description:
        row.has_description === "True" || row.has_description === "true",
    });
  })
  .on("end", async () => {
    console.log(`Total data terbaca: ${jobs.length}`);

    const filteredJobs = jobs
      .filter((job) => job.has_description === true)
      .slice(0, 5000);

    console.log(`Total data yang akan diimport: ${filteredJobs.length}`);

    const batchSize = 500;

    for (let i = 0; i < filteredJobs.length; i += batchSize) {
      const batch = filteredJobs.slice(i, i + batchSize);

      const { error } = await supabase.from("jobs").insert(batch);

      if (error) {
        console.error("Import gagal:", error.message);
        return;
      }

      console.log(`Imported ${i + batch.length}/${filteredJobs.length}`);
    }

    console.log("Import jobs selesai.");
  })
  .on("error", (error) => {
    console.error("Gagal membaca file CSV:", error.message);
  });