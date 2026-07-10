import { model, Model, models, Schema } from 'mongoose';

export interface ProsperoPageData {
  textTitle: string;
  pageNumber: number;
  beginIndex: number;
  endIndex: number;
  textDescription: string;
}

const ProsperoPageDataSchema = new Schema<ProsperoPageData>({
  textTitle: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  beginIndex: { type: Number, required: true },
  endIndex: { type: Number, required: true },
  textDescription: { type: String, required: true },
});

const ProsperoPageDataModelName = 'ProsperoPageData';

export const ProsperoPageDataModel: Model<ProsperoPageData> =
  models[ProsperoPageDataModelName] ||
  model(ProsperoPageDataModelName, ProsperoPageDataSchema);
