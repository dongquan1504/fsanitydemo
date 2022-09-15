import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/future/image";
import Link from "next/link";

import { sanityClient, urlFor } from "../sanity";

import { Post } from "../typings";
import Header from "../components/Header";
import insaneImg from "./assets/insane.png";
import avatar from "./assets/avatar.png";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  // console.log(posts);
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Insane blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex justify-between items-center bg-yellow-400 border-y border-black !py-10 lg:py-0">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4">
              Insane
            </span>{" "}
            is the place to write, read, and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers.
          </h2>
        </div>
        <Image
          className="hidden md:inline-flex h-32 w-44 lg:h-full"
          src={insaneImg}
          alt=""
        />
      </div>

      {/* post */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p6">
        {posts.map((post) => {
          const thumbNail = () =>
            post.mainImage && (
              <img
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()!}
                alt=""
              />
            );

          const title = () => (
            <div>
              <p className="text-lg font-bold">{post.title}</p>
              {post.author && (
                <p className="text-xs">
                  {post.description} by {post.author.name}
                </p>
              )}
            </div>
          );

          const avatar = () =>
            post.author ? (
              <img
                className="h-12 w-12 rounded-full"
                src={urlFor(post.author.image).url()!}
                alt=""
              />
            ) : (
              <Image
                className="hidden md:inline-flex h-32 w-32 lg:h-full"
                src={`${avatar}`}
                alt=""
              />
            );

          return (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="border rounded-lg group cursor-pointer overflow-hidden">
                {thumbNail()}
                <div className="flex justify-between p-5 bg-white">
                  {title()}
                  {avatar()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type=="post"]{
    _id,
    title,
    slug,
    author->{
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
