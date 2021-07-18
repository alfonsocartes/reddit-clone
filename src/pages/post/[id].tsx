import { Container } from "@material-ui/core";
import { withSSRContext } from "aws-amplify";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React, { FC } from "react";

import { GetPostQuery, ListPostsQuery, Post } from "../../API";
import PostComment from "../../components/PostComment";
import PostPreview from "../../components/PostPreview";
import { getPost, listPosts } from "../../graphql/queries";

interface Props {
  post: Post;
}

const IndividualPost: FC<Props> = ({ post }) => {
  return (
    <Container maxWidth="md">
      <PostPreview post={post} />

      {post.comments.items.map((comment) => {
        <PostComment key={comment.id} comment={comment} />;
      })}
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { params } = context;
  const SSR = withSSRContext();

  const postsQuery = (await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  })) as { data: GetPostQuery };

  return {
    props: {
      post: postsQuery.data.getPost as Post,
    },
    revalidate: 1, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();

  const response = (await SSR.API.graphql({ query: listPosts })) as {
    data: ListPostsQuery;
    errors: any;
  };

  const paths = response.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: "blocking" };
};

export default IndividualPost;
