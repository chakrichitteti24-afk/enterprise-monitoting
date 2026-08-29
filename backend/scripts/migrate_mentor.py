import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sqlalchemy import create_engine, text
from app.core.config import settings

def run_migration():
    engine = create_engine(settings.DATABASE_URL)
    with engine.begin() as conn:
        print('1. Adding mentor_id to teams table...')
        check_col = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='teams' and column_name='mentor_id';")).fetchone()
        if not check_col:
            conn.execute(text("ALTER TABLE teams ADD COLUMN mentor_id INTEGER REFERENCES mentors(id) ON DELETE SET NULL;"))
            print('2. Migrating existing assignments...')
            conn.execute(text("UPDATE teams SET mentor_id = mentors.id FROM mentors WHERE teams.id = mentors.assigned_team_id;"))
            print('Data migration successful.')
        else:
            print('mentor_id column already exists on teams.')

        print('3. Dropping assigned_team_id from mentors table...')
        check_col_mentor = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='mentors' and column_name='assigned_team_id';")).fetchone()
        if check_col_mentor:
            conn.execute(text("ALTER TABLE mentors DROP COLUMN assigned_team_id;"))
            print('Dropped assigned_team_id from mentors.')
        else:
            print('assigned_team_id already dropped from mentors.')
    print('Migration completed successfully!')

if __name__ == '__main__':
    run_migration()
