import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();
app.use(express.json());




const PORT = process.env.PORT || 5000;

const appik = "Hello World";
console.log(appik);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);   
    connectDB();

})

app.get("/", (req, res) => {
  res.send("Server working");
});



app.use("/api/auth", authRoutes);   




