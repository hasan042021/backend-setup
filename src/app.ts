import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import {
  errorHandler,
  notFoundHandler,
} from "@middlewares/errorHandler.middlewares";

const corsOptions = {
  origin: ["*"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(cookieParser());

app.set("layout", "layout");
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

/* app.use("/api/v1", apiV1Router);
app.use("/api/external", apiServiceRouter); */

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
