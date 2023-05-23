import express, { Express } from "express";
import cors from "cors";
import logger from "./middlewares/logEvents";
import errorHandle from "./middlewares/errorHandle";
import credentials from "./middlewares/credentials";
import corsOptionsDelegate from "./config/corsOptions";
import { PORT } from "./config/dotenv";
import verifyJWT from "./middlewares/verifyJWT";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/users.routes";
import registerRoutes from "./routes/register.routes";
import authRoutes from "./routes/auth.routes";
import refreshRoutes from "./routes/refresh.routes";
import logoutRoutes from "./routes/logout.routes";
import connectDB from "./config/dbConn";

const app: Express = express();

/* Connection to MongoDB */
connectDB();

/* Middlewares */
// Custom middleware logger
app.use(logger);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// Cross Origin Resources Sharing
app.use(cors(corsOptionsDelegate));
// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
// Built-in middleware for json
app.use(express.json());
// Middleware for cookie
app.use(cookieParser());
// Serve static files
// app.use("/", express.static(path.join(__dirname, "/public")));

/* Routes */
app.use("/register", registerRoutes);
app.use("/auth", authRoutes);
app.use("/refresh", refreshRoutes);
app.use("/logout", logoutRoutes);
app.use(verifyJWT);
app.use("/users", usersRoutes);

/* Middlewares */
// Middleware to handle errors
app.use(errorHandle);

/* Open the server */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
