import Warehouse from "../models/warehouse.js";

export const getAllTonKho= async(req,res)=>{
    try{
        const listTonKho= await Warehouse.find({});
        res.send(listTonKho);
    } catch(e){
        res.status(500).send(e)
    }
} 

export const getTonKhoById = async(req, res)=>{
    // const { id } = req.params
    try {
        const tonkho = await Warehouse.findOne({_id:req.params.id})
        if (!Warehouse)
            res.status(404).send("Not found!")
        res.send(tonkho)
    } catch (e) {
        res.status(500).send(e)
    }
}
export const getTonKhoByThang = async(req, res)=>{
  // const { id } = req.params
  try {
      const {thang} = req.params;
      const tonkho = await Warehouse.find({thang: thang})
      if (!tonkho || tonkho.length === 0)
          res.status(404).send("Not found!")
      res.send(tonkho)
  } catch (e) {
      res.status(500).send(e)
  }
}
//Thêm người dùng:
export const addTonKho = async(req, res)=> {
    try {
      console.debug("Adding user...");
      const warehouse = new  Warehouse({ ...req.body });
      await warehouse.save();
      return res.status(201).json(warehouse);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Cập nhật thông tin người dùng:
  export const updateTonKho = async(req, res)=> {
    try {
      console.debug("Updating User...");
      const updatedTonKho = await  Warehouse.findByIdAndUpdate({_id:req.params.id}, req.body, {
        new: true,
      });
      if (!updatedTonKho) {
        return res.status(404).json({ error: "User not found." });
      }
      return res.json(updatedTonKho);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
//dang sua


export const deleteTonKho = async(req, res) => {
    try {
        console.debug("Deleting User...");
        const deletedWarehouse = await Warehouse.findOneAndDelete({_id:req.params.id});
        if (!deletedWarehouse) {
          return res.status(404).json({ error: "Warehouse not found." });
        }
        return res.json(deletedWarehouse);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
}