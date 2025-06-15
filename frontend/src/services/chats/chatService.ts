import api from "../../config/axios.config";

export const getUserChats = async (userId: string) => {
  const response = await api.get(`/groups/chats/user/${userId}`);
  return response.data.userChats;
};

export const getMessagesofSelectedChat = async (selectedChatId: string,selectedChatType: string) => {
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
    }: {
      chatId: string;
      chatType: string;
      content: string;
      type: string;
    })=> {
  const response = await api.post(`/groups/chats/${chatId}/messages`, {
    chatType,
    content,
    type,
  });
  return response.data;
};


