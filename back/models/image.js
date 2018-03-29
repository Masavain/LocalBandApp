const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimeptype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    created_at: Date,
    updated_at: Date
})

const Image = mongoose.model('Image', imageSchema)
module.exports = Image