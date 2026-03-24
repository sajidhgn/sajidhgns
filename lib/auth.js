import jwt from 'jsonwebtoken';

export function verifyAuth(req) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}
