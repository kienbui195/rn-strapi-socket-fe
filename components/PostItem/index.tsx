import { IPostState, IPostsState, IUserState } from "@/app/(tabs)";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ContentItem from "./PostItem";
import apis from "@/utils/apis";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

export interface ICommentState {
  id: number;
  attributes: {
    content: string;
    created_by_user: {
      data: IUserState;
    };
    comment_for: {
      data: IPostState;
    };
  };
}

const PostItem = ({
  _post,
  lastIem = false,
  haveMore = false,
  onPressLoadMore,
}: {
  _post: IPostsState;
  lastIem: boolean;
  haveMore: boolean;
  onPressLoadMore: () => void;
}) => {

  if (!_post) return null

  return (
    <View>
      <View>
        <View style={styles.contentContainer}>
          <ContentItem _post={_post} />
          <View style={styles.commentBar}>
            <Text>{`By: ${_post.attributes.created_by_user?.data.attributes.username}`}</Text>
            <Text>{`${moment(_post.attributes.createdAt).fromNow()}`}</Text>
            <TouchableOpacity
              style={styles.commentButton}
              onPress={() => router.push(`/posts/${_post.id}`)}
            >
              <Text style={{ color: "white" }}>Comment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {lastIem && haveMore && (
          <TouchableOpacity
            style={styles.loadmoreButton}
            onPress={onPressLoadMore}
          >
            <Text style={{ textAlign: "center" }}>View More</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowOpacity: 0.6,
    shadowColor: "gray",
    paddingVertical: 16,
    paddingHorizontal: 8,
    margin: 8,
    gap: 16,
  },
  commentBar: {
    flexDirection: "row",
    borderWidth: 2,
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentButton: {
    backgroundColor: "green",
    padding: 4,
    borderRadius: 4,
  },
  loadmoreButton: {
    backgroundColor: "white",
    paddingHorizontal: 4,
    paddingVertical: 16,
  },
  addCommentBtn: {
    position: "absolute",
    padding: 8,
    backgroundColor: "blue",
    bottom: 16,
    left: 16,
    right: 16,
  },
  inputArea: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 200,
  },
});
