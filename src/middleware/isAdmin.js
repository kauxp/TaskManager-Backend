const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You don't have access: Admins only" });
    }
    next();
};

export default isAdmin;