CREATE DATABASE gestor_cobros;
USE gestor_cobros;

CREATE TABLE residentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT NOT NULL,
    fecha_pago DATE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    recibo VARCHAR(50) UNIQUE NOT NULL,
    metodo_pago ENUM('banco fisico', 'banco electronico') NOT NULL,
    estado ENUM('pendiente', 'validado') DEFAULT 'pendiente',
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
);

CREATE TABLE estados_cuenta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT NOT NULL,
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
);

CREATE TABLE multas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT NOT NULL,
    motivo TEXT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_asignacion DATE NOT NULL,
    estado ENUM('pendiente', 'pagado') DEFAULT 'pendiente',
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
);

CREATE TABLE cuotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT NOT NULL,
    tipo ENUM('mensual', 'anual') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_generacion DATE NOT NULL,
    estado ENUM('pendiente', 'pagado') DEFAULT 'pendiente',
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
);

CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    residente_id INT NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    placa VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(30),
    FOREIGN KEY (residente_id) REFERENCES residentes(id)
);

CREATE TABLE residencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    direccion VARCHAR(255) NOT NULL,
    numero_unidad VARCHAR(20) NOT NULL UNIQUE,
    tipo ENUM('casa', 'apartamento') NOT NULL
);

ALTER TABLE residentes
ADD COLUMN residencia_id INT,
ADD FOREIGN KEY (residencia_id) REFERENCES residencias(id);

CREATE TABLE estado_cuenta_general (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT,
    ingreso DECIMAL(10,2) DEFAULT 0.00,
    egreso DECIMAL(10,2) DEFAULT 0.00,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    servicio VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(255)
);

CREATE TABLE pagos_proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    descripcion TEXT,
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);



-- Procedimiento para aplicar recargo por pago tardío
DELIMITER $$
CREATE PROCEDURE aplicar_recargo()
BEGIN
    UPDATE estados_cuenta ec
    JOIN residentes r ON ec.residente_id = r.id
    SET ec.saldo = ec.saldo + 25
    WHERE NOT EXISTS (
        SELECT 1 FROM pagos p
        WHERE p.residente_id = r.id
        AND MONTH(p.fecha_pago) = MONTH(CURDATE())
        AND YEAR(p.fecha_pago) = YEAR(CURDATE())
        AND DAY(p.fecha_pago) <= 10
    );
END $$
DELIMITER ;

-- Procedimiento para generar cuota anual
DELIMITER $$
CREATE PROCEDURE generar_cuota_anual()
BEGIN
    INSERT INTO cuotas (residente_id, tipo, monto, fecha_generacion, estado)
    SELECT id, 'anual', 350, CURDATE(), 'pendiente' FROM residentes;
END $$
DELIMITER ;

-- Crear estado de cuenta cada vez que se crea un nuevo residente

DELIMITER $$

CREATE TRIGGER crear_estado_cuenta
AFTER INSERT ON residentes
FOR EACH ROW
BEGIN
    INSERT INTO estados_cuenta (residente_id, saldo) 
    VALUES (NEW.id, 0.00);
END $$

DELIMITER ;

-- agregar saldo al estado de cuenta

DELIMITER $$

CREATE TRIGGER actualizar_saldo_pago
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    UPDATE estados_cuenta 
    SET saldo = saldo + NEW.monto
    WHERE residente_id = NEW.residente_id;
END $$

DELIMITER ;

-- aplicar cuota mensual

DELIMITER $$

CREATE EVENT aplicar_cuota_mensual
ON SCHEDULE EVERY 1 MONTH
STARTS (TIMESTAMP(CURRENT_DATE + INTERVAL 1 DAY)) 
DO
BEGIN
    UPDATE estados_cuenta 
    SET saldo = saldo - 300;
END $$

DELIMITER ;

-- aplicar multa al saldo actual

DELIMITER $$

CREATE TRIGGER actualizar_saldo_multa
AFTER INSERT ON multas
FOR EACH ROW
BEGIN
    UPDATE estados_cuenta 
    SET saldo = saldo - NEW.monto
    WHERE residente_id = NEW.residente_id;
END $$

DELIMITER ;

-- registrar pago en estado de cuenta general

DELIMITER $$

CREATE TRIGGER registrar_ingreso_general
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
  IF NEW.estado = 'validado' THEN
    INSERT INTO estado_cuenta_general (descripcion, ingreso)
    VALUES (CONCAT('Pago recibido del residente ID ', NEW.residente_id, ', Recibo: ', NEW.recibo), NEW.monto);
  END IF;
END $$

DELIMITER ;

-- egresos por proovedores

DELIMITER $$

CREATE TRIGGER registrar_egreso_general
AFTER INSERT ON pagos_proveedores
FOR EACH ROW
BEGIN
  INSERT INTO estado_cuenta_general (descripcion, egreso)
  VALUES (CONCAT('Pago al proveedor ID ', NEW.proveedor_id, ': ', NEW.descripcion), NEW.monto);
END $$

DELIMITER ;
