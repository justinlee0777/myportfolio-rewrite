import type { CityCoordinates } from 'author-map-ui';
import { model, Model, models, Schema } from 'mongoose';

const CityCoordinatesSchema = new Schema<CityCoordinates>(
  {
    coordinates: {
      type: [Number, Number],
      required: true,
      _id: false,
    },
    location: {
      type: {
        state: String,
        address: String,
      },
      required: true,
      _id: false,
    },
  },
  { _id: false },
);

const CityCoordinatesModelName = 'CityCoordinates';

export const CityCoordinatesModel: Model<CityCoordinates> =
  models[CityCoordinatesModelName] ||
  model(CityCoordinatesModelName, CityCoordinatesSchema);
