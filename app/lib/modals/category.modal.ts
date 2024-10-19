import mongoose, { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
    {
        title: {type: String, required: true},
        user: { type: Schema.Types.ObjectId, ref: "User"}
    },
    {
        timestamps: true
    })

const Category = model("Category", categorySchema)  || models.Category

export default Category;