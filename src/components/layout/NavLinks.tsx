"use client"
import { NavLink } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"

export default function NavLinks() {
  const { user } = useAuth()

  // Define navigation links based on user type
  const getNavLinks = () => {
    // Links for users who are not logged in
    if (!user) {
      return [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
      ]
    }

    // Links for food providers
    if (user.userType === "provider") {
      return [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/my-listings", label: "My Listings" },
        { to: "/orders", label: "Orders" },
      ]
    }

    // Links for NGOs
    return [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/browse", label: "Browse Food" },
      { to: "/cart", label: "Cart" },
      { to: "/orders", label: "Orders" },
    ]
  }

  const links = getNavLinks()

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `font-medium text-sm ${
              isActive
                ? "text-kartavya-primary border-b-2 border-kartavya-primary"
                : "text-gray-600 hover:text-kartavya-dark"
            } transition-colors duration-200 py-1`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}
