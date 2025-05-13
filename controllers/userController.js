const { where } = require("sequelize");
const {User,Book} = require("../models");

const doesEmailExist = async(email)=>{
    const user = await User.findOne({where:{email}});
    return user;
}

const createUser = async(req,res)=>{
    try{
        const {username, email} = req.body;

        if(!username || !email){
            res.status(400).json("Check your body again!");
        }
        const addNewUser = await User.create({
            username,
            email
        });

        // if(doesEmailExist(email)){
        //     return res.status(400).json("user already exists!");
        // }

        res.status(200).json({
            message:"User created successfully!",
            addNewUser,
        })

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }

}


const fetchBook = async(req,res)=>{
    try{

       const { query } = req.query;

        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);

        const data = await response.json();

        const books = data.items?.map(item=>{
        const info = item.volumeInfo;
              return{
                title: info.title || "No title",
                author: info.authors?.join(","),
                thumbnail: info.imageLinks?.thumbnail || null,
              }
        }) || [];

     res.status(200).json({ books });



    }catch(error){
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
}


// save book to user collection

const saveBookToCollection = async (req, res) => {
  try {
    const { userId, title, author, thumbnail } = req.body;

    if (!userId || !title || !author) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const findUser = await User.findByPk(userId);

    if (!findUser) {
      return res.status(404).json({ message: "User ID is not present!" });
    }

    const savedBook = await Book.create({
      userId,
      title,
      author,
      thumbnail,
    });

    res.status(201).json({
      message: "Book saved successfully!",
      book: savedBook,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error!", error: error.message });
  }
};



module.exports = {createUser, fetchBook,saveBookToCollection}