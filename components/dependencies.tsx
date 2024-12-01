import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import packageJson from "../package.json";

const dependencies = Object.entries(packageJson.dependencies).map(
  ([name, version]) => ({
    name,
    version: version.replace("^", ""),
  })
);

export function Dependencies() {
  const t = useTranslations("dependencies");

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{t("title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dependencies.map((dep, index) => (
          <Card key={index} className="bg-gray-50 dark:bg-gray-700">
            <CardHeader>
              <CardTitle>{dep.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t("version")}: {dep.version}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
