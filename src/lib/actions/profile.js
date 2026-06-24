'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  db,
  findUserDocument,
  getCurrentActiveUserWithRole,
  getUserFilters,
  toText,
} from "@/lib/database-helpers";

async function getEditableUser() {
  const seeker = await getCurrentActiveUserWithRole("seeker");

  if (seeker) {
    return seeker;
  }

  return getCurrentActiveUserWithRole("recruiter");
}

export async function updateProfile(formData) {
  const user = await getEditableUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const returnTo = toText(formData.get("returnTo")) || "/dashboard/seeker/settings";
  const existingUser = await findUserDocument(user);

  if (!existingUser) {
    redirect(`${returnTo}?error=User profile was not found`);
  }

  const name = toText(formData.get("name"));
  const email = toText(formData.get("email")).toLowerCase();

  if (!name || !email) {
    redirect(`${returnTo}?error=Name and email are required`);
  }

  const sameEmailUser = await db.collection("user").findOne({
    email,
    _id: { $ne: existingUser._id },
  });

  if (sameEmailUser) {
    redirect(`${returnTo}?error=This email is already used by another account`);
  }

  const photo = toText(
    formData.get("photo") ||
    existingUser.photo ||
    existingUser.image ||
    existingUser.avatar
  );
  const rawSkills = toText(formData.get("skills"));
  const skills = rawSkills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const updateData = {
    name,
    email,
    photo,
    image: photo,
    avatar: toText(formData.get("avatar") || photo),
    headline: toText(formData.get("headline")),
    bio: toText(formData.get("bio")),
    skills,
    updatedAt: new Date(),
  };

  await db.collection("user").updateOne(
    { $or: getUserFilters(user) },
    { $set: updateData }
  );

  revalidatePath("/dashboard/seeker/settings");
  revalidatePath("/dashboard/recruiter/settings");
  revalidatePath("/", "layout");
  redirect(`${returnTo}?success=Profile updated successfully`);
}
