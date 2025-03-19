import { pool } from "../db.js";

export const pingResident = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM residentes");
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const pingResidentById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM residentes WHERE id = ?", [
      req.params.resident,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({ message: "Resident not found" });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const postResident = async (req, res) => {
  try {
    const { nombre, apellido, direccion, telefono, email, fecha_registro } =
      req.body;

    const [rows] = await pool.query(
      "INSERT INTO residentes (nombre, apellido, direccion, telefono, email, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, direccion, telefono, email, fecha_registro]
    );

    res.send({ rows });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const deleteResident = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM residentes WHERE id = ?", [
      req.params.resident,
    ]);

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Resident not found",
      });
    res.status(204);
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const updateResident = async (req, res) => {
  try {
    const { resident } = req.params;
    const { nombre, apellido, direccion, telefono, email, fecha_registro } =
      req.body;

    const [result] = await pool.query(
      "UPDATE residentes SET nombre = IFNULL(?,nombre), apellido = IFNULL(?,apellido), direccion = IFNULL(?,direccion), telefono = IFNULL(?,telefono),email = IFNULL(?,email),fecha_registro = IFNULL(?,fecha_registro) WHERE id = ?",
      [nombre, apellido, direccion, telefono, email, fecha_registro, resident]
    );

    if (result.affectedRows == 0)
      return res.status(404).json({
        message: "Resident not found",
      });

    res.send("resident updated");
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
