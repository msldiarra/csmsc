import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId} from 'graphql-relay';
import { DB } from '../database';
import {viewerType, memberType} from '../type/Types';
import {getViewer} from '../store/UserStore';
import Sequelize from 'sequelize';

import _ from 'lodash';

export default mutationWithClientMutationId({
    name: 'EditMember',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        memberId: { type: new GraphQLNonNull(GraphQLString) },
        roleId: { type: GraphQLString },
        locationRef: { type: GraphQLString},
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString},
        nina: { type: GraphQLString},
        contact: { type: GraphQLString},
    },
    outputFields: {
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId),
        },
        member: {
            type: memberType,
            resolve: (obj) => obj.member,

        }
    },
    mutateAndGetPayload: ({viewerId, memberId, locationRef, firstName, lastName, nina, contact, roleId}) => {

        return DB.models.member.findOne({where : {id: fromGlobalId(memberId).id}})
            .then(member => {

                return DB.models.location.findOne({where: {ref: locationRef}})
                    .then(location => {

                        return member.updateAttributes({
                            first_name: firstName,
                            last_name: lastName,
                            nina: nina,
                            contact: contact,
                            location_id: location.id,
                            role_id: fromGlobalId(roleId).id,
                        })

                    })
            })
            .catch(Sequelize.Error, (error) => {
                throw new Sequelize.Error;
            })
            .then((member) => { return {
                viewerId: viewerId,
                member: member
            }; });
    }
});
