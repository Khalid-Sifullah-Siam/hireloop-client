import {
  findUserDocument,
  getCurrentUser,
  makeDocumentSafe,
} from "@/lib/database-helpers";

export async function getMyProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const savedUser = await findUserDocument(user);

  return savedUser ? makeDocumentSafe(savedUser) : user;
}
