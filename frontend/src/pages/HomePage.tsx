import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Smartphone X',
      description: 'The latest in smartphone technology with an incredible camera.',
      price: '$799.99',
      image: 'https://www.phoneplacekenya.com/wp-content/uploads/2023/02/Samsung-Galaxy-S24-Ultra-a.jpg',
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      description: 'High-quality sound with noise cancellation features.',
      price: '$79.99',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6HF4a7eN03KfxYKgrfMbzDI0gtEaujHUOdA&s',
    },
    {
      id: 3,
      name: '4K Ultra HD TV',
      description: 'Experience stunning visuals with our new 4K TV.',
      price: '$1,299.99',
      image: 'https://images.samsung.com/is/image/samsung/latin_en-uhd-ju7500-un65ju7500fxzp-001-front-black?$650_519_PNG$',
    },
    {
      id: 4,
      name: 'Smartwatch Pro',
      description: 'Track your fitness and stay connected with our smart watch.',
      price: '$470.99',
      image: 'https://i.ebayimg.com/images/g/6EQAAOSwjyRgMrpQ/s-l500.jpg',
    },
    {
      id: 5,
      name: 'Recliner Chair',
      description: 'Good rest for your back after a long day.',
      price: '$2000.99',
      image: 'https://static.wixstatic.com/media/5bcfac_301f9e1d606b4274b7c57c8c85fd48f8~mv2.jpeg/v1/fill/w_720,h_720,al_c,q_85,enc_auto/5bcfac_301f9e1d606b4274b7c57c8c85fd48f8~mv2.jpeg',
    },
    {
      id: 6,
      name: 'Bluetooth Speaker',
      description: 'Portable and powerful sound for any occasion.',
      price: '$129.99',
      image: 'https://www.cnet.com/a/img/resize/f99620b7f9e47fb88050619fe29c9eafdf124e6d/hub/2022/03/08/5f292541-b5cf-4abf-82e3-cf160837b769/tribit-xsound-mega-white-background.jpg?auto=webp&fit=crop&height=576&width=768',
    },
    {
      id: 7,
      name: 'Digital Camera',
      description: 'Capture moments in stunning detail with our digital camera.',
      price: '$599.99',
      image: 'https://i.pcmag.com/imagery/roundups/018cwxjHcVMwiaDIpTnZJ8H-22..v1570842461.jpg',
    },
    {
      id: 8,
      name: 'Charcoal Grill',
      description: 'The best for barbeque and highly user friendly, tested and reviewed.',
      price: '$2089.99',
      image: 'https://www.seriouseats.com/thmb/BRxMb-qVbplX18Bo7Js5WCMyxCo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Web_4000-sea-primary-plate-charcoal-grills-rkilgore-0897-f850a8d3df67478c9b531867368f8d9c.jpg',
    },
  ];

  return (
    <div className=" min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <motion.header
        className="w-full bg-blue-600 text-white py-20 flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to ShopSmart!</h1>
        <p className="text-xl mb-6">Discover the best deals and latest trends in fashion, electronics, and more.</p>
        <Link to="/products">
          <motion.button
            className="bg-white text-blue-600 py-2 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition"
            whileHover={{ scale: 1.05 }}
          >
            Shop Now
          </motion.button>
        </Link>
      </motion.header>

      {/* Featured Products */}
      <section className="w-full max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold mb-6 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * product.id }}
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-blue-600 font-semibold">{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <motion.section
        className="w-full bg-blue-600 text-white py-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold mb-4">Stay Updated!</h2>
        <p className="text-xl mb-6">Sign up for our newsletter to receive the latest updates and exclusive offers.</p>
        <form className="flex flex-col sm:flex-row items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-lg mb-4 sm:mb-0 sm:mr-4 w-full sm:w-64"
          />
          <motion.button
            type="submit"
            className="bg-white text-blue-600 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition"
            whileHover={{ scale: 1.05 }}
          >
            Subscribe
          </motion.button>
        </form>
      </motion.section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 ShopSmart. All rights reserved.</p>
        <p>
          <h3 className="text-blue-400 hover:underline">Privacy Policy</h3> |{' '}
          <h3 className="text-blue-400 hover:underline">Terms of Service</h3>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
