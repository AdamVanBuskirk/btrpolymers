import { IIndustry } from "./interfaces/IIndustry";
import { Schema, model } from 'mongoose';

const industrySchema = new Schema<IIndustry>({
    name: {
        type: String
    },
    created:  {
        type: Date,
        required: true
    },
    modified:  {
        type: Date
    },
    active:  {
        type: Boolean,
        required: true
    },
    deleted:  {
        type: Date
    }
});

module.exports = model<IIndustry>('Industry', industrySchema);
export { IIndustry };
