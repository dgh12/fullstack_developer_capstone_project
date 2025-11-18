const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));
const car_data = JSON.parse(fs.readFileSync("data/car_records.json", 'utf8'));

const mongo_db = async function() {
  await mongoose.connect("mongodb://127.0.0.1:27017/",{'dbName':'dealershipsDB'}).catch(error => handleError(error));
  console.log("Connected to MongoDB");
}

try {
  mongo_db();
} catch (error) {
  console.log("Error: ", error);
}

const Reviews = require('./review');
const Cars = require('./inventory');
const Dealerships = require('./dealership');
const { error } = require('console');

try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data.reviews);
  });
  Cars.deleteMany({}).then(()=>{
    Cars.insertMany(car_data.cars);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data.dealerships);
  }); 
} catch (error) {
  console.log("Error: ", error);
  res.status(500).json({ error: 'Error fetching documents' });
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
//Write your code here
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
//Write your code here
  try {
    const documents = await Dealerships.find({state: req.params.state});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
//Write your code here
  try {
    const documents = await Dealerships.find({id: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  data = JSON.parse(req.body);
  const documents = await Reviews.find().sort( { id: -1 } );
  let new_id = documents[0].id+1;
  console.log(data);

  const review = new Reviews({
		"id": new_id,
		"name": data.name,
		"dealership": data.dealership,
		"review": data.review,
		"purchase": data.purchase,
		"purchase_date": data.purchase_date,
		"car_make": data.car_make,
		"car_model": data.car_model,
		"car_year": data.car_year,
	});
  console.log(review._id + "\n" + review);
  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ error: `Error inserting review \n ${error}` });
  }
});

app.get('/fetchCars/:id', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchCars/make/:id/:make', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id,
      make: req.params.make});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents no such make' });
  }
});

app.get('/fetchCars/model/:id/:model', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id,
      model: req.params.model});
      console.log(documents);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents no such model' });
  }
});

app.get('/fetchCars/milage/:id/:milage', async (req, res) => {
  try {
    let milage = parseInt(req.params.milage); 
    let documents = [];
    let minmilage = 0;
    if (milage > 20000) {
      minmilage = 20000;
    } else {
      minmilage = milage - 5000;
    }
    console.log({"milage": milage});
    console.log({"minmilage": minmilage});
    const Res = await Cars.find({dealer_id: req.params.id});
    for (item in Res) {;
      num = parseInt(Res[item]["mileage"]);
      if (num >= minmilage ) {
        if (milage > 20000) {
            documents.push(Res[item]);
            console.log(Res[item]);
        }
        if (milage > num) {
          documents.push(Res[item]);
          console.log(Res[item]);
        }
      }
    }
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: `error fetching documents\n ${error}` });
  }
});

app.get('/fetchCars/price/:id/:price', async (req, res) => {
  try {
    let price = parseInt(req.params.price); 
    let documents = [];
    let minprice = 0;
    if (price > 80000) {
      minprice = 80000;navbar-nav
    } else {
      minprice = price - 20000;
    }
    console.log({"price": price});
    console.log({"minprice": minprice});
    const Res = await Cars.find({dealer_id: req.params.id});
    for (item in Res) {
      num = parseInt(Res[item]["price"]);
      if (minprice <= num) {
        if (price > 80000) { 
            documents.push(Res[item]);
            console.log(Res[item]);
        }
        if (price > num) {
          documents.push(Res[item]);
          console.log(Res[item]);
        }
      }
    }
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchCars/:id/:year', async (req, res) => {
  try {
    let document = {};
    documents = [];
    const Res = await Cars.find({dealer_id: req.params.id});
    for (item in Res) {
      if (Res[item]["year"] >= req.params.year) {
        document[item] = Res[item];
      }
    }
    for (key in document) {
      documents.push(document[key]);
    }
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: `Error fetching documents \n ${error}` });
  } 
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
