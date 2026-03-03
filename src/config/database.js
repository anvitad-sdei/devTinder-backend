const mongoose = require("mongoose");

// "mongodb+srv://namastedev:aMUkbwjqweU5gm9X@namastenode.e0qkoeu.mongodb.net/" this strings connect with cluster
// "mongodb+srv://namastedev:aMUkbwjqweU5gm9X@namastenode.e0qkoeu.mongodb.net/devtinder" after slash add database name it means connect with db
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:aMUkbwjqweU5gm9X@namastenode.e0qkoeu.mongodb.net/devtinder",
  );
};

module.exports = {
  connectDB,
};
