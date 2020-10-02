const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const multerS3 = require("multer-s3");
const key = require("../../config/keys").secretOrKey;
//    load models
const Event = require("../../models/Event");
const Request = require("../../models/Request");
const Requests = require("../../models/Participants");
const User = require("../../models/User");

//    Secret Key
const keys = "secret";

//   Test API
router.get("/test1", (req, res) => res.json({ msg: "user works " }));
router.get("/test", (req, res) =>
  res.json({ msg: "test api is working of event" })
);

const s3 = require("../../config/Keys.js").s3;

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG and PNG"), false);
  }
};

// const upload = multer({
//   fileFilter,
//   storage: multerS3({
//     s3,
//     bucket: "project-munshi",
//     metadata: function(req, file, cb) {
//       cb(null, { fieldName: "TESTING_META_DATA!" });
//     },
//     key: function(req, file, cb) {
//       cb(null, Date.now().toString());
//     }
//   })
// });

//    image upload
// router.post(
//   "/event-img-upload",
//   upload.single("eventImage"),
//   (req, res, next) => {
//     console.log(req.file.location);
//     res.send(req.file.location);
//   }
// );

// event registration     (PRIVATE ROUTE)
router.post(
  "/registerEvent",
  verifyToken,
  // upload.single("eventImage"),
  async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    jwt.verify(req.Token, key, async (err, authData) => {
      // verify the authentic user
      if (err) {
        res.sendStatus(403);
      } else {
        //const { event } = req.body;
        const newEvent = new Event({
          eventTitle: req.body.eventTitle,
          eventLocation: req.body.eventLocation,
          eventDescription: req.body.eventDescription,
          eventStart: req.body.eventStart,
          eventEnd: req.body.eventEnd,
          formQuestions: req.body.formQuestions,
          organizationName: req.body.organizationName,
          organizerId: authData.id,
          // eventImage: event.eventImage
        });

        newEvent.save().then((response) => {
          res.json(response);
        });
      }
    });
  }
);
// event register without authentication
/* router.post("/registerEvents", async (req, res) => {
  const { event } = req.body;
  const newEvent = new Event({
    eventTitle: event.eventTitle,
    eventLocation: event.eventLocation,
    eventDescription: event.eventDescription,
    eventStart: event.eventStart,
    eventEnd: event.eventEnd,
    formQuestions: event.formQuestions,
    organizationName: event.organizationName,
    organizerId: authData.id,
    eventImage: event.eventImage
  });

  newEvent.save().then(response => {
    res.json(response);
  });
}); */

router.post("/updateEvent", verifyToken, (req, res) => {
  jwt.verify(req.Token, key, (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      Event.findByIdAndUpdate(
        req.body.event._id,
        req.body.event,
        { new: true },
        (err, response) => {
          if (err) {
            return res.sendStatus(403);
          } else {
            res.json(response);
          }
        }
      );
    }
  });
});

router.post("/deleteEvent", verifyToken, (req, res) => {
  jwt.verify(req.Token, key, (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      Event.findByIdAndDelete(req.body.eventId, (err, data) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          res.json(data);
        }
      });
    }
  });
});
// returns all events  (public route (will be accessible to all the users))
router.get("/allEvents", (req, res) => {
  Event.find().then((response) => res.json(response));
});
router.get("/:eventId", (req, res) => {
  Event.findById(req.params.eventId).then((event) => {
    if (event) {
      res.json(event);
    } else {
      res.json({ msg: "no details exist" });
    }
  });
});
// User Events (Private Route)
router.post("/userEvents", verifyToken, async (req, res) => {
  // verify the authentic user
  jwt.verify(req.Token, key, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const returnData = [];
      const events = await Event.find({ organizerId: authData.id });
      for (let event of events) {
        const requests = await Request.find({
          eventId: event._id,
          requestStatus: "pending",
        });
        returnData.unshift({ event, requests });
      }
      res.json(returnData);
    }
  });
});

// user requests   (Private Route)
router.post("/userRequest", verifyToken, async (req, res) => {
  // verify the authentic user
  jwt.verify(req.Token, key, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const questionnare = [
        { question: "usman", answer: "zafar" },
        { question: "abdul", answer: "basit" },
        { question: "ibad", answer: "ahmed" },
        { question: "daniyal", answer: "farooq" },
        { question: "usman", answer: "zafar" },
        { question: "abdul", answer: "basit" },
        { question: "ibad", answer: "ahmed" },
        { question: "daniyal", answer: "farooq" },
        { question: "usman", answer: "zafar" },
        { question: "abdul", answer: "basit" },
        { question: "ibad", answer: "ahmed" },
        { question: "daniyal", answer: "farooq" },
      ];

      const event = await Event.findById(req.body.eventId);

      const newRequest = new Request({
        participantID: authData.id,
        requestStatus: "pending",
        eventId: req.body.eventId,
        organizerId: event.organizerId,
        requestForm: req.body.requestForm,
      });
      newRequest.save().then((response) => {
        res.json(response);
      });

      /* if (event.organizerId.toString() !== authData.id.toString()) {
        let check = true;

        Request.find().then(requests => {
          requests.map(request => {
            if (
              request.participantID.toString() === authData.id.toString() &&
              request.eventId.toString() === req.body.eventId.toString()
            )
              check = false;
          }); // checks if user already submitted the request ?

          if (check) {
            newRequest.save().then(response => {
              res.json(response);
            });
          } else {
            return res.status(404).json({
              invalidUser: " you have already submit to this event"
            });
          }
        }); //    will iterate through each data in db
      } // checks if the user is organizer or not ?
      else {
        return res
          .status(404)
          .json({ invalidUser: "Organizer cannot register to its event" });
      } */
    }
  });
});

