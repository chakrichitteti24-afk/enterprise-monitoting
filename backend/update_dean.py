import sqlite3
conn = sqlite3.connect('gkce_dsa.db')
conn.execute("UPDATE users SET name='Sudo Users' WHERE role='DEAN'")
conn.commit()
conn.close()
print('Done')
