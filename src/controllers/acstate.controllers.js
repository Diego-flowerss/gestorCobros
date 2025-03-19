import { pool } from "../db.js";

export const getStateById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM estados_cuenta WHERE id = ?",
      [req.params.id]
    );

    if (rows.length <= 0)
      return res.status(404).json({ message: "Account statement not found" });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
