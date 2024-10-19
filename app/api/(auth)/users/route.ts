import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user.modal";
import { NextResponse } from "next/server"
import { Types } from "mongoose";


const ObjectId = require('mongoose').Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        if(!users){
            return new NextResponse("There are no users")
        }
        else{
            return new NextResponse(JSON.stringify(users), {status: 200});}
    } catch (error: any) {
        return new NextResponse("Error in fetching the Users:" + error.message, {status: 500})
    }
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(JSON.stringify({message: "User is created successfully", user: newUser}), {status: 200})
  } catch (error : any) {
    return new NextResponse("Error in creating the User", {status: 500})
  }
}

export const PATCH = async (request: Request) => {
  try {
     const body = await request.json();
     const {userId, newUsername} = body;

     await connect();

     if(!userId || !newUsername) {
        return new NextResponse(JSON.stringify({message: "ID or new username not found"}), {status: 500})
     }

     if(!Types.ObjectId.isValid(userId)) {
        return new NextResponse(JSON.stringify({message: "Invalid userId"}), {status: 400})
     }

     const updatedUser = await User.findOneAndUpdate(
        {
            _id: new ObjectId(userId)
        },
        {
            username: newUsername
        },
        {
            new: true
        }
     )

     if(!updatedUser){
     return new NextResponse(JSON.stringify({message: "User not found in the database"}), {status: 400})}

     return new NextResponse(JSON.stringify({message: "User data is updated", user: updatedUser}), {status: 200})
  } catch (error : any) {
    return new NextResponse("Error in updating the User data" + error.message, {status: 500})
  }
}

export const DELETE = async (request : Request) => {
  try {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if(!userId) {
        return new NextResponse(JSON.stringify({message: "No userId is detected"}), {status: 400})
    }

    if(!Types.ObjectId.isValid(userId)) {
        return new NextResponse(JSON.stringify({message: "Invalid userId"}), {status: 400})
     }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
        new Types.ObjectId(userId)
    )

    if(!deletedUser){
        return new NextResponse(JSON.stringify({message: "No user is present to delete with this User Id"}), {status: 400}
        )
    }

    return new NextResponse(JSON.stringify({message: "User is deleted successfully", user: deletedUser}), {status: 200})

  } catch (error) {
    return new NextResponse("Error is deleting the user",{status: 500} )
  }
}

