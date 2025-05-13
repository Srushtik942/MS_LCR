module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Ensure tag names are unique
    }
  });

  Tag.associate = (models) => {
    // A Tag can be linked to multiple Books
    Tag.belongsToMany(models.Book, {
      through: 'BookTags', // The join table between Tag and Book
      foreignKey: 'tagId',
      otherKey: 'bookId'
    });
  };

  return Tag;
};
