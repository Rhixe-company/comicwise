/**
 * User Seeder
 */

import * as mutations from "#database/mutations";
import * as queries from "#database/queries";
import { ProgressTracker } from "#database/seed/logger";
import { BatchProcessor } from "#database/seed/utils/batchProcessor";
import { imageService } from "#services/imageService";
import appConfig from "appConfig";
import bcrypt from "bcryptjs";

import type { SeedConfig } from "#database/seed/config";
import type { UserSeed } from "#lib/validations";

/**
 *
 */
export class UserSeeder {
  private options: SeedConfig["options"];
  private batchProcessor: BatchProcessor<UserSeed, void>;

  /**
   *
   * @param options
   */
  constructor(options: SeedConfig["options"]) {
    this.options = options;
    this.batchProcessor = new BatchProcessor<UserSeed, void>({
      batchSize: 50,
      concurrency: 5,
    });
  }

  /**
   *
   * @param users
   */
  async seed(users: UserSeed[]): Promise<void> {
    const tracker = new ProgressTracker("Users", users.length);

    await this.batchProcessor.process(users, async (userData) => {
      try {
        await this.processUser(userData, tracker);
      } catch (error) {
        tracker.incrementError(`${userData.email}: ${error}`);
      }
    });

    tracker.complete();
  }

  private async processUser(userData: UserSeed, tracker: ProgressTracker): Promise<void> {
    const existing = await queries.getUserByEmail(userData.email);

    let hashedPassword: string | null = null;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    } else if (appConfig.customPassword) {
      hashedPassword = await bcrypt.hash(appConfig.customPassword, 10);
    }

    let processedImage: string | null = null;
    if (userData.image && !this.options.skipImageDownload) {
      processedImage = await imageService.processImageUrl(userData.image, "avatars");
    }

    if (existing) {
      await mutations.updateUser(existing.id, {
        name: userData.name,
        image: processedImage || existing.image,
        role: userData.role || existing.role,
      });

      tracker.incrementUpdated(userData.email);
    } else {
      await mutations.createUser({
        email: userData.email,
        name: userData.name,
        password: hashedPassword || undefined,
        image: processedImage || undefined,
        role: userData.role || "user",
      });

      tracker.incrementCreated(userData.email);
    }
  }
}
