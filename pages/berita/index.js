import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";

export async function getStaticProps() {
  const files = fs.readdirSync("content/berita");
  const posts = files.map((filename) => {
    const slug = filename.replace(".md", "");
    const fileContent = fs.readFileSync(`content/berita/${filename}`, "utf-8");
    const { data } = matter(fileContent);
    return {
      slug,
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Berita({ posts }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Berita</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/berita/${post.slug}`}>
              <div>
                <Image src={post.thumbnail} className="w-40" alt={post.title} />
                <h2 className="text-xl">{post.title}</h2>
                <p>
                  {new Date(post.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
