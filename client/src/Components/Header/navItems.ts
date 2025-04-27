import { Upload } from "lucide-react";


export const lenderNavItems = [
    { name: "Dashboard", path: "/", type: "link" },
    { name: "Portfolio", path: "/portfolio", type: "link" },
    { name: "Profile", path: "/profile", type: "link" },
    { name: "Upload Portfolio", path: "/upload", type: "primary", Icon: Upload }
    // { name: "Signup", path: "/signup", type: "outline" },
];


export const collectorNavItems = [
    { name: "Marketplace", path: "/", type: "link" },
    { name: "Dashboard", path: "/dashboard", type: "link" },
    { name: "My Bids", path: "/bids", type: "link" },
    { name: "Profile", path: "/profile", type: "link" }
];


export const adminNavItems = [
    { name: "Dashboard", path: "/", type: "link" },
    { name: "Users", path: "/users", type: "link" },
    { name: "Audit Logs", path: "/logs", type: "link" },
    { name: "Settings", path: "/settings", type: "link" }
];


export const authNavItems = [
    { name: "Home", path: "/", type: "link" },
    { name: "Login", path: "/login", type: "primary" },
    { name: "Signup", path: "/signup", type: "outline" },
];