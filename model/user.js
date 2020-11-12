module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      'user',
      {
        userId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          field: '_id',
          primaryKey: true
        },
        username: {
          type: Sequelize.STRING,
          field: 'username'
        },
        name: {
          type: Sequelize.STRING,
          field: 'name'
        },
        age: {
          type: Sequelize.STRING,
          field: 'age'
        },
        gender: {
          type: Sequelize.STRING,
          field: 'gender'
        },
        password: {
          type: Sequelize.STRING,
          field: 'password'
        },
        image: {
          type: Sequelize.STRING,
          field: 'image'
        },
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );
    return User;
  };