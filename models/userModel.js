const db = require("../database/db");
const bcrypt = require("bcryptjs");

const User = {
  async register(email, password) {
    const hashed = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashed],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email });
        }
      );
    });
  },

  async login(email, password) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) reject(err);
        else if (!user) reject("User not found");
        else {
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) reject("Invalid password");
          else resolve(user);
        }
      });
    });
  },
};

module.exports = User;
