import { pool } from "../db.js";

export const getResidencias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM residencias");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getResidenciaById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM residencias WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Residencia not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createResidencia = async (req, res) => {
  try {
    const { residente_id, direccion, tipo } = req.body;

    const [result] = await pool.query(
      "INSERT INTO residencias (residente_id, direccion, tipo) VALUES (?, ?, ?)",
      [residente_id, direccion, tipo]
    );

    res
      .status(201)
      .json({ id: result.insertId, residente_id, direccion, tipo });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Actualizar residencia
export const updateResidencia = async (req, res) => {
  try {
    const { residente_id, direccion, tipo } = req.body;

    const [result] = await pool.query(
      `UPDATE residencias SET 
        residente_id = IFNULL(?, residente_id),
        direccion = IFNULL(?, direccion),
        tipo = IFNULL(?, tipo)
        WHERE id = ?`,
      [residente_id, direccion, tipo, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Residencia not found" });
    }

    res.json({ message: "Residencia updated" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteResidencia = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM residencias WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Residencia not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
