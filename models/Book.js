module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnail :{
        type: DataTypes.STRING,
        allowNull: false
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Book.associate = (models) => {
    // A Book belongs to one User
    Book.belongsTo(models.User, {
      foreignKey: 'userId',
    });
      Book.belongsToMany(models.Tag, {
      through: 'BookTags',
      foreignKey: 'bookId',
      otherKey: 'tagId'
    });
  };

  return Book;
};