import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user.modal";
import { NextResponse } from "next/server"
import { Types } from "mongoose";
import Category from "@/app/lib/modals/category.modal";


export const GET = async (request: Request) => {
  try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      
      // checking if the userId is given and of the same Type as of the Object Id
      if(!userId || !Types.ObjectId.isValid(userId)) { 
        return new NextResponse(JSON.stringify({message: "Invalid or missing userId"}), {status: 400})
      } 
      // connecting to the database
      await connect();

      const user = await User.findById(userId);
      // checking if user is present in the database or not
     if (!user) {
        return new NextResponse(JSON.stringify({message: "User not found in the database"}), {status: 400})
     }
     
     // to check if the userId given and present in the database are the same
     const catogories = await Category.find({
        user: new Types.ObjectId(userId),   
     })

     if(!catogories) {
        return new NextResponse(JSON.stringify({message: "No categories are found with the given userId"}), {status: 400})
     }

     return new NextResponse(JSON.stringify(catogories), {status: 200})

  } catch (error: any) {
     return new NextResponse("No categories are found with the given userId", {status: 500})
  }
}