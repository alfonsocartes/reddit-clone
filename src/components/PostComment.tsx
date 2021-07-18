import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { Comment } from "../API";
import { formatDatePosted } from "../lib/formatDatePosted";

interface Props {
  comment: Comment;
}

const PostComment = ({ comment }: Props) => {
  return (
    <Paper
      style={{ width: "100%", minHeight: 128, padding: 16, marginTop: 32 }}
      elevation={1}
    >
      <Grid container spacing={1} direction="column">
        <Grid item>
          <Typography variant="body1">
            Posted by <b>{comment.owner}</b>{" "}
            {formatDatePosted(comment.createdAt)} hours ago
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h2">{comment.content}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostComment;
