import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration - Allow frontend to send credentials
const allowedOrigins = [
  'https://assignment-9-mehedi.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

// Cookie options - Remove domain for cross-origin cookies
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    // Root route
    app.get('/', (req, res) => {
      res.send('Pet Adoption Platform Server is running');
    });

    const db = client.db("petAdoptionDB");
    const petsCollection = db.collection("pets");
    const requestsCollection = db.collection("requests");

    // ==========================================
    // SEED DATABASE API (Public Helper)
    // ==========================================
    app.get('/api/seed', async (req, res) => {
      try {
        const count = await petsCollection.countDocuments();
        if (count > 0) {
          return res.send({ message: 'Database already has data. Seed skipped.', count });
        }

        const seedPets = [
          {
            name: "Bella",
            species: "Dog",
            breed: "Golden Retriever",
            age: 2,
            gender: "male",
            imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
            healthStatus: "Healthy & Active",
            vaccinationStatus: "Fully Vaccinated",
            location: "Seattle, WA",
            adoptionFee: 150,
            description: "Bella is a happy-go-lucky Golden Retriever who loves kids, other dogs, and playing fetch. She is fully crate-trained, potty-trained, and knows commands like sit, stay, and shake. Bella would make a perfect addition to any active family.",
            ownerEmail: "admin@fureverhome.org",
            status: "available",
            createdAt: new Date()
          },
          {
            name: "Luna",
            species: "Cat",
            breed: "Siamese",
            age: 1,
            gender: "female",
            imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
            healthStatus: "Healthy & Active",
            vaccinationStatus: "Fully Vaccinated",
            location: "Boston, MA",
            adoptionFee: 75,
            description: "Luna is a beautiful Siamese cat with stunning blue eyes. She is highly curious, talkative, and loves to cuddle up in your lap when you are working. She is litterbox trained, spayed, and has all vaccinations completed.",
            ownerEmail: "admin@fureverhome.org",
            status: "available",
            createdAt: new Date()
          },
          {
            name: "Charlie",
            species: "Dog",
            breed: "Beagle",
            age: 3,
            gender: "male",
            imageUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=600",
            healthStatus: "Healthy & Active",
            vaccinationStatus: "Fully Vaccinated",
            location: "Austin, TX",
            adoptionFee: 120,
            description: "Charlie is an energetic Beagle who loves tracking smells and going on long hikes. He gets along exceptionally well with cats and other dogs, and has a gentle temperament with children. Charlie is ready for a home with a fenced backyard.",
            ownerEmail: "admin@fureverhome.org",
            status: "available",
            createdAt: new Date()
          },
          {
            name: "Oliver",
            species: "Cat",
            breed: "Tabby",
            age: 1,
            gender: "male",
            imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600",
            healthStatus: "Healthy & Active",
            vaccinationStatus: "Fully Vaccinated",
            location: "Denver, CO",
            adoptionFee: 60,
            description: "Oliver is a sweet Tabby cat who was rescued as a stray. He is initially a bit shy but warms up quickly once he feels safe. He loves chasing laser pointers and enjoys treats. Oliver is fully microchipped and neutered.",
            ownerEmail: "admin@fureverhome.org",
            status: "available",
            createdAt: new Date()
          },
          {
            name: "Daisy",
            species: "Rabbit",
            breed: "Angora",
            age: 1,
            gender: "female",
            imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600",
            healthStatus: "Healthy & Active",
            vaccinationStatus: "Fully Vaccinated",
            location: "Chicago, IL",
            adoptionFee: 45,
            description: "Daisy is a fluffy Angora rabbit who is extremely gentle and loves eating fresh greens. She is litterbox trained and enjoys hopping around in safe, bunny-proofed rooms. She requires regular brushing to keep her beautiful coat clean.",
            ownerEmail: "admin@fureverhome.org",
            status: "available",
            createdAt: new Date()
          },
          {
            name: "Max",
            species: "Dog",
            breed: "German Shepherd",
            age: 4,
            gender: "male",
            imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=600",
            healthStatus: "Healthy & Active",
            vaccinationStatus: "Fully Vaccinated",
            location: "Miami, FL",
            adoptionFee: 180,
            description: "Max is a loyal, well-trained German Shepherd who is excellent for home protection and close companionship. He knows advanced commands, walks perfectly on a leash, and has high intelligence. Best suited for owners with large-dog experience.",
            ownerEmail: "admin@fureverhome.org",
            status: "available",
            createdAt: new Date()
          }
        ];

        const result = await petsCollection.insertMany(seedPets);
        res.send({ success: true, message: 'Database seeded successfully!', insertedCount: result.insertedCount });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // ==========================================
    // AUTHENTICATION APIs (JWT)
    // ==========================================

    // Generate token and set HttpOnly Cookie
    app.post('/api/jwt', async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).send({ message: 'Email is required' });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, cookieOptions).send({ success: true, message: 'Logged in successfully' });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Clear token cookie
    app.post('/api/logout', async (req, res) => {
      try {
        res.clearCookie('token', { ...cookieOptions, maxAge: 0 }).send({ success: true, message: 'Logged out successfully' });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // ==========================================
    // PETS COLLECTION APIs (CRUD)
    // ==========================================

    // Public: Browse all pets with Search, Filter, Sort
    app.get('/api/pets', async (req, res) => {
      try {
        const { search, species, sortBy } = req.query;
        let query = {};

        // Search by pet name (case-insensitive regex)
        if (search) {
          query.name = { $regex: search, $options: 'i' };
        }

        // Filter by species (supports multiple species as comma-separated or array)
        if (species) {
          const speciesList = Array.isArray(species)
            ? species
            : species.split(',').map(s => s.trim());
          if (speciesList.length > 0) {
            query.species = { $in: speciesList };
          }
        }

        // Fetch cursor
        let cursor = petsCollection.find(query);

        // Sorting options
        if (sortBy) {
          if (sortBy === 'fee-asc') {
            cursor = cursor.sort({ adoptionFee: 1 });
          } else if (sortBy === 'fee-desc') {
            cursor = cursor.sort({ adoptionFee: -1 });
          } else if (sortBy === 'age-asc') {
            cursor = cursor.sort({ age: 1 });
          } else if (sortBy === 'age-desc') {
            cursor = cursor.sort({ age: -1 });
          } else if (sortBy === 'latest') {
            cursor = cursor.sort({ createdAt: -1 });
          }
        } else {
          // Default sorting: latest added
          cursor = cursor.sort({ createdAt: -1 });
        }

        const pets = await cursor.toArray();
        res.send(pets);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Public: View single pet details
    app.get('/api/pets/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const pet = await petsCollection.findOne(query);
        if (!pet) {
          return res.status(404).send({ message: 'Pet not found' });
        }
        res.send(pet);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Create pet listing
    app.post('/api/pets', verifyToken, async (req, res) => {
      try {
        const petData = req.body;
        // Make sure owner email is filled correctly from token
        petData.ownerEmail = req.user.email;
        petData.status = 'available';
        petData.createdAt = new Date();
        // Parse adoptionFee and age to numbers if possible
        if (petData.adoptionFee !== undefined) petData.adoptionFee = Number(petData.adoptionFee);
        if (petData.age !== undefined) petData.age = Number(petData.age);

        const result = await petsCollection.insertOne(petData);
        res.status(201).send({ success: true, insertedId: result.insertedId });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Update pet listing (only owner)
    app.put('/api/pets/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const petData = req.body;
        const query = { _id: new ObjectId(id) };

        // Verify ownership
        const existingPet = await petsCollection.findOne(query);
        if (!existingPet) {
          return res.status(404).send({ message: 'Pet not found' });
        }
        if (existingPet.ownerEmail !== req.user.email) {
          return res.status(403).send({ message: 'Unauthorized: You do not own this pet listing' });
        }

        // Prepare updates
        const { _id, ownerEmail, createdAt, status, ...updatedFields } = petData;
        if (updatedFields.adoptionFee !== undefined) updatedFields.adoptionFee = Number(updatedFields.adoptionFee);
        if (updatedFields.age !== undefined) updatedFields.age = Number(updatedFields.age);

        const updateDoc = {
          $set: updatedFields
        };

        const result = await petsCollection.updateOne(query, updateDoc);
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Delete pet listing (only owner)
    app.delete('/api/pets/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        // Verify ownership
        const existingPet = await petsCollection.findOne(query);
        if (!existingPet) {
          return res.status(404).send({ message: 'Pet not found' });
        }
        if (existingPet.ownerEmail !== req.user.email) {
          return res.status(403).send({ message: 'Unauthorized: You do not own this pet listing' });
        }

        // Delete pet and clean up all requests associated with it
        const petResult = await petsCollection.deleteOne(query);
        await requestsCollection.deleteMany({ petId: id });

        res.send({ success: true, deletedCount: petResult.deletedCount });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Get owner listings
    app.get('/api/my-listings', verifyToken, async (req, res) => {
      try {
        const query = { ownerEmail: req.user.email };
        const myPets = await petsCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.send(myPets);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Get owner listings stats
    app.get('/api/my-listings/stats', verifyToken, async (req, res) => {
      try {
        const email = req.user.email;
        const pipeline = [
          { $match: { ownerEmail: email } },
          {
            $group: {
              _id: null,
              totalListings: { $sum: 1 },
              availablePets: {
                $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] }
              },
              adoptedPets: {
                $sum: { $cond: [{ $eq: ["$status", "adopted"] }, 1, 0] }
              }
            }
          }
        ];

        const statsResult = await petsCollection.aggregate(pipeline).toArray();
        const stats = statsResult[0] || { totalListings: 0, availablePets: 0, adoptedPets: 0 };
        res.send(stats);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });


    // ==========================================
    // ADOPTION REQUESTS APIs
    // ==========================================

    // Private: Submit adoption request
    app.post('/api/requests', verifyToken, async (req, res) => {
      try {
        const requestData = req.body;
        const { petId, pickupDate, message } = requestData;

        if (!petId || !pickupDate) {
          return res.status(400).send({ message: 'Pet ID and Pickup Date are required' });
        }

        // Fetch the pet to verify it exists and check status & owner
        const pet = await petsCollection.findOne({ _id: new ObjectId(petId) });
        if (!pet) {
          return res.status(404).send({ message: 'Pet not found' });
        }

        if (pet.status === 'adopted') {
          return res.status(400).send({ message: 'This pet has already been adopted' });
        }

        if (pet.ownerEmail === req.user.email) {
          return res.status(400).send({ message: 'You cannot submit an adoption request for your own pet' });
        }

        // Check if this user already has a pending or approved request for this pet
        const existingRequest = await requestsCollection.findOne({
          petId: petId,
          userEmail: req.user.email,
          status: { $in: ['pending', 'approved'] }
        });

        if (existingRequest) {
          return res.status(400).send({ message: 'You already have an active request for this pet' });
        }

        // Create the adoption request
        const newRequest = {
          petId: petId,
          petName: pet.name,
          petImage: pet.imageUrl,
          adoptionFee: pet.adoptionFee,
          userName: requestData.userName,
          userEmail: req.user.email,
          pickupDate: pickupDate,
          message: message || '',
          status: 'pending',
          createdAt: new Date()
        };

        const result = await requestsCollection.insertOne(newRequest);
        res.status(201).send({ success: true, insertedId: result.insertedId });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Get adoption requests submitted by logged-in user
    app.get('/api/my-requests', verifyToken, async (req, res) => {
      try {
        const query = { userEmail: req.user.email };
        const requests = await requestsCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.send(requests);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Get adoption requests for a specific pet (only pet owner)
    app.get('/api/requests/pet/:petId', verifyToken, async (req, res) => {
      try {
        const petId = req.params.petId;

        // Verify the logged-in user owns the pet
        const pet = await petsCollection.findOne({ _id: new ObjectId(petId) });
        if (!pet) {
          return res.status(404).send({ message: 'Pet not found' });
        }
        if (pet.ownerEmail !== req.user.email) {
          return res.status(403).send({ message: 'Unauthorized: You do not own this pet listing' });
        }

        const requests = await requestsCollection.find({ petId: petId }).toArray();
        res.send(requests);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Update adoption request status (approve/reject) - (only pet owner)
    app.put('/api/requests/:id', verifyToken, async (req, res) => {
      try {
        const requestId = req.params.id;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
          return res.status(400).send({ message: 'Invalid status value' });
        }

        // Fetch request
        const request = await requestsCollection.findOne({ _id: new ObjectId(requestId) });
        if (!request) {
          return res.status(404).send({ message: 'Request not found' });
        }

        // Fetch the pet to verify ownership
        const pet = await petsCollection.findOne({ _id: new ObjectId(request.petId) });
        if (!pet) {
          return res.status(404).send({ message: 'Associated pet not found' });
        }

        if (pet.ownerEmail !== req.user.email) {
          return res.status(403).send({ message: 'Unauthorized: You do not own this pet listing' });
        }

        if (request.status !== 'pending') {
          return res.status(400).send({ message: 'This request has already been processed' });
        }

        if (status === 'approved') {
          // 1. Mark pet as adopted
          await petsCollection.updateOne(
            { _id: new ObjectId(request.petId) },
            { $set: { status: 'adopted' } }
          );

          // 2. Approve this request
          await requestsCollection.updateOne(
            { _id: new ObjectId(requestId) },
            { $set: { status: 'approved' } }
          );

          // 3. Reject all other pending requests for this pet
          await requestsCollection.updateMany(
            {
              petId: request.petId,
              _id: { $ne: new ObjectId(requestId) },
              status: 'pending'
            },
            { $set: { status: 'rejected' } }
          );

          res.send({ success: true, message: 'Request approved and pet marked as adopted' });
        } else {
          // Reject this request
          await requestsCollection.updateOne(
            { _id: new ObjectId(requestId) },
            { $set: { status: 'rejected' } }
          );
          res.send({ success: true, message: 'Request rejected' });
        }
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Private: Cancel adoption request (only petitioner)
    app.delete('/api/requests/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        // Fetch request
        const request = await requestsCollection.findOne(query);
        if (!request) {
          return res.status(404).send({ message: 'Request not found' });
        }

        // Verify requestor
        if (request.userEmail !== req.user.email) {
          return res.status(403).send({ message: 'Unauthorized: You did not make this request' });
        }

        if (request.status !== 'pending') {
          return res.status(400).send({ message: 'Cannot cancel a request that has already been approved or rejected' });
        }

        const result = await requestsCollection.deleteOne(query);
        res.send({ success: true, deletedCount: result.deletedCount });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    });

    // Start checking connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  
}
run().catch(console.dir);



// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
