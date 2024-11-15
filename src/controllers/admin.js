import User from "../models/User.js";
import Task from "../models/Task.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); 
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error });
    }
};


export const deleteTaskByAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting task", error });
    }
};