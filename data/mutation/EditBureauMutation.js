import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType, bureauInputType, bureauType} from '../type/Types';
import {getViewer} from '../store/UserStore';
import sanitize from 'sanitize-filename';
import Sequelize from 'sequelize'
import _ from 'lodash';

export default mutationWithClientMutationId({
    name: 'EditBureau',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        locationRef: { type: new GraphQLNonNull(GraphQLString) },
        bureauId: { type: new GraphQLNonNull(GraphQLString) },
        ref: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        members: { type: new GraphQLList(bureauInputType) },
        mediaNames: { type: new GraphQLList(GraphQLString) }
    },
    outputFields: {
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId),
        },
        bureau: {
            type: bureauType,
            resolve: (obj) => obj.bureau,

        }
    },
    mutateAndGetPayload: ({viewerId, locationRef, name, ref, members, mediaNames}) => {


        var sanitizedMediaNames = _.map(mediaNames, name => {
            return sanitize(name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, '') )
        });

        return DB.models.bureau.findOne({where : {ref: ref}})
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
            .then(bureau => {

                return bureau.updateAttributes({name: name})
            })
            .then(bureau => {

                for(var i=0; i < members.length; i++) {

                    const bureauMember = members[i];
                    let locationId = fromGlobalId(bureauMember.locationId).id
                    let roleId = fromGlobalId(bureauMember.roleId).id

                    DB.models.member.findOne({where:{bureau_id: bureau.id}, $and:[{role_id: roleId}]})
                        .then(member => {

                            if(member) {
                                member.updateAttributes({
                                    first_name: bureauMember.firstName,
                                    last_name: bureauMember.lastName,
                                    nina: bureauMember.nina,
                                    contact: bureauMember.contact,
                                    location_id: locationId
                                })
                            } else {

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

                        })
                }

                return bureau

            })
            .catch(Sequelize.Error, (error) => {
                throw new Sequelize.Error;
            })
            .then((bureau) => { return {
                viewerId: viewerId,
                bureau: bureau
            }; });
    }
});
