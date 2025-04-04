import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
    busId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const BusLocation = mongoose.model('BusLocation', busLocationSchema);
export default BusLocation;
