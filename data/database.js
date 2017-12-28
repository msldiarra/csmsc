import Sequelize from 'sequelize';

export const DB = new Sequelize(
    'csmsc',
    'postgres',
    '1234',
    {
        dialect: 'postgres',
        host: 'localhost'
    }
);

export const Location = DB.define('location', {
        name: Sequelize.STRING,
        ref: Sequelize.STRING,
        location_type_id: {type: Sequelize.INTEGER, field: 'location_type_id'}
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const Locations = DB.define('locations', {
        name: Sequelize.STRING,
        ref: Sequelize.STRING,
        location_type_id: {type: Sequelize.INTEGER, field: 'location_type_id'}
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const LocationType = DB.define('location_type', {
        label: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true, underscored: true}
);


DB.define('location_child', {
        parent_id: Sequelize.INTEGER,
        child_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const Bureau = DB.define('bureau', {
        name: Sequelize.STRING,
        ref: Sequelize.STRING,
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const BureauLocation = DB.define('bureau_location', {
        bureau_id: Sequelize.INTEGER,
        location_id: Sequelize.INTEGER,
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const Media = DB.define('media', {
        uri: Sequelize.STRING,
        name: Sequelize.STRING,
        mime_type: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const BureauMedia = DB.define('bureau_media', {
        bureau_id: Sequelize.INTEGER,
        media_id: {type: Sequelize.INTEGER, field: 'media_id'}
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const Member = DB.define('member', {
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        nina: Sequelize.STRING,
        contact: Sequelize.STRING,
        location_id: Sequelize.INTEGER,
        bureau_id: Sequelize.INTEGER,
        role_id: Sequelize.INTEGER,
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

export const Role = DB.define('role', {
        name: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true, underscored: true}
);

DB.define('location_child', {
        parent_id: Sequelize.INTEGER,
        child_id: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true, underscored: true}
);


export const User = DB.define('user', {
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN,
    } , {timestamps: false, tableName: 'users'}
);



Location.belongsTo(LocationType, {as: 'locationType', foreignKey: 'location_type_id'});

Bureau.belongsToMany(Location, {as: 'locations',through: BureauLocation, foreignKey: 'bureau_id' });
Location.belongsToMany(Bureau, {as: 'bureau',through: BureauLocation, foreignKey: 'location_id' });
Media.belongsToMany(Bureau, {through: BureauMedia, foreignKey: 'media_id' });
Bureau.belongsToMany(Media, {as: 'media',through: BureauMedia, foreignKey: 'bureau_id' });


Member.belongsTo(Location, {as: 'location', foreignKey: 'location_id'});
Member.belongsTo(Role, {as: 'role', foreignKey: 'role_id'});
Bureau.hasMany(Member, { as: 'members' });
Member.belongsTo(Bureau, { as: 'bureau',  foreignKey: 'bureau_id'});


DB.sync({force: false});

