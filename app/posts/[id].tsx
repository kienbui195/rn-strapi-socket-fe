import { ICommentState } from "@/components/PostItem";
import { IPostState, IPostsState, IUserState } from "@/app/(tabs)";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import apis from "@/utils/apis";
import { ScrollView } from "react-native-gesture-handler";
import ContentItem from "@/components/PostItem/PostItem";
import { usePathname } from "expo-router";

const PostDetail = () => {
  const pathname = usePathname();
  const params = pathname.split("/")[pathname.split("/").length - 1];
  const [comments, setComments] = useState<ICommentState[]>([]);
  const [comment, setComment] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    pageCount: 0,
    total: 0,
  });
  const [openInput, setOpenInput] = useState<boolean>(false);
  const userInfo = localStorage.getItem("etwl") ? JSON.parse(localStorage.getItem("etwl") as string).id : 0;
  const [post, setPost] = useState<IPostsState>({
    id: 0,
    attributes: {
      content: "",
      created_by_user: {
        data: {
          id: 0,
          attributes: {
            username: "",
          },
        },
      },
      createdAt: new Date(),
      title: "",
    },
  });

  const handleGetComment = (page: number = 1) => {
    if (post.id === 0) return;
    apis
      .get("comments", {
        filters: {
          comment_for: {
            id: post.id,
          },
        },
        populate: {
          created_by_user: {
            fields: ["username"],
          },
        },
        pagination: {
          page: page || pagination.page,
          pageSize: pagination.pageSize,
        },
      })
      .then(res => {
        const { data, meta } = res.data;
        const { pagination } = meta;
        setComments(page === 1 ? data : prev => prev.concat(data));
        setPagination(prev => ({
          ...prev,
          page: pagination.page,
          pageCount: pagination.pageCount,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }));
      })
      .catch(err => {
        alert("Get comments: " + err.message);
      });
  };

  const handleAddComment = () => {
    if (comment.trim() === "") return alert("Please type a comment!");
    const localInfo = localStorage.getItem("etwl");
    if (!localInfo) return;

    const userId = JSON.parse(localInfo).id || 0;
    const userName = JSON.parse(localInfo).username || "";
    if (userId === 0) return;

    apis
      .post("comments", {
        data: {
          content: comment,
          created_by_user: {
            id: userId,
          },
          created_by_user_id: +userId,
          created_by_user_name: userName,
          comment_for: {
            id: post.id,
          },
          comment_for_id: post.id,
          post_by_user_id: post.attributes.created_by_user.data.id,
          post_by_user_name: post.attributes.created_by_user.data.attributes.username,
        },
      })
      .then(res => {
        alert("Add comment successfully!");
        setComment("");
        setOpenInput(false);
        handleGetComment(1);
      })
      .catch(err => {
        alert("Add comment failed: " + err.message);
      });
  };

  useEffect(() => {
    const handleGetPostDetails = () => {
      apis
        .getOne("posts", +params, {
          populate: {
            created_by_user: {
              fields: ["username", "createdAt"],
            },
          },
        })
        .then(res => {
          setPost(res.data.data);
        })
        .catch(err => {
          alert("get post detail: " + err.message);
        });
    };

    handleGetPostDetails();
  }, [params]);

  useEffect(() => {
    if (post.id !== 0) {
      handleGetComment(1);
    }
  }, [post.id]);

  return (
    <View
      style={{
        padding: 16,
        gap: 8,
        flex: 1,
      }}
    >
      <View style={{ flex: 1 }}>
        <ContentItem _post={post} />
        <ScrollView
          style={{
            marginTop: 16,
            borderTopWidth: 1,
            paddingTop: 8,
            backgroundColor: "white",
          }}
        >
          {comments.length > 0 ? (
            comments.map((_comment, idx) => (
              <View key={idx}>
                <View style={{ padding: 8, gap: 8 }} key={idx}>
                  <Text style={{}}>{`${
                    userInfo === _comment.attributes.created_by_user.data.id
                      ? "You"
                      : _comment.attributes.created_by_user.data.attributes.username
                  }: ${_comment.attributes.content}`}</Text>
                </View>
                {pagination.page < pagination.pageCount && (
                  <TouchableOpacity onPress={() => handleGetComment(pagination.page + 1)}>
                    <Text>Load More</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={{ fontStyle: "italic" }}>No comment</Text>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.addCommentBtn} onPress={() => setOpenInput(true)}>
        <Text style={{ fontWeight: 500, color: "white", textAlign: "center" }}>Add Comment</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={openInput}
        onRequestClose={() => setOpenInput(!openInput)}
        style={{
          flex: 1,
        }}
      >
        <TextInput
          placeholder="type your comment..."
          value={comment}
          onChangeText={comment => setComment(comment)}
          style={styles.inputArea}
          multiline
        />
        <TouchableOpacity style={styles.addCommentBtn} onPress={handleAddComment}>
          <Text style={{ fontWeight: 500, color: "white", textAlign: "center" }}>Submit</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PostDetail;

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
