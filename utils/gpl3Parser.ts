export async function fetchGPL3License() {
  const response = await fetch("https://api.github.com/licenses/gpl-3.0");
  const data = await response.json();
  return data.body;
}

export function parseGPL3License(licenseText: string) {
  const sections = licenseText.split(/\n{2,}/);
  const parsedSections = sections.map((section, index) => ({
    id: `section-${index}`,
    title: section.split("\n")[0].trim(),
    content: section.split("\n").slice(1).join("\n").trim(),
  }));
  return parsedSections;
}

export function searchLicense(
  sections: Array<{ id: string; title: string; content: string }>,
  query: string
) {
  const lowercaseQuery = query.toLowerCase();
  return sections.filter(
    (section) =>
      section.title.toLowerCase().includes(lowercaseQuery) ||
      section.content.toLowerCase().includes(lowercaseQuery)
  );
}
