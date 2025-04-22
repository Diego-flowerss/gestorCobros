import { pool } from "../db.js";

export const getAllVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vehiculos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vehiculos WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Vehicle not found" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const postVehicle = async (req, res) => {
  try {
    const { residente_id, marca, modelo, placa, color } = req.body;

    const [result] = await pool.query(
      "INSERT INTO vehiculos (residente_id, marca, modelo, placa, color) VALUES (?, ?, ?, ?, ?)",
      [residente_id, marca, modelo, placa, color]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM vehiculos WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Vehicle not found" });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { residente_id, marca, modelo, placa, color } = req.body;

    const [result] = await pool.query(
      "UPDATE vehiculos SET residente_id = IFNULL(?, residente_id), marca = IFNULL(?, marca), modelo = IFNULL(?, modelo), placa = IFNULL(?, placa), color = IFNULL(?, color) WHERE id = ?",
      [residente_id, marca, modelo, placa, color, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Vehicle not found" });

    res.json({ message: "Vehicle updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
