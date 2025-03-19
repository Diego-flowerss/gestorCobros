import { pool } from "../db.js";

export const getFineById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM multas WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({ message: "Fine not found" });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const postFine = async (req, res) => {
  try {
    const { residente_id, motivo, monto, fecha_asignacion, estado } = req.body;

    const [rows] = await pool.query(
      "INSERT INTO multas (residente_id, motivo, monto, fecha_asignacion, estado) VALUES (?, ?, ?, ?, ?)",
      [residente_id, motivo, monto, fecha_asignacion, estado]
    );

    res.send({ rows });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
