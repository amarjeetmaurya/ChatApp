export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
};

export const getUserId = () => {
  let id = localStorage.getItem("clientId");
  if (!id) {
    id = crypto.randomUUID().slice(0, 8);
    localStorage.setItem("clientId", id);
  }
  return id;
};

export const getUsername = (id) => {
  let username = localStorage.getItem("username");
  if (!username) {
    username = `User${id.slice(0, 4)}`;
    localStorage.setItem("username", username);
  }
  return username;
};