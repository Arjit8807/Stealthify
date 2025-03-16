import { NextRequest } from 'next/server';
import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: NextRequest, 
  //TODO: see the type of params is why promis research
  { params }: { params: Promise<any> }
) {
  // Await the params object
  const { messageid } = await params; // Ensure params is awaited before using

  await dbConnect(); // Connect to the database
  const session = await getServerSession(authOptions); // Get the session data
  const _user: User = session?.user; // Type the user explicitly
  
  if (!session || !_user) {
    // Return an error if the user is not authenticated
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Try to remove the message from the user's messages
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    // Check if the message was found and deleted
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors that occur during the deletion
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}
