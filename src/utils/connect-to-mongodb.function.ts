import { connect } from 'mongoose';

export default function connectToMongoDB() {
  return connect(process.env.MONGODB_URI!);
}
