require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const sequelize = require('./db');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const analyticsRoutes = require('./routes/analytics');
const enquiryRoutes = require('./routes/enquiry');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');

const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Public routes
app.use('/api', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', enquiryRoutes);
app.use('/api', notificationRoutes);
app.use('/api', uploadRoutes);

// Protected blog/service/product admin routes
app.use('/api', blogRoutes);
app.use('/api', serviceRoutes);
app.use('/api', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');
    await sequelize.sync({ alter: true });
    console.log('Database tables synced');
    await seedData();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

async function seedData() {
  const User = require('./models/User');
  const Service = require('./models/Service');
  const Product = require('./models/Product');
  const Blog = require('./models/Blog');
  // Ensure Notification table is created
  require('./models/Notification');

  // Seed admin user
  const existingAdmin = await User.findOne({ where: { email: 'admin@uniqueaircon.com' } });
  if (!existingAdmin) {
    await User.create({
      email: 'admin@uniqueaircon.com',
      password: 'Admin@123',
      role: 'admin'
    });
    console.log('Admin user seeded');
  } else {
    const passwordValid = await existingAdmin.comparePassword('Admin@123');
    if (!passwordValid) {
      existingAdmin.password = 'Admin@123';
      await existingAdmin.save();
      console.log('Admin user credentials updated');
    }
  }

  // Seed services
  const servicesCount = await Service.count();
  if (servicesCount === 0) {
    await Service.bulkCreate([
      {
        title: 'AC Repair & Maintenance',
        slug: 'ac-repair-maintenance',
        shortDescription: 'Professional AC repair and maintenance services for all brands.',
        description: 'Our expert technicians provide comprehensive AC repair and maintenance services for all major brands. We diagnose and fix all types of AC issues including cooling problems, strange noises, water leaks, and electrical faults. Regular maintenance extends the life of your AC unit and ensures optimal performance.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
        metaTitle: 'AC Repair & Maintenance Services | Unique Air Conditioning',
        metaDescription: 'Professional AC repair and maintenance for all brands. Fast, reliable service.',
        order: 1,
        published: true
      },
      {
        title: 'AC Installation',
        slug: 'ac-installation',
        shortDescription: 'Expert installation of split, window, and central AC units.',
        description: 'We provide professional AC installation services for all types of air conditioning units including split ACs, window ACs, and central air conditioning systems. Our certified technicians ensure proper installation following all safety guidelines and manufacturer specifications.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        metaTitle: 'AC Installation Services | Unique Air Conditioning',
        metaDescription: 'Expert AC installation for split, window, and central units.',
        order: 2,
        published: true
      },
      {
        title: 'Gas Refilling',
        slug: 'gas-refilling',
        shortDescription: 'Refrigerant gas refilling and leak detection services.',
        description: 'Low refrigerant levels can significantly reduce your AC\'s cooling efficiency. Our technicians perform accurate refrigerant level checks, detect leaks, repair them, and refill the gas to optimal levels. We handle all types of refrigerants including R-22, R-32, and R-410A.',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?w=800',
        metaTitle: 'AC Gas Refilling Services | Unique Air Conditioning',
        metaDescription: 'Professional refrigerant gas refilling and leak detection.',
        order: 3,
        published: true
      },
      {
        title: 'Annual Maintenance Contract (AMC)',
        slug: 'annual-maintenance-contract',
        shortDescription: 'Comprehensive yearly maintenance packages for peace of mind.',
        description: 'Our Annual Maintenance Contract (AMC) provides comprehensive year-round care for your AC units. Includes scheduled maintenance visits, priority service, discounted repairs, and 24/7 support. Perfect for homes and businesses that want to ensure their AC systems run efficiently all year long.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        metaTitle: 'AC Annual Maintenance Contract | Unique Air Conditioning',
        metaDescription: 'Comprehensive AMC packages for homes and businesses.',
        order: 4,
        published: true
      },
      {
        title: 'Commercial Refrigeration',
        slug: 'commercial-refrigeration',
        shortDescription: 'Commercial refrigeration setup and maintenance services.',
        description: 'We provide complete commercial refrigeration solutions for restaurants, supermarkets, cold storage facilities, and other businesses. Our services include installation, maintenance, and repair of commercial refrigeration systems, walk-in coolers, freezers, and display cases.',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        metaTitle: 'Commercial Refrigeration Services | Unique Air Conditioning',
        metaDescription: 'Complete commercial refrigeration solutions and maintenance.',
        order: 5,
        published: true
      }
    ]);
    console.log('Services seeded');
  }

  // Seed products
  const productsCount = await Product.count();
  if (productsCount === 0) {
    await Product.bulkCreate([
      {
        title: 'AC Filter Replacement Kit',
        slug: 'ac-filter-replacement-kit',
        shortDescription: 'High-quality replacement filters for all major AC brands.',
        description: 'Keep your AC running efficiently with our premium filter replacement kit. Compatible with most major AC brands including LG, Samsung, Daikin, Voltas, and more. Regular filter replacement improves air quality and AC efficiency.',
        price: '₹499',
        category: 'Filters',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
        published: true
      },
      {
        title: 'Refrigerant Gas R-32',
        slug: 'refrigerant-gas-r32',
        shortDescription: 'Eco-friendly R-32 refrigerant gas cylinder for modern ACs.',
        description: 'R-32 is an eco-friendly refrigerant used in modern inverter ACs. It has a lower global warming potential (GWP) than older refrigerants. Our R-32 cylinders are certified and tested for purity and quality.',
        price: '₹2,499',
        category: 'Refrigerants',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800',
        published: true
      },
      {
        title: 'Capacitor Set',
        slug: 'capacitor-set',
        shortDescription: 'Starter and run capacitors for AC compressors.',
        description: 'High-quality capacitor set for AC units. Includes both start and run capacitors compatible with various AC models. Capacitors are essential for starting and running the AC compressor and fan motors efficiently.',
        price: '₹349',
        category: 'Electrical',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        published: true
      },
      {
        title: 'Thermostat Controller',
        slug: 'thermostat-controller',
        shortDescription: 'Digital programmable thermostat controller for smart temperature control.',
        description: 'Smart digital thermostat controller with programmable schedules, remote access, and energy-saving modes. Compatible with most split AC systems. Features include weekly scheduling, temperature display, and energy consumption tracking.',
        price: '₹1,899',
        category: 'Controls',
        image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800',
        published: true
      },
      {
        title: 'Copper Pipe Set',
        slug: 'copper-pipe-set',
        shortDescription: 'Premium copper pipes for AC installation.',
        description: 'High-quality copper pipes for AC installation. Comes in a set with insulation material. Available in various lengths suitable for most residential and commercial AC installations. Ensures optimal refrigerant flow and system efficiency.',
        price: '₹1,299',
        category: 'Installation',
        image: 'https://images.unsplash.com/photo-1558618047-3c8e4ae3e87b?w=800',
        published: true
      }
    ]);
    console.log('Products seeded');
  }

  // Seed blog posts
  const blogsCount = await Blog.count();
  if (blogsCount === 0) {
    await Blog.bulkCreate([
      {
        title: 'How to Maintain Your AC for Peak Performance',
        slug: 'how-to-maintain-your-ac-for-peak-performance',
        excerpt: 'Regular AC maintenance is key to ensuring your unit runs efficiently and lasts longer. Here are the top tips from our experts.',
        content: `<h2>Why Regular AC Maintenance Matters</h2>
<p>Your air conditioner works hard to keep you comfortable during hot summer months. Without regular maintenance, it can lose up to 5% efficiency per year, leading to higher electricity bills and potential breakdowns.</p>
<h2>Essential AC Maintenance Tips</h2>
<h3>1. Clean or Replace Air Filters Monthly</h3>
<p>Dirty filters are the most common cause of AC problems. Clean or replace your filters every 30 days during heavy use periods. A clogged filter restricts airflow, forcing your AC to work harder.</p>
<h3>2. Clean the Condenser Coils</h3>
<p>The outdoor condenser unit collects dirt and debris over time. Clean the fins and coils annually to maintain heat transfer efficiency.</p>
<h3>3. Check and Clean the Drain Line</h3>
<p>A clogged drain line can cause water leaks and humidity problems. Pour a cup of bleach solution down the drain line monthly to prevent algae growth.</p>
<h3>4. Inspect Electrical Connections</h3>
<p>Loose electrical connections can be dangerous and cause your AC to fail. Have a professional check and tighten all connections annually.</p>
<h3>5. Schedule Professional Service Annually</h3>
<p>Even with regular DIY maintenance, your AC needs professional service once a year. A technician can check refrigerant levels, test system controls, and identify potential issues before they become expensive repairs.</p>
<h2>When to Call a Professional</h2>
<p>Contact Unique Air Conditioning if you notice: unusual noises, reduced cooling, water leaks, or unusually high electricity bills. Our technicians are available 7 days a week for all your AC maintenance needs.</p>`,
        tags: ['maintenance', 'tips', 'AC care'],
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
        metaTitle: 'How to Maintain Your AC for Peak Performance | Unique Air Conditioning',
        metaDescription: 'Expert tips on AC maintenance to improve efficiency and extend the life of your air conditioner.',
        published: true
      },
      {
        title: 'Signs Your AC Needs a Refrigerant Refill',
        slug: 'signs-your-ac-needs-refrigerant-refill',
        excerpt: 'Is your AC not cooling as well as it used to? Low refrigerant might be the culprit. Learn the warning signs and what to do.',
        content: `<h2>Understanding AC Refrigerant</h2>
<p>Refrigerant is the lifeblood of your air conditioning system. It's the substance that absorbs heat from inside your home and releases it outside. Unlike fuel, refrigerant doesn't get "used up" in normal operation — it circulates in a closed loop. If your AC is low on refrigerant, it means there's a leak somewhere in the system.</p>
<h2>Warning Signs of Low Refrigerant</h2>
<h3>1. Warm Air from Vents</h3>
<p>The most obvious sign — if your AC is blowing warm or lukewarm air despite being set to cool, low refrigerant could be the cause.</p>
<h3>2. Ice on the Refrigerant Lines</h3>
<p>Paradoxically, low refrigerant causes ice to form on the copper lines and evaporator coil. If you see frost or ice buildup, turn off your AC immediately and call a technician.</p>
<h3>3. Hissing or Bubbling Sounds</h3>
<p>A refrigerant leak often produces hissing (gas leak) or bubbling (liquid leak) sounds from the indoor or outdoor unit.</p>
<h3>4. Higher Electricity Bills</h3>
<p>When refrigerant is low, your AC runs longer cycles trying to reach the set temperature, consuming more electricity.</p>
<h3>5. AC Takes Too Long to Cool</h3>
<p>If your room takes significantly longer to cool than usual, reduced refrigerant levels could be affecting your AC's cooling capacity.</p>
<h2>What to Do Next</h2>
<p>Never attempt to add refrigerant yourself — it requires specialized equipment and certification. Contact Unique Air Conditioning for professional leak detection, repair, and refrigerant refilling. We handle all types including R-22, R-32, and R-410A.</p>`,
        tags: ['refrigerant', 'gas refill', 'AC problems'],
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?w=1200',
        metaTitle: 'Signs Your AC Needs a Refrigerant Refill | Unique Air Conditioning',
        metaDescription: 'Recognize the warning signs of low AC refrigerant and learn when to call a professional.',
        published: true
      },
      {
        title: 'Choosing the Right AC for Your Home',
        slug: 'choosing-the-right-ac-for-your-home',
        excerpt: 'Buying a new AC? With so many options available, making the right choice can be overwhelming. This guide will help you decide.',
        content: `<h2>Factors to Consider When Buying an AC</h2>
<p>Choosing the right air conditioner for your home involves several important factors. Getting this decision right can save you money on electricity and ensure your comfort for years to come.</p>
<h2>1. Calculate the Right Capacity (Tonnage)</h2>
<p>AC capacity is measured in tons (TR). As a general rule:</p>
<ul>
<li>Up to 120 sq ft room: 0.75 ton</li>
<li>120-180 sq ft: 1 ton</li>
<li>180-240 sq ft: 1.5 ton</li>
<li>240-300 sq ft: 2 ton</li>
</ul>
<p>Also consider ceiling height, sunlight exposure, and number of occupants.</p>
<h2>2. Inverter vs. Non-Inverter</h2>
<p>Inverter ACs adjust compressor speed based on cooling needs, making them 30-50% more energy efficient than non-inverter models. While they cost more upfront, they save money in the long run through lower electricity bills.</p>
<h2>3. Star Rating (Energy Efficiency)</h2>
<p>Look for a 5-star BEE rating for maximum energy efficiency. Higher star ratings mean lower electricity consumption and operating costs.</p>
<h2>4. Type of AC</h2>
<p><strong>Split ACs</strong> are most popular for residential use — quiet, efficient, and aesthetically pleasing. <strong>Window ACs</strong> are affordable and suitable for smaller rooms. <strong>Cassette ACs</strong> are ideal for commercial spaces with false ceilings.</p>
<h2>5. Additional Features</h2>
<p>Look for features like WiFi connectivity, air purification, auto-cleaning, and sleep modes. These add convenience and can improve air quality.</p>
<h2>Our Recommendation</h2>
<p>For most Indian homes, a 5-star inverter split AC from reputable brands like Daikin, Mitsubishi, LG, or Voltas offers the best balance of performance, efficiency, and reliability. Contact Unique Air Conditioning for expert advice and professional installation.</p>`,
        tags: ['buying guide', 'AC selection', 'tips'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        metaTitle: 'Choosing the Right AC for Your Home | Unique Air Conditioning',
        metaDescription: 'Complete guide to selecting the perfect air conditioner for your home based on room size, budget, and features.',
        published: true
      }
    ]);
    console.log('Blog posts seeded');
  }
}

startServer();

