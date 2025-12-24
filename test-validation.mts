/**
 * Test validation in seed system
 */

import { validateArray, validateData } from "./src/database/seed/utils/helpers.js";
import { comicSeedSchema, userSeedSchema } from "./src/lib/validations/index.js";

// Test user validation
console.log("Testing user validation...");
try {
  const validUser = validateData(
    {
      name: "Test User",
      email: "test@example.com",
      role: "user",
    },
    userSeedSchema
  );
  console.log("✓ Valid user passed:", validUser.email);
} catch (error) {
  console.error("✗ Valid user failed:", error);
}

try {
  const invalidUser = validateData(
    {
      name: "T", // Too short
      email: "invalid-email", // Invalid email
      role: "superadmin", // Invalid role
    },
    userSeedSchema
  );
  console.log("✗ Invalid user should have failed but passed");
} catch (error) {
  console.log("✓ Invalid user correctly rejected");
}

// Test comic validation
console.log("\nTesting comic validation...");
try {
  const validComic = validateData(
    {
      title: "Test Comic",
      description: "This is a test comic with enough description",
      status: "Ongoing",
    },
    comicSeedSchema
  );
  console.log("✓ Valid comic passed:", validComic.title);
} catch (error) {
  console.error("✗ Valid comic failed:", error);
}

try {
  const invalidComic = validateData(
    {
      title: "", // Empty title
      description: "Short", // Too short
      status: "InvalidStatus",
    },
    comicSeedSchema
  );
  console.log("✗ Invalid comic should have failed but passed");
} catch (error) {
  console.log("✓ Invalid comic correctly rejected");
}

// Test array validation
console.log("\nTesting array validation...");
try {
  const validUsers = validateArray(
    [
      {
        name: "User 1",
        email: "user1@example.com",
        role: "user",
      },
      {
        name: "User 2",
        email: "user2@example.com",
        role: "admin",
      },
    ],
    userSeedSchema
  );
  console.log(`✓ Valid user array passed: ${validUsers.length} users`);
} catch (error) {
  console.error("✗ Valid user array failed:", error);
}

console.log("\n✅ Validation tests completed!");
