import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import mongoose from "mongoose";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    try {
      await mongoose.connect(process.env.MONGO_URI || "", {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority",
        ssl: true,
      });
      this.logger.log("Successfully connected to MongoDB");
    } catch (error) {
      this.logger.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await mongoose.disconnect();
      this.logger.log("Disconnected from MongoDB");
    } catch (error) {
      this.logger.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}
