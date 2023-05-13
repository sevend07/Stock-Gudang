const { barangKeluar, stock } = require("../model/bundleModel");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");

// function for get data on stock table based on nama barnag and merk
const stockData = async (req, res) => {
  const data = await stock
    .findOne({
      where: {
        nama_barang: req.body.nama_barang,
        merk: req.body.merk,
      },
    })
    .then((res) => res);
  return data;
};

// create data
exports.create = async (req, res) => {
  const tanggal = moment(req.body.tanggal, "YYYY-MM-DD").format("YYYY-MM-DD");
  const { id_barang, jumlah } = await stockData(req, res);
  if (id_barang !== null) {
    const create = {
      tanggal: tanggal,
      jumlah: req.body.jumlah,
      satuan: req.body.satuan,
      keterangan: req.body.keterangan,
      idStock: id_barang,
    };
    await barangKeluar.create(create).then(async (created) => {
      if (created) {
        await stock
          .update(
            {
              jumlah: jumlah - create.jumlah,
            },
            {
              where: {
                id_barang: id_barang,
              },
            }
          )
          .then((updated) => {
            if (updated) {
              console.log("update stock data success");
            } else {
              console.log("update stock data error");
            }
          });
        res.status(200).json({
          massage: "data created",
          data: create,
        });
      } else {
        res.status(400).json("create data error");
      }
    });
  } else {
    console.log("stock data not found");
  }
};

// get all data
exports.findAll = async (req, res) => {
  await barangKeluar.findAll()
  .then(data => {
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(400).json("data not found")      
    }
  });
};

// searching function
exports.search = async (req, res) => {
  // input from user
  // use that input to search data on table
  // searching function
  const search = req.query.search || "";
  const tanggal = moment(req.body.tanggal, "YYYY-MM-DD").format("YYYY-MM-DD");
  const startDate = moment(req.body.startDate, "YYYY-MM-DD").format(
    "YYYY-MM-DD"
  );
  const endDate = moment(req.body.endDate, "YYYY-MM-DD").format("YYYY-MM-DD");
  await barangKeluar.findAll({
    where: {
      [Op.or]: [
        Sequelize.literal(`tanggal LIKE "%${tanggal}%"`),
        Sequelize.literal(`tanggal BETWEEN "${startDate}" AND "${endDate}"`),
        {
          "$Stock.nama_barang$": {
            [Op.like]: `%${search}%`,
          },
        },
        {
          "$Stock.jenis_barang$": {
            [Op.like]: `%${search}%`,
          },
        },
        {
          "$Stock.merk$": {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
    include: [
      {
        model: stock,
        as: "Stock"
      }
    ]
  })
  .then(data => {
    if (data) {
      res.status(200).json(data)
    } else {      
      res.status(400).json("data not found")
    }
  });
};

// update data
exports.update = async (req, res) => {};

// delete data
exports.delete = async (req, res) => {};
