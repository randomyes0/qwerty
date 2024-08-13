import express from 'express';
import cors from 'cors';
import config from './config.js';
import { G4F } = from "g4f";
import g4f = new G4F();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
	return res.status(200).json({ status: 'Success', message: 'Server running' });
});

app.get('/aichat', async (req, res) => {
  const { apikey, entrada, rol } = req.query; // Usar req.query si los datos vienen de la URL

  if (!apikey || !entrada) {
    return res.status(400).json({ status: false, respuesta: "Faltan parámetros" });
  }

  if (apikey === "sicuani") {
    return res.json({ status: false, respuesta: "adios mundo xd" });
  }

  try {
    const messages = [
      { role: "system", content: rol },
      { role: "user", content: entrada }
    ];
    const rpt = await g4f.chatCompletion(messages);
    return res.json({ status: true, chat: entrada, respuesta: rpt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, respuesta: "Error interno del servidor" });
  }
});

app.listen(3000);
