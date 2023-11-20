// server.js
import express from 'express';
import cors from "cors";
import servicesRouter from './services.js'
import namespaceRouter from './namespace.js'
import alertsRouter from './alerts.js'
// import loginRouter from './Login.js'
// import podsRouter from './pods';
// import deploymentsRouter from './deployments';

const app = express();
app.use(cors());
app.use(express.json());

const port = 4000; // or any other port of your choice

app.use('/api/services', servicesRouter);
app.use('/api/namespaces', namespaceRouter);
app.use('/api/alerts', alertsRouter);
// app.use('/api/login', loginRouter)
// app.use('/api/pods', podsRouter);
// app.use('/api/deployments', deploymentsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



