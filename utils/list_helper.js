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

const mostBlogs = (blogs) => {
  const collection = {};
  let largest = {};
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
  for (let element of Object.values(collection)) {
    if (!largest.blogs) {
      largest = element;
      continue;
    }
    if (element.blogs > largest.blogs) {
      largest = element;
    }
  }
  return largest;
};

const mostLikes = (blogs) => {
  const collection = {};
  let largest = {};
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

  console.log(collection);

  for (let element of Object.values(collection)) {
    if (!largest.likes) {
      largest = element;
      continue;
    }
    if (element.likes > largest.likes) {
      largest = element;
    }
  }
  return largest;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
