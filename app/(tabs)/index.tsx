import PostItem from "@/components/PostItem";
import apis from "@/utils/apis";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from "react-native";

export interface IPostsState {
  id: number;
  attributes: {
    title: string;
    content: string;
    createdAt: Date;
    created_by_user: {
      data: IUserState;
    };
  };
}

export interface IPostState {
  title: string;
  content: string;
}

export interface IUserState {
  id: number;
  attributes: {
    username: string;
  };
}

export default function HomeScreen() {
  const initPost = {
    title: "",
    content: "",
  };

  const [posts, setPosts] = useState<IPostsState[]>([]);
  const [openAddPost, setOpenAddPost] = useState<boolean>(false);
  const [post, setPost] = useState<IPostState>(initPost);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    pageCount: 0,
  });

  const handleGetPost = (page: number = 1) => {
    apis
      .get("posts", {
        populate: {
          created_by_user: {
            fields: ["username", "createdAt"],
          },
        },
        sort: {
          updatedAt: "desc",
        },
        pagination: {
          page: page || pagination.page,
          pageSize: pagination.pageSize,
        },
      })
      .then(res => {
        const { data, meta } = res.data;
        const { pagination } = meta;
        setPosts(page === 1 ? data : prev => prev.concat(data));
        setPagination({
          ...pagination,
          page: pagination.page,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          total: pagination.total,
        });
      })
      .catch(err => {
        alert("get posts: " + err.message);
      });
  };

  const onSubmit = () => {
    if (post.content.trim() === "" || post.title.trim() === "") {
      return alert("Please fill all fields!");
    }

    const localInfo = localStorage.getItem("etwl");

    if (!localInfo) {
      alert("You are not login!");
      router.push("/auth/login");
    }

    const userInfo = JSON.parse(localInfo as string).id;
    const userName = JSON.parse(localInfo as string).username;

    apis
      .post("posts", {
        data: {
          title: post.title,
          content: post.content,
          created_by_user: {
            id: userInfo,
          },
          created_by_user_id: userInfo,
          created_by_user_name: userName,
        },
      })
      .then(res => {
        alert("Create Post successfully!");
        setPost(initPost);
        setOpenAddPost(false);
        handleGetPost(1);
      })
      .catch(err => {
        alert("Create Post: " + err.message);
      });
  };

  useEffect(() => {
    handleGetPost(1);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feeds</Text>
      </View>
      <ScrollView style={{ gap: 8, flex: 1 }}>
        {posts.map((_post, idx) => (
          <PostItem
            key={idx}
            onPressLoadMore={() => handleGetPost(pagination.page + 1)}
            _post={_post}
            haveMore={pagination.page < pagination.pageCount}
            lastIem={idx + 1 === posts.length}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.buttonAdd} onPress={() => setOpenAddPost(true)}>
        <Text style={styles.buttonAddText}>+</Text>
      </TouchableOpacity>
      <Modal
        transparent
        visible={openAddPost}
        onRequestClose={() => setOpenAddPost(!openAddPost)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.headerTitle}>Add a Post</Text>
          <View style={{ marginTop: 16, gap: 16 }}>
            <View style={{ gap: 8 }}>
              <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                <Text style={styles.inputTitle}>Title</Text>
                <Text style={styles.inputRequireDot}>*</Text>
              </View>
              <TextInput style={styles.input} value={post.title} onChangeText={title => setPost({ ...post, title })} />
            </View>
            <View style={{ gap: 8 }}>
              <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                <Text style={styles.inputTitle}>Content</Text>
                <Text style={styles.inputRequireDot}>*</Text>
              </View>
              <TextInput
                style={styles.inputArea}
                multiline
                value={post.content}
                onChangeText={content => setPost({ ...post, content })}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={onSubmit}>
              <Text style={styles.buttonContent}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    textAlign: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: 24,
  },
  buttonAdd: {
    backgroundColor: "blue",
    position: "absolute",
    right: 20,
    bottom: 20,
    padding: 8,
    borderRadius: 100,
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonAddText: {
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    shadowColor: "gray",
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
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
  inputTitle: {
    fontWeight: 500,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  inputRequireDot: {
    color: "red",
  },
  form: {
    display: "flex",
    gap: 16,
    padding: 16,
  },
  button: {
    backgroundColor: "green",
    borderWidth: 2,
    shadowColor: "blue",
    borderRadius: 8,
    padding: 8,
  },
  buttonContent: {
    color: "white",
    fontWeight: 700,
    textAlign: "center",
  },
});
