import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

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
export const getAllUsers = async (req: Request, res: Response) => {

  try {
    const persons = await User.find();
    let users = []
    for (let p of persons) {
      users.push({ id: p._id, name: p.name, email: p.email, isVerified: p.isVerified, role: p.role })
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching Users',
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
    // 🔍 Check if a user already exists with this email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "A user with this email already exists.",
      });
      return;
    }

    // ✅ Proceed to create user if not exists
    const user = new User({ name, email, password, role, isVerified });
    await user.save();
    console.log('succes');
    
    res.status(201).json({
      message: "User added successfully",
      _id: user._id,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error adding user",
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
    console.log(person);
    
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

//Fucntion to edit a Person
export const editUser = async (
  req: Request<{ id: string }, any, EditUserRequestBody>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  const data: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
  }> = {};

  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (role !== undefined) data.role = role;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(password, salt);
  }

  try {
    const user = await User.findByIdAndUpdate(id, data, { new: true });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({
      message: 'Error updating user',
      error: (err as Error).message,
    });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id, 'name email role isVerified');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching user data' });
  }
}