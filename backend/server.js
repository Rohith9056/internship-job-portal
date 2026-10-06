const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');
const Admin = require('./models/Admin');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5001;

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'internship-portal-secret-key';


// ==========================================
// Verify Admin Token Middleware
// ==========================================
const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Access denied. Admin login required.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. Token missing.'
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired admin token.'
    });
  }
};


// ==========================================
// Home Route
// ==========================================
app.get('/', (req, res) => {
  res.send(
    'Internship & Job Listing Portal Backend is running!'
  );
});


// ==========================================
// Add Opportunity
// Admin Only
// ==========================================
app.post(
  '/api/opportunities',
  verifyAdminToken,
  async (req, res) => {
    try {
      const opportunity = new Opportunity(
        req.body
      );

      const savedOpportunity =
        await opportunity.save();

      res.status(201).json(
        savedOpportunity
      );
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Get All Opportunities
// Public
// ==========================================
app.get(
  '/api/opportunities',
  async (req, res) => {
    try {
      const opportunities =
        await Opportunity.find();

      res.json(opportunities);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Delete Opportunity
// Admin Only
// ==========================================
app.delete(
  '/api/opportunities/:id',
  verifyAdminToken,
  async (req, res) => {
    try {
      const deletedOpportunity =
        await Opportunity.findByIdAndDelete(
          req.params.id
        );

      if (!deletedOpportunity) {
        return res.status(404).json({
          message: 'Opportunity not found'
        });
      }

      res.json({
        message:
          'Opportunity deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Update Opportunity
// Admin Only
// ==========================================
app.put(
  '/api/opportunities/:id',
  verifyAdminToken,
  async (req, res) => {
    try {
      const updatedOpportunity =
        await Opportunity.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true
          }
        );

      if (!updatedOpportunity) {
        return res.status(404).json({
          message: 'Opportunity not found'
        });
      }

      res.json({
        message:
          'Opportunity updated successfully',
        opportunity: updatedOpportunity
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Submit Application
// Public
// ==========================================
app.post(
  '/api/applications',
  async (req, res) => {
    try {
      const application =
        new Application(req.body);

      const savedApplication =
        await application.save();

      res.status(201).json({
        message:
          'Application submitted successfully',
        application: savedApplication
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Get All Applications
// Admin Only
// ==========================================
app.get(
  '/api/applications',
  verifyAdminToken,
  async (req, res) => {
    try {
      const applications =
        await Application.find().populate(
          'opportunityId',
          'title'
        );

      res.json(applications);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Delete Application
// Admin Only
// ==========================================
app.delete(
  '/api/applications/:id',
  verifyAdminToken,
  async (req, res) => {
    try {
      const deletedApplication =
        await Application.findByIdAndDelete(
          req.params.id
        );

      if (!deletedApplication) {
        return res.status(404).json({
          message: 'Application not found'
        });
      }

      res.json({
        message:
          'Application deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Admin Login
// ==========================================
app.post(
  '/api/admin/login',
  async (req, res) => {
    try {
      const {
        username,
        password
      } = req.body;

      const admin =
        await Admin.findOne({
          username: username
        });

      if (!admin) {
        return res.status(401).json({
          message:
            'Invalid username or password'
        });
      }

      if (admin.password !== password) {
        return res.status(401).json({
          message:
            'Invalid username or password'
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          id: admin._id,
          username: admin.username
        },
        JWT_SECRET,
        {
          expiresIn: '2h'
        }
      );

      res.json({
        message: 'Login successful',

        token: token,

        admin: {
          username: admin.username
        }
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// Create Admin Account
// Temporary Route
// ==========================================
app.post(
  '/api/admin/create',
  async (req, res) => {
    try {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123'
      });

      const savedAdmin =
        await admin.save();

      res.status(201).json({
        message:
          'Admin account created successfully',
        admin: savedAdmin
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);


// ==========================================
// MongoDB Connection
// ==========================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(
      'MongoDB connected successfully'
    );

    app.listen(PORT, () => {
      console.log(
        `Server is running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      'MongoDB connection failed:',
      error.message
    );
  });