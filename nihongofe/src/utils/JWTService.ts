import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Định nghĩa interface cho Payload của JWT
export interface JwtPayload {
  id: number;
  role: string;
}

// Lấy token từ cookies
export function getToken() {
  const token = Cookies.get("token"); // Sử dụng cookies thay vì localStorage
  return token;
}

// Xóa token khỏi cookies
export function removeToken() {
  Cookies.remove("token"); // Xóa token khỏi cookies
}

// Kiểm tra xem token có hết hạn không
export function isTokenExpired(token: string) {
  const decodedToken = jwtDecode(token);

  if (!decodedToken.exp) {
    // Token không có thời gian hết hạn (exp)
    return false;
  }

  const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
  return currentTime > decodedToken.exp;
}

// Kiểm tra xem có token trong cookies không
export function isToken() {
  const token = Cookies.get("token"); // Lấy token từ cookies
  return token ? true : false; // Nếu có token thì trả về true
}

// Lấy username từ token trong cookies
export function getUsernameByToken() {
  const token = Cookies.get("token"); // Lấy token từ cookies
  if (token) {
    return jwtDecode(token).sub; // Giải mã và lấy sub (username) từ token
  }
  return null;
}

// Lấy ID người dùng từ token trong cookies
export function getIdUserByToken() {
  const token = Cookies.get("token"); // Lấy token từ cookies
  if (token) {
    const decodedToken = jwtDecode<JwtPayload>(token) as JwtPayload;
    return decodedToken.id; // Lấy ID người dùng từ token
  }
  return null;
}

// Đăng xuất (xóa token khỏi cookies và chuyển hướng người dùng)
export function logout(navigate: any) {
  Cookies.remove("token"); // Xóa token khỏi cookies
  navigate("/"); // Chuyển hướng về trang chủ (hoặc bất kỳ trang nào bạn muốn)
}

export function setToken(token: string) {
  // Lưu token vào cookie, thiết lập thời gian hết hạn là 1 ngày
  Cookies.set("token", token, { expires: 1, secure: true, sameSite: "Strict" });
}

export function manualParsedCoolies(cookies: string) {
  const parsedCookies: Record<string, string> = cookies
    .split("; ")
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
  return parsedCookies;
}
