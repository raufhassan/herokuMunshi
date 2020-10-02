const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//create schema
const EventSchema = new Schema(
  {
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    organizationName: {
      type: String
    },
    eventTitle: {
      type: String,
      required: true
    },
    eventLocation: {
      type: String,
      required: true
    },
    eventDescription: {
      type: String,
      required: true
    },
    eventStart: {
      type: Date
      // required: true
    },
    eventEnd: {
      type: Date
      // required: true
    },
    eventImage: {
      type: String
      //required: true
    },
    formQuestions: {
      type: Array,
      contains: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = Event = mongoose.model("event", EventSchema);
