import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType, memberInputType} from '../type/Types';
import {getViewer} from '../store/UserStore';
import sanitize from 'sanitize-filename';
import Sequelize from 'sequelize'
import _ from 'lodash';

export default mutationWithClientMutationId({
    name: 'NewBureau',
    inputFields: {
        viewerId: {type: new GraphQLNonNull(GraphQLString)},
        locationRef: {type: new GraphQLNonNull(GraphQLString)},
        bureauRef: {type: GraphQLString},
        name: {type: new GraphQLNonNull(GraphQLString)},
        member: {type: memberInputType},
        mediaNames: {type: new GraphQLList(GraphQLString)}
    },
    outputFields: {
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId),
        },
        bureauRef: {
            type: GraphQLString,
            resolve: (obj) => obj.bureau.ref,
        },
    },

    mutateAndGetPayload: ({viewerId, bureauRef, locationRef, name, member, mediaNames}) => {

        const sanitizedMediaNames = _.map(mediaNames, name => {
            return sanitize(name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''))
        });

        if (bureauRef !== '') {

            return DB.models.bureau.findOne({where: {ref: bureauRef}})
                .then(bureau => {

                    return DB.models.location.findOne({where: {ref: locationRef}})
                        .then(location => {

                            DB.models.bureau_location.findOne({where: {bureau_id: bureau.id}})
                                .then(bureau_location => bureau_location.updateAttributes({
                                    location_id: location.id
                                }))

                            return bureau
                        })
                })
                .then(bureau => {

                    if (sanitizedMediaNames.length > 0) {
                        DB.models.media.findAll({where: {name: {in: sanitizedMediaNames}}})
                            .then((media) => {
                                if (media) {
                                    bureau.addMedia(media);
                                }
                            });
                    }

                    return bureau

                })
                .then(bureau => {

                    return bureau.updateAttributes({name: name})
                })
                .then(bureau => {

                    DB.models.member.create({
                        first_name: member.firstName,
                        last_name: member.lastName,
                        nina: member.nina,
                        contact: member.contact,
                        location_id: fromGlobalId(member.locationId).id,
                        bureau_id: bureau.id,
                        role_id: fromGlobalId(member.roleId).id
                    });

                    return bureau
                })
                .catch(Sequelize.Error, (error) => {
                    throw new Sequelize.Error;
                })
                .then((bureau) => {
                    return {
                        viewerId: viewerId,
                        bureau: bureau
                    };
                });

        }

        else {

            return DB.models.bureau.create({name: name})
                .then(bureau => {

                    return DB.models.location.findOne({where: {ref: locationRef}})
                        .then(location => {

                            bureau.addLocation(location)

                            // Add Media
                            if (sanitizedMediaNames.length > 0) {
                                DB.models.media.findAll({where: {name: {in: sanitizedMediaNames}}})
                                    .then((media) => {
                                        if (media) {
                                            bureau.addMedia(media);
                                        }
                                    });
                            }


                            return bureau
                        })
                })
                .then(bureau => {

                    console.log(member)

                    DB.models.member.create({
                        first_name: member.firstName,
                        last_name: member.lastName,
                        nina: member.nina,
                        contact: member.contact,
                        location_id: fromGlobalId(member.locationId).id,
                        bureau_id: bureau.id,
                        role_id: fromGlobalId(member.roleId).id
                    })

                    return bureau
                })
                .catch(Sequelize.Error, (error) => {
                    console.log(error)
                    throw new Sequelize.Error;
                })
                .then((bureau) => {
                    return {
                        viewerId: viewerId,
                        bureau: bureau
                    };
                });
        }
    }
})
