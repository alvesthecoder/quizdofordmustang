const express = require('express');
const path = require('path');
const app = express();

// Rotas da API
app.use('/api', require('./upload.routes'));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ...outras configurações e rotas...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});