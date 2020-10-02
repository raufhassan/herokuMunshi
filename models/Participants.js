const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "events"
    },
    userId: {
      type: String
    },
    /* },
    occupation:{
        type:String,
        required:true
    },
    organisation:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    event:{
        type:String,
        required:true
    },

    answer:{
        type : String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        required:true
    },
    applied:{
        type:Date,
        required:true
    }, */
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

module.exports = Requests = mongoose.model("PartRequest", partSchema);
