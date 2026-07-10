import { Model, model, models, Schema } from 'mongoose';

export interface ProsperoPageStyleData {
  width: number;
  height: number;
  computedFontSize: string;
  computedFontFamily: string;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  borderTop: number;
  borderRight: number;
  borderBottom: number;
  borderLeft: number;
  textDescription: string;
  textTitle: string;
  lineHeight: number;
  html: boolean;
}

const ProsperoPageStyleDataSchema = new Schema<ProsperoPageStyleData>({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  computedFontSize: { type: String, required: true },
  computedFontFamily: { type: String, required: true },
  paddingTop: { type: Number, required: true },
  paddingRight: { type: Number, required: true },
  paddingBottom: { type: Number, required: true },
  paddingLeft: { type: Number, required: true },
  marginTop: { type: Number, required: true },
  marginRight: { type: Number, required: true },
  marginBottom: { type: Number, required: true },
  marginLeft: { type: Number, required: true },
  borderTop: { type: Number, required: true },
  borderRight: { type: Number, required: true },
  borderBottom: { type: Number, required: true },
  borderLeft: { type: Number, required: true },
  textDescription: { type: String, required: true },
  textTitle: { type: String, required: true },
  lineHeight: { type: Number, required: true },
  html: { type: Boolean, required: true },
});

const ProsperoPageStyleDataModelName = 'ProsperoPageStyleData';

export const ProsperoPageStyleDataModel: Model<ProsperoPageStyleData> =
  models[ProsperoPageStyleDataModelName] ||
  model(ProsperoPageStyleDataModelName, ProsperoPageStyleDataSchema);
