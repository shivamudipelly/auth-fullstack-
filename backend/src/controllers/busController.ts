import { Request, Response } from "express";
import Bus, { IBus } from "../models/Bus";
import User, { IUser } from "../models/User";
import mongoose from "mongoose";

// Create a new bus and link it to a driver
export const createBus = async (req: Request, res: Response) => {
  console.log('shiva');
  
  try {
    const { busId, destination, driverId, stops } = req.body;

    // Normalize values to lowercase to avoid case-sensitive conflicts
    const normalizedDestination = destination.toLowerCase(); // Assuming destination is a string

    // Check if driver exists by email
    const driver = await User.findOne({ email: driverId, role: "DRIVER" });
    if (!driver) {
      res.status(404).json({ message: "Driver not found or not a DRIVER." });
      return;
    }

    // Check for duplicate busId (case-insensitive)
    const existingBusById = await Bus.findOne({ busId });
    if (existingBusById) {
      res.status(400).json({ message: "Bus ID already exists." });
      return;
    }

    // Check for duplicate destination (case-insensitive)
    const existingBusDriver = await Bus.findOne({ driverId: driver._id });
    if (existingBusDriver) {
      res.status(400).json({ message: "Bus with this driver already exists." });
      return;
    }

    // Check for duplicate destination (case-insensitive)
    const existingBusByDestination = await Bus.findOne({ destination: normalizedDestination });
    if (existingBusByDestination) {
      res.status(400).json({ message: "A bus with the same destination already exists." });
      return;
    }



    // Create a new bus, assign driver using driver's _id (ObjectId)
    const newBus = new Bus({
      busId,
      destination: normalizedDestination,
      driverId: driver._id,  // Use the ObjectId of the driver here
      location: { latitude: 0, longitude: 0 },
      stops,
    });

    // Save bus to the database
    await newBus.save();
    res.status(201).json({ message: "Bus created successfully" });
  } catch (error) {
    // Log the error and send a generic internal server error response
    console.error("Error creating bus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all buses with driver details (name and email)
export const findBuses = async (req: Request, res: Response) => {
  try {
    const buses = await Bus.find()
      .populate("driverId", "name email")
      .exec();
    if (buses.length > 0) {
      res.status(200).json(buses);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Error fetching buses" });
  }
};

export const updateBus = async (req: Request, res: Response) => {
  try {
    const { busId } = req.params; // Bus ID from URL parameters
    const { destination, driverId, stops } = req.body;

    // Find the bus by busId
    const bus = await Bus.findById(busId);
    if (!bus) {
      res.status(404).json({ message: "Bus not found." });
      return;
    }

    // Normalize the destination (like in createBus)
    const normalizedDestination = destination?.toLowerCase().trim().replace(/\s+/g, ' ');

    // Check if driver exists by email
    if (driverId) {
      const driver = await User.findOne({ email: driverId, role: "DRIVER" });
      if (!driver) {
        res.status(404).json({ message: "Driver not found or not a DRIVER." });
        return;
      }

      // Assert driver._id as mongoose.Types.ObjectId
      const driverIdObject = driver._id as mongoose.Types.ObjectId;

      // If driverId is different, check if the driver is already assigned to another bus
      if (driverIdObject.toString() !== bus.driverId.toString()) {
        const existingBusDriver = await Bus.findOne({ driverId: driverIdObject });
        if (existingBusDriver) {
          res.status(400).json({ message: "Bus with this driver already exists." });
          return;
        }
      }

      // Update the bus with the new driverId
      bus.driverId = driverIdObject;
    }

    // Check if the destination is being updated and if it already exists
    if (destination) {
      const existingBusByDestination = await Bus.findOne({ destination: normalizedDestination });
      if (existingBusByDestination && (existingBusByDestination._id as mongoose.Types.ObjectId).toString() !== busId) {
        res.status(400).json({ message: "A bus with the same destination already exists." });
        return;
      }

      // Assert existingBusByDestination._id as mongoose.Types.ObjectId
      const destinationId = existingBusByDestination?._id as mongoose.Types.ObjectId;

      // Update the destination
      bus.destination = normalizedDestination;
    }

    // If stops are provided, update the stops
    if (stops) {
      bus.stops = stops;
    }

    // Save the updated bus
    await bus.save();

    res.status(200).json({ message: "Bus updated successfully" });
  } catch (error) {
    // Log the error and send a generic internal server error response
    console.error("Error updating bus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Delete a bus
export const deleteBus = async (req: Request, res: Response) => {
  try {
    const { busId } = req.params;

    // Find and delete the bus
    const bus = await Bus.findByIdAndDelete(busId);

    if (!bus) {
      res.status(404).json({ message: "Bus not found." });
      return
    }

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch Bus Details along with Route and Stops
export const busRoutes = async (req: Request, res: Response) => {
  try {
    // Fetch the bus by its busId
    const bus = await Bus.findOne({ busId: req.params.busId })
      .populate('driverId', 'name email')
      .exec();


    if (!bus) {
      res.status(404).json({ message: 'Bus not found' });
      return
    }

    const busData = {
      busId: bus.busId,
      destination: bus.destination,
      stops: bus.stops,
      driver: bus.driverId,
      location: bus.location,
    };

    res.json(busData);
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({ message: 'Server error while fetching bus data', error });
  }
};



