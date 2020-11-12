// import lib
const express = require('express');
const db = require('../util/db.config');
// define variable
const sequelize = db.sequelize;
const Blog = db.blog;
const User = db.user;
const route = express.Router();
let jsonResult = {
  responseCode: "",
  responseMessage: "",
  responseData: ""
}
// get home
route.get('/', async (req, res, next) => {
  res.end("Server blog start (.)")
});

// get blog with id
route.get('/find/id/:id', async (req, res, next) => {
  console.log('body::==', req.body);
  console.log('params::==', req.params);
  console.log('header::==', req.header('key'));
  const blogId = req.params.id;
  let blogs = {};
  let user = await User.findById(req.header('key'));
  const findBlog = await Blog.findById(blogId);
  if (user === null) {
    jsonResult = {
      responseCode: "0002",
      responseMessage: "user not found",
    }
    res.json(jsonResult);
  } else {
    if (findBlog.user_id !== user.userId) {
      jsonResult = {
        responseCode: "0003",
        responseMessage: "user deny",
      }
      res.json(jsonResult);
    } else {
      blogs = await Blog.findById(blogId);
      if (blogs != null) {
        jsonResult = {
          responseCode: "0000",
          responseMessage: "success",
          responseData: blogs
        }
        res.json(jsonResult);
      } else {
        jsonResult = {
          responseCode: "0001",
          responseMessage: "find not found",
        }
        res.json(jsonResult);
      }
    }
  }
});

// get blogs all
route.get('/find/all', async (req, res, next) => {
  console.log('body::==', req.body);
  console.log('params::==', req.params.user_id);
  console.log('header::==', req.header('key'));
  try {
    let user = await User.findById(req.header('key'));
    if (user == null) {
      jsonResult = {
        responseCode: "0002",
        responseMessage: "user not found",
      }
      res.json(jsonResult);
    } else {
      const userId = user.userId;
      if (user != null) {
        const blogs = await Blog.findAll({
          include: [
            {
              model: User,
              where: { userId: userId }
            }
          ]
        })
        if (blogs != null || blogs.length > 0) {
          jsonResult = {
            responseCode: "0000",
            responseMessage: "success",
            responseData: blogs
          }
          res.json(jsonResult);
        } else {
          jsonResult = {
            responseCode: "0001",
            responseMessage: "find not found blogs",
          }
          res.json(jsonResult);
        }
      }
    }
  } catch (err) {
    jsonResult = {
      responseCode: "0003",
      responseMessage: "find all fail",
    }
    res.json(jsonResult);
  }
});

//create blog
route.post('/create', async (req, res, next) => {
  try {
    console.log('body::==', req.body);
    console.log('params::==', req.params);
    console.log('header::==', req.header('key'));
    let user = await User.findById(req.header('key'));
    if (user == null) {
      jsonResult = {
        responseCode: "0002",
        responseMessage: "not found user",
      }
      res.json(jsonResult);
    } else {
      let blog = {
        postTitle: req.body.postTitle,
        postDetail: req.body.postDetail,
        postDtm: new Date(),
        postAuthor: req.body.postAuthor,
        postStatus: req.body.postStatus,
        user_id: user.userId
      }

      let newBlog = null;
      if (blog) {
        newBlog = await sequelize.transaction(function (t, err) {
          // chain all your queries here. make sure you return them.
          return Blog.create(blog, { transaction: t });
        });
      }
      jsonResult = {
        responseCode: "0000",
        responseMessage: "create success",
      }
      res.json(jsonResult);
    }
  } catch (err) {
    jsonResult = {
      responseCode: "0001",
      responseMessage: "create fail",
    }
    res.json(jsonResult);
  }
});

//update blog
route.put('/update/:id', async (req, res, next) => {
  try {
    console.log('update blog start');
    console.log('body::==', req.body);
    console.log('params::==', req.params);
    console.log('header::==', req.header('key'));
    const postId = req.params.id;
    let user = await User.findById(req.header('key'));
    const findBlog = await Blog.findById(postId);
    if (user === null) {
      jsonResult = {
        responseCode: "0002",
        responseMessage: "user not found",
      }
      res.json(jsonResult);
    } else {
      if (findBlog.user_id !== user.userId) {
        jsonResult = {
          responseCode: "0003",
          responseMessage: "user deny",
        }
        res.json(jsonResult);
      } else {
        console.log("check::" + findBlog.user_id + "/" + user.userId);
        let blog = {
          postTitle: req.body.postTitle,
          postDetail: req.body.postDetail,
          user_id: user.userId
        }
        let updateBlog = null;
        if (blog && postId) {
          updateBlog = await sequelize.transaction(function (t) {
            return Blog.update(
              blog,
              { where: { postId: postId } },
              { transaction: t }
            );
          });
        }
        jsonResult = {
          responseCode: "0000",
          responseMessage: "update success",
        }
        res.json(jsonResult);
      }
    }
  } catch (err) {
    jsonResult = {
      responseCode: "0001",
      responseMessage: "update fail",
    }
    res.json(jsonResult);
  }
});

//delete blog with id
route.delete('/delete/:id', async (req, res, next) => {
  console.log('body::==', req.body);
  console.log('params::==', req.params);
  console.log('header::==', req.header('key'));
  try {
    let user = await User.findById(req.header('key'));
    const blogId = req.params.id;
    let blogDestroy = null;
    const blog = await Blog.findById(blogId);
    if (user === null) {
      jsonResult = {
        responseCode: "0002",
        responseMessage: "user not found",
      }
      res.json(jsonResult);
    } else {
      if (blog.user_id === user.userId) {
        if (blog) {
          blogDestroy = await blog.destroy();
        }
        jsonResult = {
          responseCode: "0000",
          responseMessage: "delete success",
        }
        res.json(jsonResult);
      } else {
        jsonResult = {
          responseCode: "0003",
          responseMessage: "user deny",
        }
        res.json(jsonResult);
      }
    }
  } catch (err) {
    jsonResult = {
      responseCode: "0001",
      responseMessage: "delete fail",
    }
    res.json(jsonResult);
  }
});

module.exports = route;