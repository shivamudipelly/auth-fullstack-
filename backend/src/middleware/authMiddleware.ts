import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User"; // Assuming you exported IUser from model
import { Types } from "mongoose";

export interface AuthRequest extends Request {
    user?: {
        _id: string;
        role: string;
        name: string;
        email: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };

        const user = await User.findById(decoded.userId).select("_id role name email");

        if (!user) {
            res.status(404).json({ error: "User not found." });
            return
        }

        // ✅ Cast user to expected type to access _id.toString()
        const castedUser = user as IUser & { _id: Types.ObjectId };

        req.user = {
            _id: castedUser._id.toString(),
            role: castedUser.role,
            name: castedUser.name,
            email: castedUser.email,
        };

        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};


// ✅ Admin Auth - depends on fresh DB data for role
export const adminAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    await authMiddleware(req, res, async () => {
        if (req.user?.role === "ADMIN") {
            return next();
        }
        return res.status(403).json({ error: "Access denied. Admins only." });
    });
};
