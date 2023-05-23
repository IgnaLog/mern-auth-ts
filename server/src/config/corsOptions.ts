import allowedOrigins from "./allowedOrigins";

const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions: { origin: boolean };
  if (allowedOrigins.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default corsOptionsDelegate;
