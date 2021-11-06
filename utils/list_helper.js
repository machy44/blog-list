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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
