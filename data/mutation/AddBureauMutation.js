import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType, bureauInputType} from '../type/Types';
import {getViewer} from '../store/UserStore';
import sanitize from 'sanitize-filename';
import Sequelize from 'sequelize'
import _ from 'lodash';

export default mutationWithClientMutationId({
    name: 'AddBureau',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        locationRef: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        members: { type: new GraphQLList(bureauInputType) },
        mediaNames: { type: new GraphQLList(GraphQLString) }
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

    mutateAndGetPayload: ({viewerId, locationRef, name, members, mediaNames}) => {

        var sanitizedMediaNames = _.map(mediaNames, name => {
            return sanitize(name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, '') )
        });

        return DB.models.bureau.create({name: name})
            .then(bureau => {

                return DB.models.location.findOne({where: {ref: locationRef}})
                    .then(location => {

                        bureau.addLocation(location)

                        // Add Media
                        if(sanitizedMediaNames.length > 0) {
                            DB.models.media.findAll({where: {name: {in: sanitizedMediaNames}}})
                                .then((media) => {
                                    if(media) {
                                        bureau.addMedia(media);
                                    }
                                });
                        }


                        return bureau
                    })
            })
            .then(bureau => {

                for(var i=0; i < members.length; i++) {

                    const bureauMember = members[i];
                    let locationId = fromGlobalId(bureauMember.locationId).id
                    let roleId = fromGlobalId(bureauMember.roleId).id

                    DB.models.member.create({
                        first_name: bureauMember.firstName,
                        last_name: bureauMember.lastName,
                        nina: bureauMember.nina,
                        contact: bureauMember.contact,
                        location_id: locationId,
                        bureau_id: bureau.id,
                        role_id: roleId
                    })
                }

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
});
