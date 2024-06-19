import { IPostsState } from "@/app/(tabs)";
import React from "react";
import { Text, View } from "react-native";

const ContentItem = ({ _post }: { _post: IPostsState }) => {
  return (
    <View>
      <Text
        style={{
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        {_post.attributes.title}
      </Text>
      <Text>{_post.attributes.content}</Text>
    </View>
  );
};

export default ContentItem;
