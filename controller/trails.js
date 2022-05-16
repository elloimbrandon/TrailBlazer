const express = require("express");
const req = require("express/lib/request");
const methodOverride = require("method-override");

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
        res.redirect("/");
      }
    }
  );
});

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

// order matters here
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

// GET/states w/ search

// router.get("/", (req, res) => {
//   // first if handles search
//   if (req.query.search) {
//     // global - ignore case
//     const regex = new RegExp(escapeRegex(req.query.search), "gi");
//     State.find({ state: regex }, (err, allStates) => {
//       if (err) {
//         console.log(err.message);
//       } else {
//         Trail.find({}, (err, allTrails) => {
//           if (err) {
//             console.log(err.message);
//           } else {
//             res.render("index.ejs", {
//               trails: allTrails,
//               states: allStates,
//             });
//           }
//         });
//       }
//     });
//   } else {
//     State.find({}, (err, allStates) => {
//       if (err) {
//         console.log(err.message);
//       } else {
//         Trail.find({}, (err, allTrails) => {
//           if (err) {
//             console.log(err.message);
//           } else {
//             res.render("index.ejs", {
//               trails: allTrails,
//               states: allStates,
//             });
//           }
//         });
//       }
//     });
//   }
// });

// GET/states w/ search -----works as of now
router.get("/", (req, res) => {
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
          noSearchMatch = "No State Found, try again ..";
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

// GET / states ////////// WORKING ////////////////
// router.get("/", (req, res) => {
//   State.find({}, (err, allStates) => {
//     if (err) {
//       console.log(err.message);
//     } else {
//       Trail.find({}, (err, allTrails) => {
//         if (err) {
//           console.log(err.message);
//         } else {
//           res.render("index.ejs", {
//             trails: allTrails,
//             states: allStates,
//           });
//         }
//       });
//     }
//   });
// });

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
