import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { Button, Container, Grid, TextField } from "@material-ui/core";
import { API, withSSRContext } from "aws-amplify";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React, { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Comment,
  CreateCommentInput,
  CreateCommentMutation,
  GetPostQuery,
  ListPostsQuery,
  Post,
} from "../../API";
import PostComment from "../../components/PostComment";
import PostPreview from "../../components/PostPreview";
import { createComment } from "../../graphql/mutations";
import { getPost, listPosts } from "../../graphql/queries";

interface Props {
  post: Post;
}

interface IFormInput {
  comment: string;
}

const IndividualPost: FC<Props> = ({ post }) => {
  const [comments, setComments] = useState<Comment[]>(
    post.comments.items as Comment[]
  );
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    const newCommentInput: CreateCommentInput = {
      postID: post.id,
      content: data.comment,
    };
    // Add Comment Mutation
    const createNewComment = (await API.graphql({
      query: createComment,
      variables: { input: newCommentInput },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    })) as { data: CreateCommentMutation };

    setComments([...comments, createNewComment.data.createComment as Comment]);
  };

  return (
    <Container maxWidth="md">
      <PostPreview post={post} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        style={{ marginTop: 32 }}
      >
        <Grid container spacing={2} direction="row" alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <TextField
              style={{ width: "100%" }}
              variant="outlined"
              id="comment"
              label="Comment"
              type="text"
              multiline
              error={errors.comment ? true : false}
              helperText={errors.comment ? errors.comment.message : null}
              {...register("comment", {
                required: { value: true, message: "Please enter a comment." },

                maxLength: {
                  value: 240,
                  message: "Please enter a comment under 240 characters.",
                },
              })}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="default" type="submit">
              Add Comment
            </Button>
          </Grid>
        </Grid>
      </form>

      {comments
        ?.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        ?.map((comment) => (
          <PostComment key={comment.id} comment={comment} />
        ))}
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
