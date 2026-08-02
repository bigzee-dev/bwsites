import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function adminExists() {
  const count = await prisma.user.count({ where: { role: "ADMIN" } });
  return count > 0;
}

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role === "ADMIN") {
    return session;
  }

  return null;
}
