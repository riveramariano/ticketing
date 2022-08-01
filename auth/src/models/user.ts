import mongoose from 'mongoose';
import { Password } from '../services/password';

/* A type definition for the attributes that a users has. */
interface UserAttributes {
  email: string;
  password: string;
}

/* Extending the mongoose.Model to add a new method called build. */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}

/* A type definition for the attributes that a user has. */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { // Change sign-up user data response
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
    versionKey: false
  }
});

/* This is a mongoose middleware that is run before the user is saved to the database. It checks if the
password has been modified and if it has, it hashes the password and saves it to the database. */
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

/* Adding a new method to the User model called build. */
userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
