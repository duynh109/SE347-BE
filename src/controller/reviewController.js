import review from '../models/review.js'

 export const getAllDG= async(req,res)=>{
    const makh = req.query.kh||0;
    const sortOrder = req.query.sortOrder || 'asc';
    let query={};
    if (makh!==0){
        query.makh=makh
    }
    try{
      let listDG= await review.find(query);
      if (sortOrder === 'asc') { 
        listDG = await review.find(query).sort({ createdAt: 'asc' });
      } else {
        listDG = await review.find(query).sort({ createdAt: 'desc' });
      }
        res.send(listDG);
    }catch(e){
        res.status(500).send(e)
    }
    
}
export const createDanhGia = async (req, res) => {
    try {
      const newDG = await review.create(req.body);
      res.json(newDG);
    } catch (e) {
        res.status(500).send(e)
    }
  };

export  const updateDanhGia = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedDG = await review.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if(!updatedDG)
       {
        return res.status(404).send("Not found");
       }
       else{
        res.json(updatedDG);
       }
      
    } catch (e) {
        res.status(500).send(e)
    }
  };


  export  const deleteDanhGia = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedDG = await review.findByIdAndDelete(id);
      if(!deletedDG)
       {
        return res.status(404).send("Not found");
       }
       else{
        res.json(deletedDG);
       }
    } catch (e) {
        res.status(500).send(e)
    }
  };

export const getDGBySP = async (req, res) => {
    try {
        const { id } = req.params;
        const perPage = req.query.perPage || 10; // Lấy số sản phẩm trên một trang từ request query (mặc định là 10)
        const page = req.query.page || 0; // Lấy số trang từ request query (mặc định là 0)
        const sortOrder = req.query.sortOrder || 'asc';
        const rating = parseInt(req.query.rating);
        
        let query= {productid:id};
        if (rating) {
            query.rating = rating; 
        console.log(query);}

        let listDG = await review.find({ productid: id })
        .limit(perPage) // Giới hạn số lượng sản phẩm trên một trang
        .skip(perPage * page); // Bỏ qua số lượng sản phẩm trên các trang trước đó

        if (listDG.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        } else {
        if (sortOrder === 'asc') { // Sắp xếp tăng dần nếu sortOrder là 'asc'
            listDG = await review.find(query).limit(perPage).skip(perPage * page).sort({ createdAt: 'asc' });
        } else { // Sắp xếp giảm dần nếu sortOrder là 'desc'
            listDG = await review.find(query).limit(perPage).skip(perPage * page).sort({ createdAt: 'desc' });
        }

        const totalDG = await review.countDocuments(query);
        res.status(200).json({
            totalDG: totalDG,
            pages: Math.ceil(totalDG / perPage),
            listDanhGia: listDG,
        });
    }
    } catch (e) {
      res.status(500).send(e);
    }
  };

