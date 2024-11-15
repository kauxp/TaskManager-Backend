import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({message: "Unauthorized"});
    try{
        const decoded = jwt.decode(token, { complete: true });
        const verifiedToken = jwt.verify(token, secret);
        req.user = verifiedToken;
        next();
    }
    catch(error){
        return res.status(500).json({message: "Error: ", error});
    }
};

export default authToken;



