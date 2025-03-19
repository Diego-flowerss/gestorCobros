import express from "express";
import residentRoutes from "./routes/resident.routes.js";
import stateRoutes from "./routes/acstate.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import fineRoutes from "./routes/fines.routes.js";

import { port } from "./config.js";

const app = express();

app.use(express.json());

app.use(residentRoutes);
app.use(stateRoutes);
app.use(paymentRoutes);
app.use(fineRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});

app.listen(port);
console.log("Server running on port 3000");
