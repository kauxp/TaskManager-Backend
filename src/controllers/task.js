import Task from '../models/Task.js';

// create 

export const createTask = async (req, res) => {
    const {title, description, status, priority, dueDate} = req.body;
    try{
        const task = new Task({
            userId:req.user.userId, 
            title:title, 
            description:description, 
            status: status,
            priority: priority, 
            dueDate: dueDate
        });
        await task.save();
        return res.status(201).json({message: "Task created successfully"});
    }
    catch(error){
        return res.status(500).json({message: "Error creating the task ", error});
    }
}

// get

export const getTasks = async (req, res) => {
    const {status, priority, dueDate, sortBy, order, page = 1, limit = 10} = req.query;
    try{
        const filter = req.user.userId;
        if(status) filter.status = status;
        if(priority) filter.priority = priority;
        if(dueDate) filter.dueDate = dueDate;

        const sortAlg = {};
        if(sortBy){
            const sortOrder= order === 'desc' ? -1 : 1;
            const sortField = ['dueDate', 'priority'];
            if(sortField.includes(sortBy)){
                sortAlg[sortBy] = sortOrder;
            }

        }

        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const taskPromise = Task.find(filter).sort(sortOptions).skip(skip).limit(pageSize);

        const countPromise = Task.countDocuments(filter);

        const [tasks, total] = await Promise.all([taskPromise, countPromise]);


        const totalPages = Math.ceil(total/pageSize);
        return res.status(200).json({tasks, pagination:{total, totalPages, page: pageNumber, pageSize}});
    }
    catch(error){
        return res.status(500).json({message: "Error fetching tasks ", error});
    }
}

// get by id
export const getTaskById = async (req, res) => {
    const {id} = req.params;
    try{
        const task = await Task.findById(id);
        return res.status(200).json(task);
    }
    catch(error){
        return res.status(500).json({message: "Error fetching the task ", error});
    }
}

// update 
export const updateTask = async (req, res) => {
    const {id} = req.params;
    const {title, description, dueDate, priority, status} = req.body;
    console.log(req.body);
    try{
        const task= await Task.findByIdAndUpdate
        (
            id, 
            {
                title: title, 
                description: description, 
                dueDate: dueDate, 
                priority: priority, 
                status: status
            }, 
        );
        return res.status(200).json(task);
    } 
    catch(error){
        return res.status(500).json({message: "Error updating the task ", error});
    }
}


// delete
export const deleteTask = async (req, res) => {
    const {id} = req.params;
    try{
        await Task.findByIdAndDelete(id);
        return res.status(200).json({message: "Task deleted successfully"});
    }
    catch(error){
        return res.status(500).json({message: "Error deleting the task ", error});
    }
}