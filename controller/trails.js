const express = require("express");
const req = require("express/lib/request");
const methodOverride = require("method-override");
const apiKey = process.env.GOOGLEAPIKEY;

const router = express.Router();

// middleware / possibly put in another file
router.use(express.urlencoded({ extended: false })); // req.body || extended: false - does not allow nested objects in query strings
router.use(express.json()); // returns middleware that only parses JSON - may or may not need it depending on your project
router.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form

// Models
const Trail = require("../models/trailsSchema.js");
const trailSeed = require("../models/trailsSeed.js");

const State = require("../models/stateSchema.js");
const stateSeed = require("../models/stateSeed.js");

// parsing functions
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // only used for security, ddos attack on server
};

// Edit
// GET /:id/edit
router.get("/:id/edit", (req, res) => {
  Trail.findById(req.params.id, (err, foundTrail) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("edit.ejs", {
        trails: foundTrail,
      });
    }
  });
});

// Update
// PUT /:id
router.put("/:id", (req, res) => {
  Trail.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedTrail) => {
      if (err) {
        console.log(err.message);
      } else {
        res.redirect(301, "/" + updatedTrail.state);
      }
    }
  );
});

// DELETE /:id

router.delete("/:id/:state", (req, res) => {
  State.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      // http status code to indicate we permanently redirect
      res.redirect(301, "/");
    }
  });
});

router.delete("/:id", (req, res) => {
  Trail.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      // http status code to indicate we permanently redirect
      res.redirect(301, "/" + data.state);
    }
  });
});

router.get("/:state/:city/map", (req, res) => {
  let state = req.params.state;
  let city = req.params.city;
  Trail.find({ city: city }, (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("map.ejs", {
        apiKey: apiKey,
        state: state,
        city: city,
      });
    }
  });
});

// order matters here
// NEW View
router.get("/:state/new", (req, res) => {
  let state = req.params.state;
  res.render("new.ejs", {
    state: state,
  });
});

// NEW View
router.get("/:new-state", (req, res) => {
  let state = req.params.id;
  res.render("new-state.ejs", {
    state: state,
  });
});

// GET /:state
router.get("/:state", (req, res) => {
  let state = req.params.state;
  // test with code below without using req.params.state
  Trail.find({ state: req.params.state }, (err, foundTrails) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("show.ejs", {
        trails: foundTrails,
        state: state,
      });
    }
  });
});

// GET/states w/ search -----works as of now
router.get("/", (req, res) => {
  // variable to store string if no state found
  let noSearchMatch = null;
  // first if handles search
  if (req.query.search) {
    // global - ignore case
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    State.find({ state: regex }, (err, allStates) => {
      if (err) {
        console.log(err.message);
      } else {
        if (allStates.length < 1) {
          noSearchMatch = `${req.query.search} was not found, try again...`;
        }
        res.render("index.ejs", {
          states: allStates,
          noSearchMatch: noSearchMatch,
        });
      }
    });
  } else {
    State.find({}, (err, allStates) => {
      if (err) {
        console.log(err.message);
      } else {
        res.render("index.ejs", {
          states: allStates,
          noSearchMatch: noSearchMatch,
        });
      }
    });
  }
});

// Create
// POST new trail
router.post("/:new-state", (req, res) => {
  State.create(req.body, (err, createdState) => {
    res.redirect(301, "/");
  });
});

// Create
// POST new trail
router.post("/:state", (req, res) => {
  Trail.create(req.body, (err, createdTrail) => {
    res.redirect(301, "/" + req.params.state);
  });
});

// export to server
module.exports = router;

// mongoose Seed and Drop DB

// *** seed data into database once and comment out after ***
// Trail.create(trailSeed, (err, data) => {
//   if (err) console.log(err.message);
//   console.log("Added provided trail data....");
//   // might not need with atlas?
//   //   db.close();
// });

// State.create(stateSeed, (err, data) => {
//   if (err) console.log(err.message);
//   console.log("Added provided state data....");
//   // might not need with atlas?
//   //   db.close();
// });

// *** Drop collection ***

// Trail.collection.drop();
// State.collection.drop();

// --------------------- graveyard ------------------------

// // URL CREATE/DROP
// // Seed data via url

// router.post("/seedtrails", (req, res) => {
//   Trail.create(trailSeed, (err, createdTrail) => {
//     if (err) console.log(err.message);
//     console.log("Added provided trail data....");
//     res.redirect(301, "/");
//   });
// });

// router.post("/seedstates", (req, res) => {
//   State.create(stateSeed, (err, createdState) => {
//     if (err) console.log(err.message);
//     console.log("Added provided trail data....");
//     res.redirect(301, "/");
//   });
// });

// router.post("/dropdbs", (req, res) => {
//   State.collection.drop((err, data) => {
//     if (err) console.log(err.message);
//     console.log("Removed State sub db....");
//   });
//   Trail.collection.drop((err, data) => {
//     if (err) console.log(err.message);
//     console.log("Removed Trail sub db....");
//   });
//   res.redirect(301, "/");
// });
