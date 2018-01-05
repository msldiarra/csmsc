import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLScalarType, GraphQLError, Kind, GraphQLInputObjectType } from 'graphql';
import { connectionArgs, connectionFromPromisedArray, globalIdField, nodeDefinitions, fromGlobalId, connectionDefinitions} from 'graphql-relay';
import { DB, User, Location, Bureau, Member, Role, Locations} from '../database';
import { Viewer, getViewer } from '../store/UserStore';
import moment from 'moment';
import lodash from 'lodash';

export const {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {

        let {type, id} = fromGlobalId(globalId);

        if (type === 'User') { return DB.models.user.findOne({where: {id: id}}); }
        if (type === 'Location') { return DB.models.location.findOne({where: {id: id}}); }
        if (type === 'Locations') { return DB.models.locations.findOne({where: {id: id}}); }
        if (type === 'Bureau') { return DB.models.bureau.findOne({where: {id: id}}); }
        if (type === 'Member') { return DB.models.member.findOne({where: {id: id}}); }
        if (type === 'Role') { return DB.models.role.findOne({where: {id: id}}); }
        if (type === 'Viewer') { return getViewer(id)}
        else { return null; }
    },
    (obj) => {

        if (obj instanceof User.Instance) { return userType; }
        else if (obj instanceof Location.Instance) { return locationType; }
        else if (obj instanceof Locations.Instance) { return locationsType; }
        else if (obj instanceof Bureau.Instance) { return bureauType; }
        else if (obj instanceof Member.Instance) { return memberType; }
        else if (obj instanceof Role.Instance) { return roleType; }
        else if (obj.id.startsWith('me')) { return viewerType; }
        else {
            return null;
        }
    }
);

export const bureauType = new GraphQLObjectType({
    name: 'Bureau',
    fields: () => {
        return {
            id: globalIdField('Bureau'),
            ref: { type: GraphQLString, resolve(bureau) { return bureau.ref } },
            name: { type: GraphQLString, resolve(bureau) { return bureau.name } },
            location: {
                type: locationType,
                description: 'bureau location',
                resolve(bureau) {
                    return bureau.getLocations()
                        .then(locations => locations[0]);
                }
            },
            members: {
                type: new GraphQLList(memberType),
                description: 'stock location',
                resolve(bureau) { return bureau.getMembers(); }
            },
            media: {
                type: mediaConnection,
                description: "A bureau's collection of media",
                args: connectionArgs,
                resolve: (bureau, args) => {
                    return connectionFromPromisedArray(DB.models.bureau.findOne({where:  {id: bureau.id}})
                            .then(bureau => bureau.getMedia()) ,
                        args)
                }
            },
        }
    },
    interfaces: () => [nodeInterface]
});


export const memberType = new GraphQLObjectType({
    name: 'Member',
    fields: () => {
        return {
            id: globalIdField('Member'),
            firstName: { type: GraphQLString, resolve(member) { return member.first_name } },
            lastName: { type: GraphQLString, resolve(member) { return member.last_name } },
            nina: { type: GraphQLString, resolve(member) { return member.nina } },
            contact: { type: GraphQLString, resolve(member) { return member.contact } },
            location: {
                type: locationType,
                description: 'VFQ',
                resolve(member) { return member.getLocation(); }
            },
            bureau: {
                type: bureauType,
                description: 'Member\'s bureau',
                resolve(member) { return member.getBureau(); }
            },
            role: {
                type: roleType,
                description: 'Role in bureau',
                resolve(member) { return member.getRole(); }
            }
        }
    },
    interfaces: () => [nodeInterface]
});

export const roleType = new GraphQLObjectType({
    name: 'Role',
    fields: () => {
        return {
            id: globalIdField('Role'),
            name: { type: GraphQLString, resolve(role) { return role.name } },
        }
    },
    interfaces: () => [nodeInterface]
});


export const locationType = new GraphQLObjectType({
    name: 'Location',
    fields: () => {
        return {
            id: globalIdField('Location'),
            ref : { type: GraphQLString, resolve(location) { return location.ref } },
            name : { type: GraphQLString, resolve(location) { return location.name } },
            type : { type: GraphQLInt, resolve(location) { return location.getLocationType().get('id') } }
        }
    },
    interfaces: () => [nodeInterface]
});

