import { ConnectDb, myModel } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await ConnectDb();
    const user = await myModel.find();
    if (user.length === 0) {
      return NextResponse.json({ message: "No users found" });
    }
    return NextResponse.json({ userData: user });
  } catch (err) {
    console.error("Error fetching data", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    await ConnectDb();
    const { task } = await req.json();
    const newUser = await myModel.create({ task });
    return NextResponse.json({ userData: newUser }, { status: 201 });
  } catch (err) {
    console.error("Error while adding data", err);
    return NextResponse.json(
      {
        error: "Failed to post user data",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  await ConnectDb();
  try {
    const { id } = await req.json();
    const deleteUser = await myModel.findByIdAndDelete(id);
    return NextResponse.json({ userData: deleteUser }, { status: 200 });
  } catch (err) {
    console.error("Error deleting data", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  await ConnectDb();
  try {
    const { id, task } = await req.json();
    const updateUser = await myModel.findByIdAndUpdate(id, { task },{new:true});
    return NextResponse.json({ userData: updateUser }, { status: 200 });
  } catch (err) {
    console.error("Error Updating data", err);
    return NextResponse.json({ error: "Failed to Update" }, { status: 500 });
  }
};
