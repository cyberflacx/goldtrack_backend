const db = require("../database/db");

const Sample = {
  // 🟢 Fetch all samples (with optional filters)
  getAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM samples WHERE 1=1";
      const params = [];

      if (filters.mine_name) {
        sql += " AND mine_name LIKE ?";
        params.push(`%${filters.mine_name}%`);
      }

      if (filters.purity) {
        sql += " AND purity >= ?";
        params.push(filters.purity);
      }

      if (filters.date_collected) {
        sql += " AND date_collected = ?";
        params.push(filters.date_collected);
      }

      sql += " ORDER BY id DESC";

      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // 🟢 Fetch one sample by ID
  getById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM samples WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // 🟢 Create new sample
  create(sample_name, mine_name, purity, date_collected) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO samples (sample_name, mine_name, purity, date_collected) VALUES (?, ?, ?, ?)",
        [sample_name, mine_name, purity, date_collected],
        function (err) {
          if (err) reject(err);
          else
            resolve({
              id: this.lastID,
              sample_name,
              mine_name,
              purity,
              date_collected,
            });
        }
      );
    });
  },

  // 🟢 Update sample
  update(id, sample_name, mine_name, purity, date_collected) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE samples SET sample_name=?, mine_name=?, purity=?, date_collected=? WHERE id=?",
        [sample_name, mine_name, purity, date_collected, id],
        function (err) {
          if (err) reject(err);
          else
            resolve({
              id,
              sample_name,
              mine_name,
              purity,
              date_collected,
            });
        }
      );
    });
  },

  // 🟢 Delete sample
  delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM samples WHERE id=?", [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  // 🟢 Direct DB Access for CSV Export
  getAllDirect() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM samples ORDER BY id DESC", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
};

module.exports = Sample;
