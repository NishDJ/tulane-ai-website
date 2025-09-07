import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getContentFiles(directory: string): string[] {
  const fullPath = path.join(process.cwd(), directory);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return fs.readdirSync(fullPath).filter((file) => file.endsWith(".md"));
}

export function getContentBySlug(directory: string, slug: string) {
  const fullPath = path.join(process.cwd(), directory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content,
  };
}

export function getAllContent(directory: string) {
  const files = getContentFiles(directory);
  
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      return getContentBySlug(directory, slug);
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a?.frontmatter.date && b?.frontmatter.date) {
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
      }
      return 0;
    });
}

export function getDataFile<T>(filePath: string): T | null {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading data file ${filePath}:`, error);
    return null;
  }
}