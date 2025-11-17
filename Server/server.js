import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors()); //Enable Cross-origin Resource Sharing

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Api Is Working"));

app.listen(PORT, () => console.log(`server runing on port ${PORT}`));
