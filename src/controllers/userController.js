import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import session from "express-session";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    req.flash("error", "입력된 패스워드가 일치하지 않습니다.");
    return res.status(400).render("join", {
      pageTitle,
    });
  }
  const exists = await User.exists({
    $or: [{ username: req.body.username }, { email }],
  });
  if (exists) {
    req.flash("error", "이미 가입된 username 혹은 email입니다.");
    return res.status(400).render("join", {
      pageTitle,
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    req.flash("ok", "가입완료");
    return res.redirect("/login");
  } catch (error) {
    req.flash("ok", error);
    return res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error._message });
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  req.flash("ok", "로그인 되었습니다.");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      req.flash("error", "유효한 이메일 정보가 존재하지 않습니다.");
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : "default username",
        socialOnly: true,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("ok", "로그인 되었습니다.");
    return res.redirect("/");
  } else {
    req.flash("error", "로그인을 실패하였습니다.");
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.flash("ok", "로그아웃 되었습니다.");
  req.session.destroy();
  res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  const isHeroku = process.env.NODE_ENV === "production";
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;

  req.flash("ok", "사용자 정보 수정이 완료되었습니다.");
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  // send notification
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    req.flash("error", "현재 패스워드가 일치하지 않습니다.");
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    req.flash("error", "변경하려는 패스워드가 일치하지 않습니다.");
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
    });
  }
  user.password = newPassword;
  await user.save();

  req.flash("ok", "패스워드 변경이 완료되었습니다. 다시 로그인해주세요.");
  return res.redirect("/user/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "user not found" });
  }
  return res.render("profile", { pageTitle: `${user.name}`, user });
};

export const startKakaotalkLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    response_type: "code",
    client_id: process.env.KT_CLIENT,
    redirect_uri: "http://localhost:4000/user/kakaotalk/finish",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishKakaotalkLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const isHeroku = process.env.NODE_ENV === "production";
  const redirectUrl = isHeroku
    ? "https://youtube-clone-trazomssome.herokuapp.com/user/kakaotalk/finish/"
    : "http://localhost:4000/user/kakaotalk/finish";

  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KT_CLIENT,
    redirect_uri: redirectUrl,
    code: req.query.code,
    client_secret: process.env.KT_SECRET,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com";
    const userData = await (
      await fetch(`${apiUrl}/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const { has_email, is_email_verified, email } = userData.kakao_account;
    if (has_email !== true || is_email_verified !== true) {
      req.flash("error", "유효한 이메일 정보가 존재하지 않습니다.");
      return res.redirect("/login");
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.kakao_account.profile.profile_image_url,
        name: userData.kakao_account.profile.nickname,
        socialOnly: true,
        username: userData.id,
        email: userData.kakao_account.email,
        password: "",
        location: "Default",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("ok", "로그인 되었습니다.");
    return res.redirect("/");
  } else {
    req.flash("error", "로그인을 실패하였습니다.");
    return res.redirect("/login");
  }
};