// approve user request   (Private Route )
router.post("/approveRequest", verifyToken, (req, res) => {
  jwt.verify(req.Token, key, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Request.findById(req.body.requestId).then((request) => {
        if (request.organizerId.toString() === authData.id.toString()) {
          request.requestStatus = "approve";
          request.save().then((response) => res.json(response));
        } // if the user is the Organizer
        else {
          return res
            .status(404)
            .json({ invalidUser: "this user have no rights for this action" });
        }
      }); // search Request with ID
    }
  });
});

// reject user request
router.post("/rejectRequest", verifyToken, (req, res) => {
  jwt.verify(req.Token, key, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Request.findById(req.body.requestId).then((request) => {
        if (request.organizerId.toString() === authData.id.toString()) {
          request.requestStatus = "rejected";
          request.save().then((response) => res.json(response));
        } // if the user is the Organizer
        else {
          return res
            .status(404)
            .json({ invalidUser: "this user have no rights for this action" });
        }
      });
    }
  });
});

// participant request
router.post("/participantRequest", verifyToken, async (req, res) => {
  jwt.verify(req.Token, key, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const returnData = [];

      const events = await Event.find({
        organizerId: authData.id,
        _id: req.body.eventId,
      }); // gets all events
      for (let event of events) {
        const requests = await Request.find({ eventId: event._id }); // get requests of respective events
        for (let request of requests) {
          if (request.requestStatus === "pending") {
            const user = await User.findById(request.participantID); // get user information of respective request
            returnData.unshift({ user, request, event }); // add request to requestData array
          }
        }
      }
      res.json(returnData); // return RequestList
    }
  });
});

// community
router.post("/community", verifyToken, async (req, res) => {
  jwt.verify(req.Token, key, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const returnData = [];

      const events = await Event.find({ organizerId: authData.id }); // gets all events
      for (let event of events) {
        const requests = await Request.find({ eventId: event._id }); // gets all requests of events
        for (let request of requests) {
          const user = await User.findById(request.participantID); // get user data of respective request
          returnData.unshift({ user, request, event }); // add request to requestData array
        }
      }
      res.json(returnData); // return RequestList
    }
  });
});

router.post("/statistics", verifyToken, async (req, res) => {
  jwt.verify(req.Token, key, async (err, authData) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      const currentTime = new Date();
      let liveEvent = [];
      const eventsAttended = await Request.find({
        participantID: authData.id,
        requestStatus: "approve",
      });
      const eventsOrganized = await Event.find({ organizerId: authData.id });
      eventsOrganized.map((event) => {
        const eventTime = new Date(event.eventEnd.toString());
        if (eventTime > currentTime) {
          liveEvent.unshift(event);
        }
      });
      res.json({ eventsAttended, eventsOrganized, liveEvent });
    }
  });
});

router.post("/requests", verifyToken, (req, res) => {
  jwt.verify(req.Token, key, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Requests.findOne({ userId: authData.id }).then((request) => {
        if (request) {
          res.json({ msg: " already registered" });
        } else {
          const questionnare = [
            { question: "usman", answer: "zafar" },
            { question: "abdul", answer: "basit" },
            { question: "ibad", answer: "ahmed" },
            { question: "daniyal", answer: "farooq" },
            { question: "usman", answer: "zafar" },
            { question: "abdul", answer: "basit" },
            { question: "ibad", answer: "ahmed" },
            { question: "daniyal", answer: "farooq" },
            { question: "usman", answer: "zafar" },
            { question: "abdul", answer: "basit" },
            { question: "ibad", answer: "ahmed" },
            { question: "daniyal", answer: "farooq" },
          ];
          const newRequest = new Requests({
            userId: authData.id,
            eventId: req.body.eventId,
            requestForm: req.body.requestForm,
          });
          newRequest
            .save()
            .then(res.json({ message: "REQUESt has been submitted" }));
        }
      });
    }
  });
});

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.Token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
module.exports = router;
