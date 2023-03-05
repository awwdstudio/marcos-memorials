
const BlockContent = require("@sanity/block-content-to-react");
import SyntaxHighlighter from "react-syntax-highlighter";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import imageUrlBuilder from "@sanity/image-url";
import styles from "../../styles/Home.module.css";


export default function Post({ title, image, body, slug }) {

    // router
    const router = useRouter();

    // image url state
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
        const imageBuilder = imageUrlBuilder({
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: "production",
        });

        setImageUrl(imageBuilder.image(image));
    }, [image])

    // serializers for block content
    const serializers = {
        types: {
          code: (props) => (
            <div className="my-2">
              <SyntaxHighlighter language={props.node.language}>
                {props.node.code}
              </SyntaxHighlighter>
            </div>
          ),
        },
      };


      return (
        <>
          <div className={styles.postItem}>
            <div className={styles.postNav} onClick={() => router.push("/")}>
              &#x2190;
            </div>
            {imageUrl && <img src={imageUrl} alt={title} />}
            <div>
              <h1>
                  <strong>{title}</strong>
              </h1>
            </div>
            <div className={styles.postBody}>
              <BlockContent
                blocks={body}
                serializers={serializers}
                imageOptions={{ w: 320, h: 240, fit: "max" }}
                projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                dataset={"production"}
              />
            </div>
          </div>
        </>
      );


}

// getServerSideProps is a Next.js function that runs on the server
// it is used to fetch data from the server
// pageContext is the context of the page (the page's props)
export const getServerSideProps = async (pageContext) => {

    // get the slug from the page context
    const pageSlug = pageContext.query.slug;

    // get the post from sanity using the slug
    const particularPost = encodeURIComponent(
      `*[ _type == "post" && slug.current == "${pageSlug}" ]`
    );

    // the url of the particular post slug
    const url = `https://ejzxzuat.api.sanity.io/v1/data/query/production?query=${particularPost}`;

    // fetch the post, set response to json
    const postData = await fetch(url).then((res) => res.json());

    // get the post from the response 
    // 0 is the first item in the array
    // should be no more than one item in the array
    const postItem = postData.result[0];

    // if postItem exists, return the postItem
    if (postItem) {
      return {

        // props is the object that will be passed to the component
        props: {

            // pass the postItem to the component
          title: postItem.title,
          image: postItem.mainImage,
          body: postItem.body,
          slug: postItem.slug.current,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  };