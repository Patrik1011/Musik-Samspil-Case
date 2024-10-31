const { Entity, ObjectIdColumn, ObjectId, Column } = require('typeorm');

@Entity()
class User {
  @ObjectIdColumn()
  id: typeof ObjectId;

  @Column()
  name: string;

  @Column()w
  email: string;
}

module.exports = { User };