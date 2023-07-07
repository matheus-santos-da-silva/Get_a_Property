const User = require('../models/User');

const checkUserExists = async (email) => {

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            return user;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }

}

module.exports = checkUserExists;