const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    calories: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const infoModel = mongoose.model("info", infoSchema);

module.exports = infoModel;
