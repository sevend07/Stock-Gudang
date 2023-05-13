const express = require("express");
const cors = require("cors");
const stockRouter = require("./router/stock");
const barangMasukRouter = require('./router/barangMasuk')
const barangKeluarRouter = require('./router/barangKeluar')
const db = require("./model/bundleModel");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- routers ---
// stock router
app.use('/stock', stockRouter);

// barang masuk router
app.use('/barangmasuk', barangMasukRouter)

// barang keluar router
app.use('/barangkeluar', barangKeluarRouter)

// sequelize sync
db.sequelize.sync({ force: false });

// run server
app.listen(port, () => {
  console.log(`server running on port:${port}`);
});
