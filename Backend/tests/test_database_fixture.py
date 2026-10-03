from sqlalchemy import text


def test_test_database_connection(db_session):
    result = db_session.execute(
        text("SELECT current_database()")
    ).scalar_one()

    assert result == "pivot_test_db"