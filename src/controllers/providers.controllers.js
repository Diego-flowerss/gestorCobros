import { pool } from "../db.js";

export const getProviders = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM proveedores");
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM proveedores WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Provider not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createProvider = async (req, res) => {
  try {
    const { nombre, servicio, telefono, email, direccion } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO proveedores (nombre, servicio, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
      [nombre, servicio, telefono, email, direccion]
    );
    res.status(201).json({ id: rows.insertId });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, servicio, telefono, email, direccion } = req.body;
    const [result] = await pool.query(
      `UPDATE proveedores SET 
        nombre = IFNULL(?, nombre), 
        servicio = IFNULL(?, servicio),
        telefono = IFNULL(?, telefono),
        email = IFNULL(?, email),
        direccion = IFNULL(?, direccion)
      WHERE id = ?`,
      [nombre, servicio, telefono, email, direccion, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Provider updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM proveedores WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Provider not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
