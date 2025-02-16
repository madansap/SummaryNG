import { auth } from "@clerk/nextjs"
import { getDB } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getCurrentUser() {
  const { userId } = auth()
  
  if (!userId) {
    return null
  }

  const db = getDB(process.env.DB as D1Database)
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    // Create user if they don't exist
    const { user: clerkUser } = auth()
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      return null
    }

    const newUser = {
      id: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
    }

    await db.insert(users).values(newUser)
    return newUser
  }

  return user
} 