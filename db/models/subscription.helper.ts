import mongoose from 'mongoose';

const Subscription = mongoose.model('Subscription', new mongoose.Schema({
    endpoint: {
      type: String,
      required: true,
      unique: true
    },
    keys: {
      auth: {
        type: String,
        required: true
      },
      p256dh: {
        type: String,
        required: true
      }
    }
  }));

export default Subscription