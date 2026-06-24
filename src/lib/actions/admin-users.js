'use server';

import { revalidatePath } from "next/cache";
import { getDefaultPlanForRole } from "@/lib/plan-utils";
import {
  db,
  getCurrentUserWithRole,
  getIdFilters,
  makeDocumentSafe,
} from "@/lib/database-helpers";

export async function getAdminUsers(role = "all") {
  const admin = await getCurrentUserWithRole("admin");

  if (!admin) {
    return [];
  }

  const databaseFilter =
    role && role !== "all"
      ? { role: String(role).toLowerCase() }
      : {};
  const users = await db
    .collection("user")
    .find(databaseFilter)
    .sort({ createdAt: -1, _id: -1 })
    .toArray();

  return users.map(makeDocumentSafe);
}

export async function updateAdminUser(formData) {
  const admin = await getCurrentUserWithRole("admin");

  if (!admin) {
    throw new Error("Only admins can update users.");
  }

  const userId = String(formData.get("userId") || "").trim();
  const action = String(formData.get("action") || "").trim();
  const value = String(formData.get("value") || "").trim();

  if (!userId || !action) {
    throw new Error("User id and action are required.");
  }

  const userFilter = { $or: getIdFilters(userId) };
  const user = await db.collection("user").findOne(userFilter);

  if (!user) {
    throw new Error("User was not found.");
  }

  if (String(user._id) === String(admin.id || admin._id)) {
    throw new Error("You cannot update your own admin account here.");
  }

  const updateData = {
    updatedAt: new Date(),
  };

  if (action === "role") {
    if (!["admin", "seeker", "recruiter"].includes(value)) {
      throw new Error("Invalid user role.");
    }

    updateData.role = value;
    updateData.plan = getDefaultPlanForRole(value);
  }

  if (action === "status") {
    if (!["pending", "active"].includes(value)) {
      throw new Error("Invalid user status.");
    }

    updateData.status = value;
  }

  if (action === "suspend") {
    const suspended = value === "true";
    updateData.suspended = suspended;
    updateData.banned = suspended;
    updateData.banReason = suspended ? "Suspended by admin." : null;
    updateData.banExpires = null;
  }

  if (!["role", "status", "suspend"].includes(action)) {
    throw new Error("Invalid user action.");
  }

  await db.collection("user").updateOne(userFilter, { $set: updateData });
  const updatedUser = await db.collection("user").findOne(userFilter);

  revalidatePath("/dashboard/admin/users");

  return {
    message: "User updated successfully.",
    user: makeDocumentSafe(updatedUser),
  };
}
