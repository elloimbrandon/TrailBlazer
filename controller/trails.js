const express = require("express");
const req = require("express/lib/request");
const methodOverride = require("method-override");

const router = express.Router();

// middleware
router.use(express.urlencoded({ extended: false })); // req.body || extended: false - does not allow nested objects in query strings
router.use(express.json()); // returns middleware that only parses JSON - may or may not need it depending on your project
router.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form

// Models
const Trail = require("../models/trailsSchema.js");
const trailSeed = require("../models/trailsSeed.js");

const State = require("../models/stateSchema.js");
const stateSeed = require("../models/stateSeed.js");

// // NEW View
// router.get("/state:/new", (req, res) => {
//   let state = req.params.state;
//   res.render("new.ejs", {
//     state: state,
//   });
// });

// Edit
// GET /:id/edit
// router.get("/:id/edit", (req, res) => {
//   Park.findById(req.params.id, (err, foundTrail) => {
//     res.render("edit.ejs", {
//       trails: foundTrail,
//     });
//   });
// });

// Update
// PUT /:id
// router.put("/:id", (req, res) => {
//   Park.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true },
//     (err, updatedTrail) => {
//       if (err) {
//         console.log(err.message);
//       } else {
//         res.redirect("/");
//       }
//     }
//   );
// });

// DELETE /:id
router.delete("/:id", (req, res) => {
  Trail.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      // http status code to indicate we permanently redirect
      res.redirect(301, "/");
    }
  });
});

// order matters!
// NEW View
router.get("/:state/new", (req, res) => {
  let state = req.params.state;
  res.render("new.ejs", {
    state: state,
  });
});

// GET /:state
router.get("/:state", (req, res) => {
  let state = req.params.state;
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

// GET / trails
// router.get("/", (req, res) => {
//   Trail.find({}, (err, allTrails) => {
//     res.render("index.ejs", {
//       trails: allTrails,
//     });
//   });
// });

// GET / states
router.get("/", (req, res) => {
  State.find({}, (err, allStates) => {
    if (err) {
      console.log(err.message);
    } else {
      Trail.find({}, (err, allTrails) => {
        if (err) {
          console.log(err.message);
        } else {
          res.render("index.ejs", {
            trails: allTrails,
            states: allStates,
          });
        }
      });
    }
  });
});

// Create
// POST new trail
router.post("/:state", (req, res) => {
  Trail.create(req.body, (err, createdTrail) => {
    res.redirect(301, "/");
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

// router.get("/:state", (req, res) => {
//   Trail.find({ state: req.params.state }, (err, foundTrails) => {
//     let state = req.params.state;
//     if (err) {
//       console.log(err.message);
//     } else {
//       State.find({ state: req.params.state }, (err, foundState) => {
//         if (err) {
//           console.log(err.message);
//         } else {
//           res.render("show.ejs", {
//             state: state,
//             trails: foundTrails,
//           });
//         }
//       });
//     }
//   });
// });
