const mode = process.env.NODE_ENV == "production" ? "chat" : "test";

export const communityChat = `/ecommunity/2/community-${mode}/proto`;
