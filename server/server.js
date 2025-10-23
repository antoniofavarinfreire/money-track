const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/Users/userRouter");

app.use(
  cors({
    origin: "http://localhost:8080", // porta do front Vue
    credentials: true,
  })
);

app.use(express.json());
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
