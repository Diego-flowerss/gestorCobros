import { pool } from "../db.js";

export const getPaymentById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pagos WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({ message: "Payment not found" });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const postPayment = async (req, res) => {
  try {
    const { residente_id, fecha_pago, monto, recibo, metodo_pago, estado } =
      req.body;

    const [rows] = await pool.query(
      "INSERT INTO pagos (residente_id, fecha_pago, monto, recibo, metodo_pago, estado) VALUES (?, ?, ?, ?, ?, ?)",
      [residente_id, fecha_pago, monto, recibo, metodo_pago, estado]
    );

    res.send({ rows });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
