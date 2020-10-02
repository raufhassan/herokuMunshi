const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "events"
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    participantID: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    requestStatus: {
      type: String,
      default: "pending"
    },
    requestForm: [
      {
        question: {
          type: String
          // required: true
        },
        answer: {
          type: String
          // required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = Request = mongoose.model("requests", RequestSchema);
