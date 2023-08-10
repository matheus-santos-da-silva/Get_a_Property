const mongoose = require('mongoose');
const { Schema } = mongoose;

const Property = mongoose.model(
    'Property',
    new Schema({
        
        type: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        zipcode: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        bedrooms: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        images: {
            type: Array,
            required: true,
        },

        available: {
            type: Boolean
        },

        user: Object,
        contractor: Object

    }, {timestamps: true}
    )
);

module.exports = Property;