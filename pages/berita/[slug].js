import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Image from "next/image";

export async function getStaticPaths() {
  const files = fs.readdirSync("content/berita");
  const paths = files.map((filename) => ({
    params: { slug: filename.replace(".md", "") },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join("content/berita", `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const processedContent = await remark().use(html).process(content);
  return {
    props: {
      frontmatter: {
        ...frontmatter,
        date: new Date(frontmatter.date).toISOString(),
      },
      content: processedContent.toString(),
    },
  };
}

export default function Berita({ frontmatter, content }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{frontmatter.title}</h1>
      <p className="text-sm text-gray-600">{frontmatter.date}</p>
      <Image
        src={frontmatter.thumbnail}
        alt={frontmatter.title}
        className="my-4"
      />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
