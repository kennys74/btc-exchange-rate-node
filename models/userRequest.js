import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
  exchangeRateRequest: String,
  exchangeRateResponse: String,
});

var UserRequest = mongoose.model("UserRequest", requestSchema);

export default UserRequest;
