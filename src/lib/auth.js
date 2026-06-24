import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "@/lib/db";
import { getDefaultPlanForRole } from "@/lib/plan-utils";

const defaultUserRole = "seeker";
const allowedSignupRoles = ["seeker", "recruiter"];

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
        required: false,
        defaultValue: defaultUserRole,
      },
      plan: {
        type: "string",
        input: false,
        required: true,
        defaultValue: "seeker_free",
      },
      planStartedAt: {
        type: "date",
        input: false,
        required: false,
      },
      planExpiresAt: {
        type: "date",
        input: false,
        required: false,
      },
      status: {
        type: "string",
        input: false,
        required: false,
        defaultValue: "pending",
      },
      suspended: {
        type: "boolean",
        input: false,
        required: false,
        defaultValue: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path !== "/sign-up/email") {
        return;
      }

      const selectedRole = String(context.body?.role || "")
        .trim()
        .toLowerCase();

      if (!allowedSignupRoles.includes(selectedRole)) {
        throw new APIError("BAD_REQUEST", {
          message: "Please select Job Seeker or Recruiter.",
        });
      }

      return {
        context: {
          ...context,
          body: {
            ...context.body,
            role: selectedRole,
          },
        },
      };
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const selectedRole = allowedSignupRoles.includes(user.role)
            ? user.role
            : defaultUserRole;

          return {
            data: {
              ...user,
              role: selectedRole,
              plan: getDefaultPlanForRole(selectedRole),
            },
          };
        },
      },
    },
  },
});
