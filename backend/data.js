import bcrypt from 'bcryptjs';

//data is an object whereas products is an array and each product is an object
const data = {
  users: [
    {
      name: 'karan',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'), //bcrypt is used for encryption
      isAdmin: true,
    },
    {
      name: 'darsh',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
    {
      name: 'random',
      email: 'random@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1', //will be assigned by mongoDB
      name: 'Milk',
      slug: 'milk', //slug is what you see on URL
      category: 'Dairy Product',
      image: '/images/p1.jpg',
      price: 60,
      countInStock: 1000,
      brand: 'df',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality and healthy milk',
    },
    {
      //_id: '2',
      name: 'IceCream',
      slug: 'icecream', //slug is what you see on URL
      category: 'Dairy Product',
      image: '/images/p2.jpg',
      price: 120,
      countInStock: 0,
      brand: 'df',
      rating: 5.0,
      numReviews: 10,
      description: 'very tasty ice cream',
    },
    {
      //_id: '3',
      name: 'Mango',
      slug: 'mango', //slug is what you see on URL
      category: 'Fruits',
      image: '/images/p3.jpg',
      price: 100,
      countInStock: 100,
      brand: 'df',
      rating: 4.5,
      numReviews: 10,
      description: 'very tasty mangos',
    },
    {
      // _id: '4',
      name: 'Litchi',
      slug: 'litchi', //slug is what you see on URL
      category: 'Fruits',
      image: '/images/p4.jpg',
      price: 120,
      countInStock: 100,
      brand: 'df',
      rating: 5.0,
      numReviews: 10,
      description: 'very juicy litchi',
    },
  ],
};

export default data;
