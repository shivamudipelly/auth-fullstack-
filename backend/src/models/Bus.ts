import mongoose, { Document, Schema } from "mongoose";

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IStop {
  name: string;
  coordinates: [number, number]; 
}

export interface IBus extends Document {
  busId: number;
  destination: string;
  driverId: mongoose.Types.ObjectId;
  location: ILocation;
  stops: IStop[];
}

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const BusSchema = new Schema<IBus>(
  {
    busId: { type: Number, required: true, unique: true },
    destination: { type: String, required: true, unique: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: LocationSchema, required: true },
    stops: [{
      name: { type: String, required: true },
      coordinates: { type: [Number], required: true },
    }],
  },
  { timestamps: true }
);

export default mongoose.model<IBus>("Bus", BusSchema);
