module.exports = (sequelize, Sequelize) => {
    const Blog = sequelize.define(
      'blog',
      {
        postId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          field: '_id',
          primaryKey: true
        },
        postTitle: {
          type: Sequelize.STRING,
          field: 'post_title'
        },
        postDetail: {
          type: Sequelize.STRING,
          field: 'post_detail'
        },
        postDtm: {
          type: Sequelize.DATE,
          field: 'post_dtm'
        },
        postAuthor: {
          type: Sequelize.STRING,
          field: 'post_author'
        },
        postStatus: {
          type: Sequelize.STRING,
          field: 'post_status'
        },
        postImage: {
          type: Sequelize.STRING,
          field: 'post_image'
        },
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );

    return Blog;
  };