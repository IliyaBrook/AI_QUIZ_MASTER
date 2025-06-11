import type { RouteObject } from "react-router";
import Home from "@/pages/home/Home";
import Page1 from "@/pages/page1/Page1";

type IAppPage =  {
  label: string;
  path: string;
} & RouteObject

export const appPages:IAppPage[] = [
    {
      index: true,
      element: <Home />,
      label: 'Home',
      path: '/',
    },
    {
      element: <Page1 />, 
      label: 'Page 1',
      path: '/page1',
    }
  ]