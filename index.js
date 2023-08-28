const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware CORS
app.use(cors({
  origin: '*', // acepta todos los origenes
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'] // metodos que acepta
}));

app.use(express.json()); // este middleware analizará automáticamente el cuerpo de la solicitud entrante en formato JSON y lo convertirá en un objeto que se puede acceder a través de req.body

app.get('/login', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.setHeader('Content-Type', 'application/json');

    const userData = req.body
    console.log({userData})

    // Realiza una solicitud a la API OAuth para obtener el token
    const response = await axios.post(process.env.OAUTH_URL, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials'
    });

    const token = response.data.access_token;

    // Envía el token al frontend en la respuesta
    res.json({ token });

  } catch (error) {
    console.error('Error al obtener el token:', error);
    res.status(500).json({ error: 'Error al obtener el token' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
