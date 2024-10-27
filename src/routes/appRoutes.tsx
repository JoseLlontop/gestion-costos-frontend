import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import InfoIcon from '@mui/icons-material/Info';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GestionRecetas from "../pages/recetas/GestionRecetas";
import GestionIngredientes from "../pages/ingredientes/GestionIngredientes";
import GestionGanancia from "../pages/costos/GestionGanancia";
import GestionCostosAdicionales from "../pages/costos/GestionCostosAdicionales";

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
  },

  {
    path: "/gestionCostosAdicionales",
    element: <GestionCostosAdicionales />,
    state: "gestionCostosAdicionales",
    sidebarProps: {
      displayText: "Costos Adicionales",
      icon: <MonetizationOnIcon />
    },
    child: [
      {
        path: "/gestionCostosAdicionales/gestion",
        element: <GestionCostosAdicionales />,
        state: "gestionCostosAdicionales.gestion",
        sidebarProps: {
          displayText: "Gestion Costos Adicionales"
        }
      }
    ]
  },

  {
    path: "/gestionGanancia",
    element: <GestionGanancia />,
    state: "gestionGanancia",
    sidebarProps: {
      displayText: "Ganancia",
      icon: <MonetizationOnIcon />
    },
    child: [
      {
        path: "/gestionGanancia/gestion",
        element: <GestionGanancia />,
        state: "gestionGanancia.gestion",
        sidebarProps: {
          displayText: "Calcular Ganancia"
        }
      }
    ]
  }
  
];

export default appRoutes;