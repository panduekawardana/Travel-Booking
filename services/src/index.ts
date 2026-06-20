import express from "express";
import { NODE_ENV, PORT, URL } from "./config/env.js";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("OK ajalah");
});

// TODO: PORT RUNNING
app.listen(PORT, () => {
    console.log(`App running at ${URL} ${NODE_ENV} mode`)
});