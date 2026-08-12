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
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
                S
              </div>

              <div>
                <p className="text-[15px] font-semibold text-gray-950">
                  SpendWise
                </p>
                <p className="text-xs text-gray-400">Personal finance</p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-6">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              Overview
            </p>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "group flex items-center rounded-xl px-3 py-2.5",
                      "text-sm font-medium transition",
                      isActive
                        ? "bg-gray-950 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-950",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={[
                          "mr-3 h-1.5 w-1.5 rounded-full",
                          isActive
                            ? "bg-white"
                            : "bg-gray-300 group-hover:bg-gray-500",
                        ].join(" ")}
                      />

                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-gray-100 p-4">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user?.email}
              </p>

              <button
                type="button"
                onClick={logout}
                className="mt-2 text-sm font-medium text-gray-500 transition hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="border-b border-gray-200 bg-white lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
                  S
                </div>

                <span className="font-semibold text-gray-950">SpendWise</span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-gray-500"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
