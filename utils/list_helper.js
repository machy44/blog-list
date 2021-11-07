const lodash = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (acc, blog) => {
    return acc + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const extractCertainKeysFromObject = (object, ...args) => {
  let newObject = {};
  args.forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
};

const favoriteBlog = (blogs) => {
  let favorite = blogs[0];

  for (let blog of blogs) {
    if (blog.likes > favorite.likes) favorite = blog;
  }
  return extractCertainKeysFromObject(favorite, 'title', 'author', 'likes');
};

const getLargest = (collection, key) => {
  let largest = {};
  for (let element of Object.values(collection)) {
    if (!largest[key]) {
      largest = element;
      continue;
    }
    if (element[key] > largest[key]) {
      largest = element;
    }
  }
  return largest;
};

const mostBlogs = (blogs) => {
  const collection = {};
  blogs.forEach((blog) => {
    if (!collection[blog.author]) {
      collection[blog.author] = {
        author: blog.author,
        blogs: 1,
      };
    } else {
      collection[blog.author] = {
        author: blog.author,
        blogs: collection[blog.author].blogs + 1,
      };
    }
  });

  return getLargest(collection, 'blogs');
};

const mostLikes = (blogs) => {
  const collection = {};
  blogs.forEach((blog) => {
    if (!collection[blog.author]) {
      collection[blog.author] = {
        author: blog.author,
        likes: blog.likes,
      };
    } else {
      collection[blog.author] = {
        author: blog.author,
        likes: collection[blog.author].likes + blog.likes,
      };
    }
  });

  return getLargest(collection, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
