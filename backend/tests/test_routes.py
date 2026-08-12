from app.main import app


def test_required_routes_exist():
    paths = set(app.openapi()["paths"].keys())

    assert "/auth/register" in paths
    assert "/auth/login" in paths
    assert "/auth/me" in paths

    assert "/categories" in paths
    assert "/transactions" in paths
    assert "/subscriptions" in paths
    assert "/budgets" in paths

    assert "/dashboard/summary" in paths
    assert "/analytics/summary" in paths