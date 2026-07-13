import { model, Model, models, Schema } from 'mongoose';

export interface AuthorMapUser {
  username: string;
  token?: string;
}

export const AuthorMapUserSchema = new Schema<AuthorMapUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
  },
});

const AuthorMapUserModelName = 'AuthorMapUser';

export const AuthorMapUserModel: Model<AuthorMapUser> =
  models[AuthorMapUserModelName] ||
  model(AuthorMapUserModelName, AuthorMapUserSchema);

export interface AuthorMapCredential {
  username: string;
  id: string;
  publicKey: string;
  counter: number;
}

export const AuthorMapCredentialSchema = new Schema<AuthorMapCredential>({
  username: { type: String, required: true },
  id: { type: String, required: true },
  publicKey: { type: String, required: true },
  counter: { type: Number, required: true },
});

const AuthorMapCredentialModelName = 'AuthorMapCredential';

export const AuthorMapCredentialModel: Model<AuthorMapCredential> =
  models[AuthorMapCredentialModelName] ||
  model(AuthorMapCredentialModelName, AuthorMapCredentialSchema);
