const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@getaproperty.sygnvoy.mongodb.net/`);

    console.log('Conectou ao Mongoose');
}

main().catch((error) => console.log(error));

module.exports = mongoose;
