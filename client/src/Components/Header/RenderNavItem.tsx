import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const RenderNavItem = ({
    navItem,
    isMobile = false,
    onClick,
    menuOpen,
    showToggle = false,
}: {
    navItem?: any;
    isMobile?: boolean;
    onClick?: () => void;
    menuOpen?: boolean;
    showToggle?: boolean;
}) => {
    const location = useLocation();

    if (showToggle) {
        return (
            <button className="md:hidden" onClick={onClick}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        );
    }

    const isActive = location.pathname === navItem.path;

    const sharedClasses = `flex items-center gap-2 ${
        isMobile ? "mx-auto my-4 text-xl font-bold" : "text-lg font-bold"
    }`;

    const icon = navItem.Icon && <navItem.Icon className="h-6 w-6" />;

    const content = (
        <>
            {icon}
            {navItem.name}
        </>
    );

    if (navItem.type === "link") {
        return (
            <NavLink
                to={navItem.path}
                onClick={onClick}
                className={({ isActive: linkIsActive }) =>
                    `${sharedClasses} justify-center ${
                        linkIsActive || isActive ? "text-orange" : "text-gray-700"
                    }`
                }
            >
                {content}
            </NavLink>
        );
    } else {
        return (
            <NavLink to={navItem.path} onClick={onClick}>
                <button
                    className={`${sharedClasses} ${
                        navItem.type === "outline" ? "btn-outline" : "btn-primary"
                    } ${isMobile ? "!px-4" : "!px-6"}`}
                >
                    {content}
                </button>
            </NavLink>
        );
    }
};
