import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import InfoIcon from '@mui/icons-material/Info';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GestionRecetas from "../pages/recetas/GestionRecetas";
import GestionIngredientes from "../pages/ingredientes/GestionIngredientes";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/informacion",
    element: <HomePage />,
    state: "informacion",
    sidebarProps: {
      displayText: "Informacion General",
      icon: <InfoIcon />
    }
  },
  {
    path: "/gestionRecetas",
    element: <GestionRecetas />,
    state: "gestionRecetas",
    sidebarProps: {
      displayText: "Recetas",
      icon: <MenuBookIcon />
    },
    child: [
      {
        path: "/gestionRecetas/gestion",
        element: <GestionRecetas />,
        state: "gestionRecetas.gestion",
        sidebarProps: {
          displayText: "Gestion Recetas"
        }
      }
    ]
  },
  {
    path: "/gestionIngredientes",
    element: <GestionIngredientes />,
    state: "gestionIngredientes",
    sidebarProps: {
      displayText: "Ingredientes",
      icon: <DinnerDiningIcon />
    },
    child: [
      {
        path: "/gestionIngredientes/gestion",
        element: <GestionIngredientes />,
        state: "gestionIngredientes.gestion",
        sidebarProps: {
          displayText: "Gestion Ingredientes"
        }
      }
    ]
  }
];

export default appRoutes;