export const locationsType = new GraphQLObjectType({
    name: 'Locations',
    fields: () => {
        return {
            id: globalIdField('Locations'),
            ref : { type: GraphQLString, resolve(locations) { return locations.ref } },
            name : { type: GraphQLString, resolve(locations) { return locations.name } },
            type : { type: GraphQLInt, resolve(locations) { return locations.getLocationType().get('id') } }
        }
    },
    interfaces: () => [nodeInterface]
});


export const GraphQLMoment = new GraphQLScalarType({
    name: 'Date',
    serialize: function (value) {
        let date = moment(value);
        if(!date.isValid()) {
            throw new GraphQLError('Field serialize error: value is an invalid Date');
        }
        return date.format();
    },
    parseValue: function (value) {
        let date = moment(value);
        if(!date.isValid()) {
            throw new GraphQLError('Field parse error: value is an invalid Date');
        }
        return date;
    },

    parseLiteral: (ast) => {
        if(ast.kind !== Kind.STRING) {
            throw new GraphQLError('Query error: Can only parse strings to date but got: ' + ast.kind);
        }
        let date = moment(ast.value);
        if(!date.isValid()) {
            throw new GraphQLError('Query error: Invalid date');
        }
        return date;
    }
});

export const userType = new GraphQLObjectType({
    name: 'User',
    description: 'A user credentials',
    fields: () => {
        return {
            id: globalIdField('UserType'),
            firstName: { type: GraphQLString, resolve: (obj) => obj.first_name },
            lastName: { type: GraphQLString, resolve: (obj) => obj.last_name },
            login: { type: GraphQLString, resolve: (obj) => obj.login },
            email: { type: GraphQLString, resolve: (obj) => obj.email },
            enabled: { type: GraphQLBoolean, resolve: (obj) => obj.enabled },
        }
    },
    interfaces: [nodeInterface]
});

export const mediaType = new GraphQLObjectType({
    name: 'Media',
    fields: () => ({
        id: globalIdField('Media'),
        uri: {
            type: GraphQLString,
            description: 'Media uri',
            resolve(mediaType) { return mediaType.uri }
        },
        name: {
            type: GraphQLString,
            description: 'Media name',
            resolve(mediaType) { return mediaType.name }
        },
        mime_type: {
            type: GraphQLString,
            description: 'Media mime type',
            resolve(mediaType) { return mediaType.mime_type }
        },
    }),
    interfaces: () => [nodeInterface]
});

export const bureauInputType = new GraphQLInputObjectType({
    name: 'BureauInput',
    fields: () => ({
        roleId: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        nina: { type: GraphQLString },
        contact: { type: GraphQLString },
        locationId: { type: new GraphQLNonNull(GraphQLString) }
    }),
});

export const memberInputType = new GraphQLInputObjectType({
    name: 'MemberInput',
    fields: () => ({
        roleId: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        nina: { type: GraphQLString },
        contact: { type: GraphQLString },
        locationId: { type: new GraphQLNonNull(GraphQLString) }
    }),
});

