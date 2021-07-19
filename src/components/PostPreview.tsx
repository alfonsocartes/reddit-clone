import {
  ButtonBase,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { Storage } from "aws-amplify";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { Post } from "../API";
import { formatDatePosted } from "../lib/formatDatePosted";

interface Props {
  post: Post;
}

const PostPreview: FC<Props> = ({ post }) => {
  const router = useRouter();
  const [postImage, setPostImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getImageFromStorage() {
      try {
        const signedURL = await Storage.get(post.image); // get key from Storage.list
        console.log("Found Image:", signedURL);
        // @ts-ignore
        setPostImage(signedURL);
      } catch (error) {
        console.log("No image found.");
      }
    }

    getImageFromStorage();
  }, []);

  return (
    <Paper elevation={3}>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        wrap="nowrap"
        spacing={3}
        style={{
          padding: 12,
          marginTop: 24,
        }}
      >
        <Grid item style={{ maxWidth: 128 }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton color="inherit">
                <ArrowUpward />
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <Typography variant="h6">
                    {(post.upvotes - post.downvotes).toString()}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">votes</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton color="inherit">
                <ArrowDownward />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
          <Grid item>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Typography variant="body1">
                  Posted by <b>{post.owner}</b>{" "}
                  {formatDatePosted(post.createdAt)} hours ago
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h2">{post.title}</Typography>
              </Grid>
              <Grid item style={{ maxHeight: 32, overflowY: "hidden" }}>
                <Typography variant="body1">{post.contents}</Typography>
              </Grid>
              {post.image && postImage && (
                <Grid item>
                  <Image
                    src={postImage}
                    alt={`${post.title} image`}
                    height={540}
                    width={980}
                    layout="intrinsic"
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </ButtonBase>
      </Grid>
    </Paper>
  );
};

export default PostPreview;
