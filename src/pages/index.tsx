import React, { useEffect, useState } from "react";
import { Container, Typography } from "@material-ui/core";
import { API } from "aws-amplify";

import { listPosts } from "../graphql/queries";
import { useUser } from "../context/AuthContext";
import { ListPostsQuery, Post } from "../API";
import PostPreview from "../components/PostPreview";

const Home: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromAPI = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({ query: listPosts })) as {
        data: ListPostsQuery;
        errors: any;
      };
      if (allPosts.data) {
        setPosts(allPosts.data.listPosts.items as Post[]);
        return allPosts.data.listPosts.items as Post[];
      } else {
        throw new Error("Could not get posts");
      }
    };

    fetchPostsFromAPI();
  }, []);

  console.log("User", user);
  console.log("Posts:", posts);

  return (
    <Container maxWidth="md">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Container>
  );
};

export default Home;
