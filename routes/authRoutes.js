const express = require('express');
const User = require('../models/user');
const router = express.Router();

// GET Register Page
router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});

// POST Register User
router.post('/register', async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  console.log("Register request body:", req.body);

  try {
    // Check if email or phone already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'Email already in use' });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.render('auth/register', { error: 'Phone number already in use' });
    }

    const newUser = new User({ name, email, password, phone, role });
    await newUser.save();

    console.log("User registered:", newUser);
    res.redirect('/login');
  } catch (err) {
    console.error("Register error:", err);
    res.render('auth/register', { error: 'Something went wrong during registration' });
  }
});

// GET Login Page
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// POST Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", req.body);

  try {
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    req.session.user = user;

    if (user.role === 'buyer') {
      return res.redirect('/buyer/dashboard');
    } else if (user.role === 'seller') {
      return res.redirect('/seller/dashboard');
    } else {
      return res.render('auth/login', { error: 'Invalid user role' });
    }

  } catch (err) {
    console.error("Login error:", err);
    res.render('auth/login', { error: 'Something went wrong during login' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {  
    if (err) console.log("Logout error:", err);
    res.redirect('/');
  });
});

module.exports = router;

























// const express = require('express');
// const User = require('../models/User');
// const bcrypt = require('bcrypt');

// const router = express.Router();
// const { body, validationResult } = require('express-validator');
// bcrypt.hash('abhi123', 12).then(console.log);

// // Register Route (GET)
// router.get('/register', (req, res) => {
//   res.render('auth/register');
// });

// // Register Route (POST)
// router.post(
//   '/register',
//   // body('name').notEmpty().withMessage('Name is required'),
//   // body('email').isEmail().withMessage('Enter a valid email address'),
//   // body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//   // body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
//   // body('phone').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
//   // body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller'),

//   async (req, res) => {
//     // const errors = validationResult(req);
//     // if (!errors.isEmpty()) {
//     //   return res.render('auth/register', { errors: errors.array(), error: null });
//     // }
//     const { name, email, password, phone, role } = req.body;
// console.log("Requet body for register",req.body);
//     try {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.render('auth/register', { error: 'Email is already in use', errors: [] });
//       }

//       const existingPhone = await User.findOne({ phone });
//       if (existingPhone) {
//         return res.render('auth/register', { error: 'Phone number is already in use', errors: [] });
//       }

//       const hashedPassword = await bcrypt.hash(password, 12);

//       const newUser = new User({ name, email, password: hashedPassword, phone, role });
//       await newUser.save();

//       req.session.user = newUser;
//       console.log("mukesh register",req.session.user);

//       res.redirect('/login');
//     } catch (err) {
//       console.error(err);
//       res.render('auth/register', { error: 'Something went wrong, please try again', errors: [] });
//     }
//   }
// );

// // Login Route (GET)
// router.get('/login', (req, res) => {
//   res.render('auth/login', { errors: {}, email: '', error: null });
// });

// // Login Route (POST)
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log("POST login request body:", req.body);

//   const errors = {};
//   let hasErrors = false;

//   if (email.startsWith(' ')) {
//     errors.email = 'Email cannot start with a space';
//     hasErrors = true;
//   } else if (!/^[^\s@]+@gmail\.com$/.test(email)) {
//     errors.email = 'Email must follow the pattern: example@gmail.com';
//     hasErrors = true;
//   }

//   if (password.startsWith(' ')) {
//     errors.password = 'Password cannot start with a space';
//     hasErrors = true;
//   } else if (password.length < 6) {
//     errors.password = 'Password must be at least 6 characters long';
//     hasErrors = true;
//   }

//   if (hasErrors) {
//     console.log("Validation errors:", errors);
//     return res.render('auth/login', {
//       errors,
//       email,
//       error: null
//     });
//   }

//   try {
//     const user = await User.findOne({ email: email.trim() });
//     console.log("User found:", user);

//     if (!user) {
//       return res.render('auth/login', {
//         error: 'Invalid email or password',
//         errors: {},
//         email
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Password match:", isMatch);

//     if (!isMatch) {
//       return res.render('auth/login', {
//         error: 'Invalid email or password',
//         errors: {},
//         email
//       });
//     }

//     req.session.user = user;
//     console.log("Session set:", req.session.user);

//     if (user.role === 'buyer') {
//       return res.redirect('/buyer/dashboard');
//     } else if (user.role === 'seller') {
//       return res.redirect('/seller/dashboard');
//     } else {
//       return res.render('auth/login', {
//         error: 'Unexpected user role. Please contact support.',
//         errors: {},
//         email
//       });
//     }

//   } catch (err) {
//     console.error("Login error:", err);
//     res.render('auth/login', {
//       error: 'Something went wrong, please try again',
//       errors: {},
//       email
//     });
//   }
// });

// // Logout
// router.get('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) console.log(err);
//     res.redirect('/');
//   });
// });

// module.exports = router;