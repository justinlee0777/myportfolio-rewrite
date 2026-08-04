import { model, Model, models, Schema } from 'mongoose';
import { BookProps } from '@prospero-library/web/components.js';

export type ProsperoTableOfContents = {
  textDescription: string;
  textTitle: string;
} & BookProps['showTableOfContents'];

const ProsperoTableOfContentsSchema = new Schema<ProsperoTableOfContents>({
  textDescription: { type: String, required: true },
  textTitle: { type: String, required: true },
  sections: [
    {
      pageNumber: { type: Number, required: true },
      title: { type: String, required: true },
    },
  ],
});

const ProsperoTableOfContentsModelName = 'ProsperoTableOfContents';

export const ProsperoTableOfContentsModel: Model<ProsperoTableOfContents> =
  models[ProsperoTableOfContentsModelName] ||
  model(ProsperoTableOfContentsModelName, ProsperoTableOfContentsSchema);
