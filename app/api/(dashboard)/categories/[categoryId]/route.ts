import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user.modal";
import { NextResponse } from "next/server"
import { Types } from "mongoose";
import Category from "@/app/lib/modals/category.modal";

export const PATCH = async (request: Request, context: {params: any}) => { 
  // fetching the categoryId from the url directly which is dynamic, that's why we are using the context property provided by the next js;
  const categoryId =  context.params.category;
  try {
    const body = await request.json();
    const {title} = body;
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // checking if the userId is given and of the same Type as of the Object Id
    if(!userId || !Types.ObjectId.isValid(userId)) { 
        return new NextResponse(JSON.stringify({message: "Invalid or missing userId"}), {status: 400})
    } 

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return new NextResponse(JSON.stringify({message: "Invalid or missing categoryId"}), {status: 400})
    }

    await connect();

    const user = await User.findById(userId);

    if(!user) {
        return new NextResponse(JSON.stringify({message: "User not found"}), {status: 400})
    }

    const category = await Category.findOne(
        {
            _id: categoryId,
            user: userId
        })

    if(!category) {
        return new NextResponse(JSON.stringify({message: "Category not found"}), {status: 400})
    } 
    
    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {title},
        {new: true}
    )

    return new NextResponse(JSON.stringify({message: "Category is updated", category: updatedCategory}), {status: 200});
    
  } catch (error : any) {
    return new NextResponse("Error is updating the category" + error.message, {status:500})
  }
}