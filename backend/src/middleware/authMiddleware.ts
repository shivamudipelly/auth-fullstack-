import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
    user?: { userId: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === "ADMIN") {
            next();
        }
        res.status(401).json({ error: "Access denied. Admins only." });
    });
};
