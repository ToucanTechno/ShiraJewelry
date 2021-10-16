import mysqlx from '@mysql/xdevapi';

const config = { schema: 'shira-studio', user: 'root', password: 'SerJ!oMu74n%', port: 33060 };

class DBSession {
  session: any;
  constructor(session) {
    this.session = session;
  }
  static async build(): Promise<DBSession> {
    const session = await mysqlx.getSession({ user: config.user, password: config.password, port: config.port });
    return new DBSession(session);
  }

  getTable(tableName): any {
    return this.session.getSchema('shira-studio').getTable(tableName);
  }
}

module.exports = DBSession;
