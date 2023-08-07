const bcrypt = require('bcryptjs');

const encryptingPass = async (pass) => {

    const password = pass.toString()

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;

}

module.exports = encryptingPass;