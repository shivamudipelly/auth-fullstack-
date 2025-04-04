import { Request, Response } from 'express';
import User from '../models/User';

// Define interfaces for type-safety
interface AddUserRequestBody {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER' | 'DRIVER';
}

export interface EditUserRequestBody {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'USER' | 'DRIVER';
}

// Function to get all persons
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const persons = await User.find();
    res.status(200).json(persons);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching persons',
      error: (err as Error).message,
    });
  }
};

// Function to add a person
export const addUser = async (
  req: Request<{}, {}, AddUserRequestBody>,
  res: Response
): Promise<void> => {
  const { name, email, password, role } = req.body;
  const isVerified: boolean = true;
  try {
    const person = new User({ name, email, password, role, isVerified });
    await person.save();
    res.status(201).json({ message: 'User added successfully', person });
  } catch (err) {
    res.status(500).json({
      message: 'Error adding person',
      error: (err as Error).message,
    });
  }
};

// Function to delete a person
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const person = await User.findByIdAndDelete(id);
    if (!person) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({
      message: 'Error deleting person',
      error: (err as Error).message,
    });
  }
};

// Function to edit a person
export const editUser = async (
  req: Request<{ id: string }, any, EditUserRequestBody>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const person = await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true }
    );
    if (!person) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User updated successfully', person });
  } catch (err) {
    res.status(500).json({
      message: 'Error updating person',
      error: (err as Error).message,
    });
  }
};
