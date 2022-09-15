//data is an object whereas products is an array and each product is an object
const data = {
  products: [
    {
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
      name: 'IceCream',
      slug: 'icecream', //slug is what you see on URL
      category: 'Dairy Product',
      image: '/images/p2.jpg',
      price: 120,
      countInStock: 100,
      brand: 'df',
      rating: 4.5,
      numReviews: 10,
      description: 'very tasty ice cream',
    },
    {
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
      name: 'Litchi',
      slug: 'litchi', //slug is what you see on URL
      category: 'Fruits',
      image: '/images/p4.jpg',
      price: 120,
      countInStock: 100,
      brand: 'df',
      rating: 4.5,
      numReviews: 10,
      description: 'very juicy litchi',
    },
  ],
};

export default data;
