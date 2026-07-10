import { model, Model, models, Schema } from 'mongoose';
import { TableOfContentsConfig } from 'prospero/models/table-of-contents.interface';

export interface ProsperoTableOfContents extends TableOfContentsConfig {
  textDescription: string;
  textTitle: string;
}

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
