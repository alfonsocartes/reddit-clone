import React, { FC } from "react";
import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from "next";
import { withSSRContext } from "aws-amplify";
import { getPost, listPosts } from "../../graphql/queries";
import { GetPostQuery, ListPostsQuery, Post } from "../../API";
import { Container } from "@material-ui/core";
import PostPreview from "../../components/PostPreview";
import PostComment from "../../components/PostComment";

interface Props {
  post: Post;
}

const IndividualPost: FC<Props> = ({ post }) => {
  return (
    <div>
      <PostPreview post={post} />

      {post.comments.items.map((comment) => {
        <PostComment key={comment.id} comment={comment} />;
      })}
    </div>
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
