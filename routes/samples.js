const express = require("express");
const router = express.Router();
const Sample = require("../models/sampleModel");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

// ✅ GET all samples (with optional filters)
router.get("/", async (req, res) => {
  try {
    // Filters: ?mine_name=Mazowe&purity=95&date_collected=2025-10-30
    const filters = {
      mine_name: req.query.mine_name || null,
      purity: req.query.purity || null,
      date_collected: req.query.date_collected || null,
    };

    const samples = await Sample.getAll(filters);
    res.json(samples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET one sample by ID
router.get("/:id", async (req, res) => {
  try {
    const sample = await Sample.getById(req.params.id);
    if (!sample) return res.status(404).json({ message: "Sample not found" });
    res.json(sample);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST - Create new sample
router.post("/", async (req, res) => {
  try {
    const { sample_name, mine_name, purity, date_collected } = req.body;
    const newSample = await Sample.create(
      sample_name,
      mine_name,
      purity,
      date_collected
    );
    res.status(201).json(newSample);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT - Update sample
router.put("/:id", async (req, res) => {
  try {
    const { sample_name, mine_name, purity, date_collected } = req.body;
    const updated = await Sample.update(
      req.params.id,
      sample_name,
      mine_name,
      purity,
      date_collected
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE sample
router.delete("/:id", async (req, res) => {
  try {
    await Sample.delete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ EXPORT samples to CSV
router.get("/export/csv", async (req, res) => {
  try {
    const samples = await Sample.getAllDirect();
    if (!samples.length) return res.status(404).json({ message: "No data found" });

    const fields = ["id", "sample_name", "mine_name", "purity", "date_collected"];
    const parser = new Parser({ fields });
    const csv = parser.parse(samples);

    const filePath = path.join(__dirname, "../exports");
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);

    const fullFile = path.join(filePath, "samples.csv");
    fs.writeFileSync(fullFile, csv);

    res.download(fullFile, "samples.csv");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
