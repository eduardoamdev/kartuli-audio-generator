import fs from "fs";
import path from "path";

export function getAllInfinitives(): string {
  const verbsPath = path.join(process.cwd(), "src", "data", "verbs");
  const files = fs.readdirSync(verbsPath);

  const infinitives: string[] = [];

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(verbsPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);

      // Extract infinitive.conjugation.infinitive.la
      const infinitive = data?.infinitive?.conjugation?.infinitive?.la;

      if (infinitive) {
        infinitives.push(infinitive);
      }
    }
  }

  return infinitives.join(", ");
}
