import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const navItems = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Transactions", to: "/app/transactions" },
  { label: "Subscriptions", to: "/app/subscriptions" },
  { label: "Budgets", to: "/app/budgets" },
  { label: "Analytics", to: "/app/analytics" },
];

function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 border-r bg-white md:flex md:flex-col">
        <div className="border-b px-6 py-5">
          <div className="text-2xl font-bold text-gray-900">SpendWise</div>

          <p className="mt-1 text-xs text-gray-500">Personal finance tracker</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Overview
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-4">
          <p className="truncate px-3 text-sm font-medium text-gray-900">
            {user?.email}
          </p>

          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
