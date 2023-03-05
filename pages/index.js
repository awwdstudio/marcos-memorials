
import  {useState, useEffect} from "react"
import { useRouter } from 'next/router'
import imageUrlBuilder from "@sanity/image-url";

import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { client } from "@/client"

export default function Home({posts}) {


   // router
   const router = useRouter()

   // posts state
   const [receivedPosts, setReceivedPosts] = useState([])
 
   // get posts on mount
   useEffect(() => {
     // if posts are received, set them
     if (posts.length) {
       // create image builder
       const imgBuilder = imageUrlBuilder({
         projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
         dataset: "production",
       });
       // set posts
       setReceivedPosts(
         // map over posts and add mainImage
         posts.map((post) => {
           return {
             // add other post data
             ...post,
             // add mainImage
             mainImage: imgBuilder.image(post.mainImage),
           };
         })
       );
     } else {
       // if no posts are received, set empty array
       setReceivedPosts([]);
     }
 
     // if posts are received, set them
     // dependency array
   }, [posts]);



   return (
    <div className={styles.main}>
      <h1>Welcome to Bully Dynastiec</h1>
      <div className={styles.feed}>
        {receivedPosts.length ? (
          receivedPosts.map((post, index) => (
            <div
              key={index}
              className={styles.post}
              onClick={() => router.push(`/post/${post.slug.current}`)}
            >
              <img
                className={styles.img}
                src={post.mainImage}
                alt="post thumbnail"
              />
              <h3>{post.title}</h3>
            </div>
          ))
        ) : (
          <>No Posts</>
        )}
      </div>
    </div>
  );
}

export const getStaticProps = async (pageContext) => {
  const query = '*[_type == "post"][0...3]'
  const posts = await client.fetch(query)

  return {
    props: {
      posts,
    },
  }
}