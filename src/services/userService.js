import http from "./httpService";

export function getCurrentUserInfo() {
  return http.get("/api/user_service/v2/current");
}

export function getUserInfo(id) {
  return http.get(`/api/user_service/v2/user/${id}`);
}

export function updatePassword({
  id,
  oldPassword,
  newPassword
}) {
  return http.put(
    `/api/user_service/v2/user/${id}/password`, {
      id,
      oldPassword,
      newPassword
    }
  );
}

export function updateUser({
  id,
  username,
  displayName,
  email,
  isAdmin
}) {
  return http.put(
    `/api/user_service/v2/user/${id}`, {
      username,
      displayName,
      email,
      isAdmin
    }
  );
}

export function getUserList({
  page = 0,
  size = 200
} = {}) {
  return http.get(
    "/api/user_service/v2/users", {
      params: {
        page,
        size
      }
    }
  );
}

export function getUserDetailList({
  page = 0,
  size = 200
} = {}) {
  return http.get(
    "/api/user_service/v2/users/details", {
      params: {
        page,
        size
      }
    }
  );
}

export function createUser({
  username,
  displayName,
  email,
  password,
  isAdmin
}) {
  return http.post(
    "/api/user_service/v2/user", {
      username,
      displayName,
      email,
      password,
      isAdmin
    }
  );
}

export function addUserList(userList=[]) {
  return http.post(
    "/api/user_service/v2/users", userList
  );
}

export function importUsers(formData) {
  return http.post("/api/user_service/v2/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export function deleteUser(id) {
  return http.delete(`/api/user_service/v2/user/${id}`);
}

export function unlockUser(id) {
  return http.post(`/api/user_service/v2/user/${id}/action/unlock`);
}

export default {
  getUserInfo,
  getUserList,
  getUserDetailList,
  updateUser,
  createUser,
  addUserList,
  updatePassword,
  getCurrentUserInfo,
  importUsers,
  deleteUser,
  unlockUser
};