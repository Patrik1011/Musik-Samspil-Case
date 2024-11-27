import Login from "../../pages/unauthenticated/auth/Login";
import Register from "../../pages/unauthenticated/auth/Register";
import Home from "../../pages/authenticated/Home";
import Profile from "../../pages/authenticated/Profile";
import Onboarding from "../../pages/authenticated/OnBoarding";
import Ensembles from "../../pages/authenticated/Ensembles";
import EnsembleDetail from "../../pages/authenticated/ensembles/Details";
import Posts from "../../pages/common/posts/UserPosts.tsx";
import React from "react";
import PostDetails from "../../pages/common/posts/Details.tsx";

type RouteConfig = {
  path: string;
  component: React.ReactElement;
  protected: boolean;
  isPublic?: boolean;
};

export const routes: RouteConfig[] = [
  {
    path: "/login",
    component: <Login />,
    protected: false,
  },
  {
    path: "/register",
    component: <Register />,
    protected: false,
  },
  {
    path: "/posts",
    component: <Posts />,
    protected: true,
  },
  {
    path: "/post-details/:id",
    component: <PostDetails />,
    protected: true,
  },
  {
    path: "/home",
    component: <Home />,
    protected: false,
    isPublic: true,
  },
  {
    path: "/profile",
    component: <Profile />,
    protected: true,
  },
  {
    path: "/ensembles",
    component: <Ensembles />,
    protected: true,
  },
  {
    path: "/ensembles/:id",
    component: <EnsembleDetail />,
    protected: true,
  },
  {
    path: "/onboarding",
    component: <Onboarding />,
    protected: true,
  },
] as const;
