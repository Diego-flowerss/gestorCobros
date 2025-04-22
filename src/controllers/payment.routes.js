import { pool } from "../db.js";

// Obtener todos los pagos
export const getAllPayments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pagos");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

// Obtener un pago por ID
export const getPaymentById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pagos WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({ message: "Payment not found" });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

// Insertar un nuevo pago
export const postPayment = async (req, res) => {
  try {
    const { residente_id, fecha_pago, monto, recibo, metodo_pago, estado } =
      req.body;

    const [rows] = await pool.query(
      "INSERT INTO pagos (residente_id, fecha_pago, monto, recibo, metodo_pago, estado) VALUES (?, ?, ?, ?, ?, ?)",
      [residente_id, fecha_pago, monto, recibo, metodo_pago, estado]
    );

    res.json({ message: "Payment created successfully", id: rows.insertId });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

// Eliminar un pago por ID
export const deletePayment = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM pagos WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Payment not found" });

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

// Actualizar un pago por ID
export const updatePayment = async (req, res) => {
  try {
    const { residente_id, fecha_pago, monto, recibo, metodo_pago, estado } =
      req.body;

    const [result] = await pool.query(
      "UPDATE pagos SET residente_id = ?, fecha_pago = ?, monto = ?, recibo = ?, metodo_pago = ?, estado = ? WHERE id = ?",
      [
        residente_id,
        fecha_pago,
        monto,
        recibo,
        metodo_pago,
        estado,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Payment not found" });

    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
