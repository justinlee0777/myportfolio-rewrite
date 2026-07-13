import type {
  Author,
  AuthorGroup,
  PortraitData,
  TimeSpan,
} from 'author-map-ui';
import { model, Model, models, Schema } from 'mongoose';
import z, { ZodType } from 'zod';

const PortraitDataSchema = new Schema<PortraitData>(
  {
    src: { type: String },
  },
  { _id: false },
);

const TimeSpanSchema = new Schema<TimeSpan>(
  {
    startDate: { type: String },
    endDate: { type: String },
  },
  { _id: false },
);

const AuthorGroupSchema = new Schema<AuthorGroup>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  span: {
    type: TimeSpanSchema,
  },
  link: { type: String },
});

const AuthorGroupModelName = 'AuthorGroup';

export const AuthorGroupModel: Model<AuthorGroup> =
  models[AuthorGroupModelName] ||
  model(AuthorGroupModelName, AuthorGroupSchema);

const AuthorSchema = new Schema<Author>({
  id: { type: String, required: true, unique: true },
  authorFirstName: { type: String, required: true },
  authorLastName: { type: String, required: true },
  authorFullName: { type: String },
  authorDisplayName: { type: String },
  link: {
    type: String,
  },
  portrait: { type: PortraitDataSchema },
  groups: [{ type: String }],
  inclusionReasons: Schema.Types.Mixed,
});

const AuthorModelName = 'Author';

export const AuthorModel: Model<Author> =
  models[AuthorModelName] || model(AuthorModelName, AuthorSchema);

// Validators

export const AuthorValidator = z.object({
  authorFirstName: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .max(100),
  authorLastName: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .max(100),
  inclusionReasons: z.array(z.any()),
}) satisfies ZodType<Omit<Author, 'id'>>;

export const AuthorGroupValidator = z.object({
  name: z.string().max(100),
  description: z.string().max(4000),
}) satisfies ZodType<Omit<AuthorGroup, 'id'>>;
