//const mongoose = require('mongoose');
import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        console.log(process.env.DATABASE_URI);
        await connect(process.env.DATABASE_URI!);
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB