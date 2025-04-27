import { NavLink } from "react-router-dom";
import { useState } from "react";
import { lenderNavItems } from "./navItems";
import { adminNavItems } from "./navItems";
import { collectorNavItems } from "./navItems";
import { authNavItems } from "./navItems";
import { RenderNavItem } from "./RenderNavItem";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeToken, getActiveRole, SuccessNotification, ErrorNotification } from '@src/utils';
import { logout } from '@src/redux/slices/userSlice';
import { Axios } from '@src/api';
import { BiLoaderAlt } from "react-icons/bi";

function BaseHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const activeRole = getActiveRole();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {

        try {
            setIsLoggingOut(true);
            if (!activeRole) throw new Error("No active role found.");

            await Axios.post(`/auth/logout`, { role: activeRole });

            removeToken(activeRole); // clear localStorage
            dispatch(logout()); // clear redux
            SuccessNotification("Logged out successfully!");
            navigate(`/login`);
        } catch (err) {
            console.error("Logout Error", err);
            ErrorNotification("Logout failed. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getNavItemsForRole = (role: string | null) => {
        switch (role) {
            case "lender":
                return lenderNavItems;
            case "collector":
                return collectorNavItems;
            case "admin":
                return adminNavItems;
            default:
                return authNavItems;
        }
    };

    const navItems = getNavItemsForRole(activeRole);

    return (
        <header className="bg-gray-100 border-b border-gray-300">
            <div className="max-w-7xl mx-auto px-4 md:px-16 py-8 md:py-4 flex justify-between items-center">
                <NavLink to="/">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange">
                        LENDER APP
                    </h1>
                </NavLink>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <RenderNavItem key={item.path} navItem={item} />
                    ))}

                    <button
                        onClick={handleLogout}
                        className={`btn-outline ${!activeRole ? "hidden" : "block"}`}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <BiLoaderAlt className="animate-spin text-2xl mx-auto" />
                        ) : (
                            'Logout'
                        )}
                    </button>
                </nav>

                {/* Mobile Toggle Icon */}
                <RenderNavItem
                    showToggle
                    menuOpen={menuOpen}
                    onClick={() => setMenuOpen((prev) => !prev)}
                />
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-3">
                    {navItems.map((item) => (
                        <RenderNavItem
                            key={item.path}
                            navItem={item}
                            isMobile
                            onClick={() => setMenuOpen(false)}
                        />
                    ))}
                    <div className="flex justify-center">
                        <button
                            onClick={handleLogout}
                            className="!px-12 btn-outline"
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <BiLoaderAlt className="animate-spin text-2xl mx-auto" />
                            ) : (
                                'Logout'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default BaseHeader;
