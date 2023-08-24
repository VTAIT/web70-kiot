import { AUTH } from "../globals/api.js";

export const checkIP = (req, res, next) => {
    const PA = req.headers[AUTH.pa];

    if (PA === process.env.PA) {
        req.pa = true;
    }

    next();
}
