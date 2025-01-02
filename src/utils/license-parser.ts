export interface License {
  id: string;
  name: string;
  url: string;
  sections: Array<{ id: string; title: string; content: string }>;
}

export async function fetchLicense(licenseId: string) {
  const response = await fetch(`https://api.github.com/licenses/${licenseId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch license: ${licenseId}`);
  }
  const data = await response.json();
  return data.body;
}

export function parseLicense(
  licenseText: string,
  licenseId: string,
  licenseName: string
) {
  const sections = licenseText.split(/\n{2,}/);
  return {
    id: licenseId,
    name: licenseName,
    url: `https://api.github.com/licenses/${licenseId}`,
    sections: sections.map((section, index) => ({
      id: `section-${index}`,
      title: section.split("\n")[0].trim(),
      content: section.split("\n").slice(1).join("\n").trim(),
    })),
  };
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

export const SUPPORTED_LICENSES = [
  { id: "gpl-3.0", name: "GNU General Public License v3.0" },
  { id: "mit", name: "MIT License" },
  { id: "apache-2.0", name: "Apache License 2.0" },
  { id: "bsd-3-clause", name: 'BSD 3-Clause "New" or "Revised" License' },
  { id: "mpl-2.0", name: "Mozilla Public License 2.0" },
];
