import Login from "../../pages/unauthenticated/auth/Login";
import Register from "../../pages/unauthenticated/auth/Register";
import Home from "../../pages/authenticated/home";
import Profile from "../../pages/authenticated/profile";
import Onboarding from "../../pages/authenticated/onboarding";
import Ensembles from "../../pages/authenticated/ensembles";
import EnsembleDetail from "../../pages/authenticated/ensembles/Details";
import PostsApplications from "../../pages/authenticated/posts/applications";
import React from "react";
import PostDetails from "../../pages/authenticated/posts/Details.tsx";
import Posts from "../../pages/authenticated/posts";
import Matchmaking from "../../pages/authenticated/matchmaking";
import UpdateProfile from "../../pages/authenticated/profile/UpdateProfile.tsx";

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
    protected: false,
    isPublic: true,
  },
  {
    path: "/post-application/:id",
    component: <PostsApplications />,
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
    path: "/update-profile",
    component: <UpdateProfile />,
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
    path: "/matchmaking",
    component: <Matchmaking />,
    protected: true,
  },
  {
    path: "/onboarding",
    component: <Onboarding />,
    protected: true,
  },
] as const;
