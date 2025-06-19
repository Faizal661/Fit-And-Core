import api from "../../config/axios.config";

export const getUserChats = async (userId: string) => {
  const response = await api.get(`/groups/chats/user/${userId}`);
  return response.data.userChats;
};

export const getMessagesofSelectedChat = async (
  selectedChatId: string,
  selectedChatType: string
) => {
  const response = await api.get(`/groups/chats/${selectedChatId}/messages`, {
    params: { type: selectedChatType },
  });
  return response.data.messagesData;
};

export const sendMessage = async ({
  chatId,
  chatType,
  content,
  type,
  file,
}: {
  chatId: string;
  chatType: string;
  content: string;
  type: string;
  file?: File;
}) => {
  
  let data;
  if (type === "image" && file) {
    data = new FormData();
    data.append("chatType", chatType);
    data.append("file", file);
    data.append("type", type);
  } else {
    data = { chatType, content, type };
  }

  const response = await api.post(
    `/groups/chats/${chatId}/messages`,
    data 
  );
  return response.data;
};
