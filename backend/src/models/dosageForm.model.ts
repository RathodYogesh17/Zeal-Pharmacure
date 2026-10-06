import mongoose from "mongoose";

const { Schema } = mongoose;

const dosageFormSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const DosageForm =
  mongoose.models.DosageForm ||
  mongoose.model("DosageForm", dosageFormSchema);

export default DosageForm;
