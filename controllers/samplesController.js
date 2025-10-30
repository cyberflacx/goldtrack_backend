const Sample = require("../models/sampleModel");

exports.getSamples = async (req, res) => {
  try {
    const samples = await Sample.getAll();
    res.json(samples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSampleById = async (req, res) => {
  try {
    const sample = await Sample.getById(req.params.id);
    if (!sample) return res.status(404).json({ message: "Not found" });
    res.json(sample);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSample = async (req, res) => {
  try {
    const { sample_name, mine_name, purity, date_collected } = req.body;
    const newSample = await Sample.create(sample_name, mine_name, purity, date_collected);
    res.status(201).json(newSample);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSample = async (req, res) => {
  try {
    const { sample_name, mine_name, purity, date_collected } = req.body;
    const updated = await Sample.update(req.params.id, sample_name, mine_name, purity, date_collected);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSample = async (req, res) => {
  try {
    await Sample.delete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
