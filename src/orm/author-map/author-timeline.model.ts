import {
  AuthorLocation,
  BirthEvent,
  DeathEvent,
  MilestoneEvent,
  TimelineEvent,
} from 'author-map-ui';
import { model, Model, models, Schema } from 'mongoose';

const AuthorLocationSchema = new Schema<AuthorLocation>(
  {
    address: { type: String },
    state: { type: String },
  },
  { _id: false },
);

const TimelineEventSchema = new Schema<TimelineEvent>({
  id: { type: String },
  authorId: { type: String },
  location: AuthorLocationSchema,
  notes: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  type: { type: String },
});

const AuthorTimelineEventModelName = 'AuthorTimelineEvent';

export const AuthorTimelineEventModel: Model<TimelineEvent> =
  models[AuthorTimelineEventModelName] ||
  model(AuthorTimelineEventModelName, TimelineEventSchema);

const MilestoneEventSchema = new Schema<MilestoneEvent>({
  id: { type: String },
  authorId: { type: String },
  location: AuthorLocationSchema,
  notes: { type: String },
  date: { type: String, required: true },
  type: { type: String },
});

const AuthorMilestoneEventModelName = 'AuthorMilestoneEvent';

export const AuthorMilestoneEventModel: Model<MilestoneEvent> =
  models[AuthorMilestoneEventModelName] ||
  model(AuthorMilestoneEventModelName, MilestoneEventSchema);

const BirthEventSchema = new Schema<BirthEvent>({
  id: { type: String },
  authorId: { type: String },
  location: AuthorLocationSchema,
  notes: { type: String },
  date: { type: String, required: true },
  type: { type: String },
});

const AuthorBirthEventModelName = 'AuthorBirthEvent';

export const AuthorBirthEventModel: Model<BirthEvent> =
  models[AuthorBirthEventModelName] ||
  model(AuthorBirthEventModelName, BirthEventSchema);

const DeathEventSchema = new Schema<BirthEvent>({
  id: { type: String },
  authorId: { type: String },
  location: AuthorLocationSchema,
  notes: { type: String },
  date: { type: String, required: true },
  type: { type: String },
});

const AuthorDeathEventModelName = 'AuthorDeathEvent';

export const AuthorDeathEventModel: Model<DeathEvent> =
  models[AuthorDeathEventModelName] ||
  model(AuthorDeathEventModelName, DeathEventSchema);
