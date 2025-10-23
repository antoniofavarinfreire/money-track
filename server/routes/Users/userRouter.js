const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users"); // modelo Sequelize

const JWT_SECRET = "chave-super-secreta";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "E-mail ou senha inválidos." });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "E-mail ou senha inválidos." });

    // ✅ Gera token válido por 1h
    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login bem-sucedido",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching users." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o e-mail já está cadastrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Gera hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      registration_date: new Date(),
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        registration_date: newUser.registration_date,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
