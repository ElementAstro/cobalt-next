import { DarkFieldAPI } from "@/types/guiding/darkfield";
import { RealDarkFieldAPI } from "./darkfield";
import { MockDarkFieldAPI } from "@/services/mock/darkfield";

export class APIFactory {
  static isDevelopment = process.env.NODE_ENV === 'development';
  
  static createDarkFieldAPI(): DarkFieldAPI {
    return this.isDevelopment ? new MockDarkFieldAPI() : new RealDarkFieldAPI();
  }
}
