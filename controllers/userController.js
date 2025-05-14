const { where } = require("sequelize");
const {User:userModel,Book:bookModel, Tag:tagModel} = require("../models");


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
  console.log("saved book in collection")
  console.log(req.body);

  try {

        console.log(req.body);

    const { title, author, thumbnail, userId } = req.body;

    if (!userId || !title || !author) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("find user");

    const findUser = await userModel.findByPk(userId);
    console.log(findUser);

    if (!findUser) {
      return res.status(404).json({ message: "User ID is not present!" });
    }

    const savedBook = await bookModel.create({
      title,
      author,
      thumbnail,
       userId
    });

    console.log("ater savebook");

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


const addTags = async(req,res)=>{
 try{
    const {bookId, name} = req.body;

    const findBookId = await bookModel.findByPk(bookId);

    if(!findBookId){
      res.status(404).json("BookId is not present");
    }

    const createTag = await tagModel.create({
      bookId,
      name
    });

  //  const findDuplicateTage = await tagModel.findOne

    res.status(200).json({message:"Tag added successfully",createTag});

 }catch(error){
  res.status(500).json({message:"Internal Server Error",error:error.message});
 }
}

const searchByTag = async(req,res)=>{
  try{
    const tagName = req.query.tagName;


    const findBookByTag = await tagModel.findByPk(tagName);

    if(!findBookByTag){
      res.status(400).json("Book not find by tag");
    }

    res.status(200).json({books: findBookByTag});

  }catch(error){
    res.status(500).json({message:"Internal Server Error",error:error.message});
  }
}


module.exports = {createUser, fetchBook,saveBookToCollection,addTags,searchByTag}