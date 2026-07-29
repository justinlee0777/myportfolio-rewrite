import { model, Model, models, Schema } from 'mongoose';

import { ProsperoLibraryTitle } from '../../models/prospero-library-title.model';

const ProsperoLibraryTitleSchema = new Schema<ProsperoLibraryTitle>({
  name: { type: String, required: true },
  authorFirstName: { type: String, required: true },
  authorLastName: { type: String, required: true },
  authorDisplayName: { type: String, required: true },
  urlSlug: { type: String },
  source: { type: String, required: true },
  sourceUrl: { type: String, required: true },
});

const ProsperoLibraryTitleModelName = 'ProsperoLibraryTitle';

export const ProsperoLibraryTitleModel: Model<ProsperoLibraryTitle> =
  models[ProsperoLibraryTitleModelName] ||
  model(ProsperoLibraryTitleModelName, ProsperoLibraryTitleSchema);
