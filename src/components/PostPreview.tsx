import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import React, { FC } from "react";
import { Post } from "../API";

interface Props {
  post: Post;
}

const PostPreview: FC<Props> = ({ post }) => {
  return (
    <Paper elevation={3}>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={3}
        style={{ width: "100%", padding: 12, marginTop: 24 }}
      >
        <Grid item spacing={1} style={{ maxWidth: 128 }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton color="inherit">
                <ArrowUpward />
              </IconButton>
            </Grid>
            <Grid item>votes</Grid>
            <Grid item>
              <IconButton color="inherit">
                <ArrowDownward />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="column" alignItems="flex-start">
            <Grid item>
              <Typography variant="body1">
                Posted by <b>{post.owner}</b> at <b>{post.createdAt}</b>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h2">{post.title}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostPreview;