export const viewerType = new GraphQLObjectType({
    name: 'Viewer',
    description: 'Application viewer',
    fields: () => {
        return {
            id: globalIdField('Viewer'),
            user: { type:  userType, resolve: (obj) => {
                if(obj.userId) return DB.models.user.findOne({where: {id: obj.userId}})
            } },
            roles: {
                type: new GraphQLList(roleType),
                description: "List of bureau role",
                resolve: () => {
                    return DB.models.role.findAll({where: {name: {$ne: 'Membre'}}});
                }
            },
            roleSearch: {
                type: new GraphQLList(roleType),
                description: "List of bureau role",
                args: {
                    search: {
                        name: 'search',
                        type: GraphQLString
                    }
                },
                resolve: (_, args) => {
                    const search = args.search ? args.search + '%' : '%';
                    return DB.models.role.findAll({where: {name: {$iLike: search}}});
                }
            },
            bureau: {
                type: bureauType,
                description: "bureau",
                args: {
                    ref: {
                        name: 'ref',
                        type: GraphQLString
                    }
                },
                resolve: (_,{ref}) => {
                    return DB.models.bureau.findOne({where: {ref: {$eq: ref}}});
                }
            },
            bureauList: {
                type: bureauConnection,
                description: "List of bureau by location",
                args: {
                    ...connectionArgs,
                    locationRef: {
                        name: 'locationRef',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_,args) => {
                    return connectionFromPromisedArray(DB.models.location.findOne({where: {ref: {$eq: args.locationRef}}})
                        .then((location) => {
                            if(location) {
                                return location.getBureau()
                            }
                            else return []
                    }), args);
                }
            },
            memberList: {
                type: memberConnection,
                description: "List of members by bureau",
                args: {
                    ...connectionArgs,
                    bureauRef: {
                        name: 'bureauRef',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_,args) => {
                    return connectionFromPromisedArray(DB.models.bureau.findOne({where: {ref: {$eq: args.bureauRef}}})
                        .then((bureau) => {
                            if(bureau) {
                                return bureau.getMembers()
                            }
                            else return []
                        }), args);
                }
            },
            member: {
                type: memberType,
                description: "Member",
                args: {
                    ...connectionArgs,
                    memberId: {
                        name: 'memberId',
                        type: GraphQLInt
                    }
                },
                resolve: (_,args) => {
                    return DB.models.member.findOne({where: {id: {$eq: args.memberId}}});
                }
            },
            locations: {
                type: locationsConnection,
                description: "List of location",
                args: {
                    ...connectionArgs,
                    search: {
                        name: 'search',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_, args) => {
                    var term = args.search? args.search + '%' : '';
                    return connectionFromPromisedArray(DB.models.locations.findAll({
                        where: {name: {$iLike: term} },
                        order: '"name"'
                    }).then((locations) => {
                        if(locations) return locations
                        else return []
                    }), args)
                }
            },
            communes: {
                type: locationConnection,
                description: "List of communes",
                args: {
                    ...connectionArgs,
                    search: {
                        name: 'search',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_, args) => {
                    var term = args.search? args.search + '%' : '';
                    return connectionFromPromisedArray(DB.models.location.findAll({
                        where: {name: {$iLike: term}, $and: [{location_type_id: {$eq: 3}}] },
                        order: '"name"'
                    }).then((locations) => {
                        if(locations) return locations
                        else return []
                    }), args)
                }
            },
            vfq: {
                type: locationConnection,
                description: "List of vfq",
                args: {
                    ...connectionArgs,
                    search: {
                        name: 'search',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    communeRef: {
                        name: 'communeRef',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_, args) => {
                    return connectionFromPromisedArray(DB.models.location.findOne({where: {ref: {$eq: args.communeRef}}})
                            .then(location => {
                                if(location)
                                    return DB.models.location_child.findAll({where: {parent_id: {$eq: location.id}}})
                                        .then((location_child) => {
                                            if(location_child) {
                                                return DB.models.location.findAll({
                                                    where: {id: {$in: lodash.map(location_child, (child) => child.child_id)},
                                                        $and: [{location_type_id: {$eq: 4}}, {name: {$iLike: args.search + '%'}} ]},
                                                    order: 'name'
                                                })
                                            }
                                        })
                                else return []

                            })
                        , args);
                }
            }
        }
    },
    interfaces: [nodeInterface]
});

export const {connectionType: locationConnection} =
    connectionDefinitions({
        name: 'Location',
        nodeType: locationType
    });

export const {connectionType: locationsConnection} =
    connectionDefinitions({
        name: 'Locations',
        nodeType: locationsType
    });

export const {connectionType: bureauConnection} =
    connectionDefinitions({
        name: 'Bureau',
        nodeType: bureauType
    });

export const {connectionType: memberConnection} =
    connectionDefinitions({
        name: 'Member',
        nodeType: memberType
    });

export const {connectionType: mediaConnection, edgeType : mediaEdge} =
    connectionDefinitions({
        name: 'Medias',
        nodeType: mediaType
    });