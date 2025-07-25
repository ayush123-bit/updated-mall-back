const products = [
  {
    "id": 1,
    "category": "Electronics",
    "categoryImage": "/Assets/images/electronics-category.jpg",
    "name": "Smartphone",
    "description": "Latest model smartphone with high-end features.",
    "price": 699.99,
    "image": "/Assets/products/electronics/smartphone.jpg",
    "stock": 50
  },
  {
    "id": 2,
    "category": "Electronics",
    "categoryImage": "/Assets/images/electronics-category.jpg",
    "name": "Laptop",
    "description": "Lightweight laptop with powerful performance.",
    "price": 1099.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 30
  },
  {
    "id": 3,
    "category": "Electronics",
    "categoryImage": "/Assets/images/electronics-category.jpg",
    "name": "Headphones",
    "description": "Noise-cancelling over-ear headphones.",
    "price": 199.99,
    "image": "/Assets/products/electronics/headphones.jpg",
    "stock": 100
  },
  {
    "id": 4,
    "category": "Electronics",
    "categoryImage": "/Assets/images/electronics-category.jpg",
    "name": "Smartwatch",
    "description": "Smartwatch with health tracking features.",
    "price": 249.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 70
  },
  {
    "id": 5,
    "category": "Electronics",
    "categoryImage": "/Assets/images/electronics-category.jpg",
    "name": "Tablet",
    "description": "Tablet with high-resolution display.",
    "price": 499.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 40
  },
  {
    "id": 6,
    "category": "Clothing",
    "categoryImage": "/Assets/images/clothing-category.jpg",
    "name": "T-Shirt",
    "description": "Comfortable cotton t-shirt.",
    "price": 19.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 200
  },
  {
    "id": 7,
    "category": "Clothing",
    "categoryImage": "/Assets/images/clothing-category.jpg",
    "name": "Jeans",
    "description": "Denim jeans with a relaxed fit.",
    "price": 49.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 150
  },
  {
    "id": 8,
    "category": "Clothing",
    "categoryImage": "/Assets/images/clothing-category.jpg",
    "name": "Jacket",
    "description": "Water-resistant jacket for all seasons.",
    "price": 89.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 60
  },
  {
    "id": 9,
    "category": "Clothing",
    "categoryImage": "/Assets/images/clothing-category.jpg",
    "name": "Sneakers",
    "description": "Comfortable sneakers for everyday wear.",
    "price": 59.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 120
  },
  {
    "id": 10,
    "category": "Clothing",
    "categoryImage": "/Assets/images/clothing-category.jpg",
    "name": "Dress",
    "description": "Stylish dress for special occasions.",
    "price": 79.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 80
  },
  {
    "id": 11,
    "category": "Home and Kitchen",
    "categoryImage": "/Assets/images/home-kitchen-category.jpg",
    "name": "Blender",
    "description": "High-speed blender for smoothies.",
    "price": 39.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 100
  },
  {
    "id": 12,
    "category": "Home and Kitchen",
    "categoryImage": "/Assets/images/home-kitchen-category.jpg",
    "name": "Coffee Maker",
    "description": "Automatic coffee maker with timer.",
    "price": 79.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 80
  },
  {
    "id": 13,
    "category": "Home and Kitchen",
    "categoryImage": "/Assets/images/home-kitchen-category.jpg",
    "name": "Vacuum Cleaner",
    "description": "Bagless vacuum cleaner with HEPA filter.",
    "price": 129.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 40
  },
  {
    "id": 14,
    "category": "Home and Kitchen",
    "categoryImage": "/Assets/images/home-kitchen-category.jpg",
    "name": "Cookware Set",
    "description": "Non-stick cookware set for everyday cooking.",
    "price": 99.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 70
  },
  {
    "id": 15,
    "category": "Home and Kitchen",
    "categoryImage": "/Assets/images/home-kitchen-category.jpg",
    "name": "Toaster",
    "description": "4-slice toaster with browning control.",
    "price": 29.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 150
  },
  {
    "id": 16,
    "category": "Books",
    "categoryImage": "/Assets/images/books-category.jpg",
    "name": "Mystery Novel",
    "description": "A thrilling mystery novel by a bestselling author.",
    "price": 14.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 100
  },
  {
    "id": 17,
    "category": "Books",
    "categoryImage": "/Assets/images/books-category.jpg",
    "name": "Science Fiction",
    "description": "A sci-fi adventure set in a dystopian future.",
    "price": 18.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 70
  },
  {
    "id": 18,
    "category": "Books",
    "categoryImage": "/Assets/images/books-category.jpg",
    "name": "Cookbook",
    "description": "Recipes for delicious homemade meals.",
    "price": 24.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 80
  },
  {
    "id": 19,
    "category": "Books",
    "categoryImage": "/Assets/images/books-category.jpg",
    "name": "Biography",
    "description": "An inspiring biography of a historical figure.",
    "price": 20.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 60
  },
  {
    "id": 20,
    "category": "Books",
    "categoryImage": "/Assets/images/books-category.jpg",
    "name": "Self-Help",
    "description": "A guide to personal growth and development.",
    "price": 16.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 120
  },
  {
    "id": 21,
    "category": "Beauty and Personal Care",
    "categoryImage": "/Assets/images/beauty-category.jpg",
    "name": "Face Cream",
    "description": "Moisturizing face cream with SPF.",
    "price": 25.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Using smartphone image
    "stock": 150
  },
  {
    "id": 22,
    "category": "Beauty and Personal Care",
    "categoryImage": "/Assets/images/beauty-category.jpg",
    "name": "Shampoo",
    "description": "Nourishing shampoo for all hair types.",
    "price": 15.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Using headphones image
    "stock": 200
  },
  {
    "id": 23,
    "category": "Beauty and Personal Care",
    "categoryImage": "/Assets/images/beauty-category.jpg",
    "name": "Lipstick",
    "description": "Long-lasting lipstick in various shades.",
    "price": 9.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Product-specific image
    "stock": 180
  },
  {
    "id": 24,
    "category": "Beauty and Personal Care",
    "categoryImage": "/Assets/images/beauty-category.jpg",  // Added category image
    "name": "Perfume",
    "description": "Fragrance with a refreshing scent.",
    "price": 49.99,
    "image": "/Assets/products/electronics/headphones.jpg",  // Product-specific image
    "stock": 90
  }
  /*{
    "id": 25,
    "category": "Beauty and Personal Care",
    "categoryImage": "/Assets/images/beauty-category.jpg",  // Added category image
    "name": "Body Lotion",
    "description": "Hydrating body lotion for soft skin.",
    "price": 12.99,
    "image": "/Assets/products/electronics/smartphone.jpg",  // Product-specific image
    "stock": 130
  }*/
];

module.exports = products;
