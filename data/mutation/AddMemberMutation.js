import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType, memberType} from '../type/Types';
import {getViewer} from '../store/UserStore';
import Sequelize from 'sequelize';

import _ from 'lodash';

export default mutationWithClientMutationId({
    name: 'AddMember',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        locationRef: { type: new GraphQLNonNull(GraphQLString) },
        bureauRef: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        nina: { type: new GraphQLNonNull(GraphQLString) },
        contact: { type: new GraphQLNonNull(GraphQLString) },
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
    mutateAndGetPayload: ({viewerId, locationRef, bureauRef, firstName, lastName, nina, contact}) => {

        return DB.models.bureau.findOne({where : {ref: bureauRef}})
            .then(bureau => {

                return DB.models.location.findOne({where: {ref: locationRef}})
                    .then(location => {

                        return DB.models.member.create({

                          first_name: firstName,
                          last_name: lastName,
                          nina: nina,
                          contact: contact,
                          location_id: location.id,
                          role_id: 14, //membre
                          bureau_id:bureau.id,
                        })

                    })
            })
            .catch(Sequelize.Error, (error) => {
                throw new Sequelize.Error;
            })
            .then((member) => { return {
                viewerId: viewerId,
                bureau: member
            }; });
    }
});
