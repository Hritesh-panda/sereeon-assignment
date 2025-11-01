import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  try {
    console.log("testing the prisma postrgresql");
    const user = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "admin@example.com",
        password: "123456", // hashed in production
        role: "ADMIN",
        contact: "9876543210",
      },
    });
    console.log("✅ User created successfully:");
    console.log(user);
    const users = await prisma.user.findMany();
    console.log("📋 All Users:", users);
  } catch (error) {
    console.error("❌ Error testing Prisma connection:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
