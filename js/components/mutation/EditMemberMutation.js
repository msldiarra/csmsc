import Relay from 'react-relay';
import _ from 'lodash'


export default class EditMemberMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {editMemberMutation}`;
    }


    getVariables() {
        return {
            viewerId : this.props.viewerId,
            locationRef : this.props.locationRef,
            memberId: this.props.memberId,
            roleId: this.props.roleId,
            firstName : this.props.firstName,
            lastName : this.props.lastName,
            nina : this.props.nina,
            contact : this.props.contact,

        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on EditMemberPayload {
              viewer 
          }
    `;
    }

    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    viewer: this.props.viewer.id
                }
            }
        ]
    }

    static fragments = {
        viewer: () => Relay.QL`
          fragment on Viewer {
            id
          }
    `,
    };

    getOptimisticResponse() {

        return {
            viewer: {
                id: this.props.viewer.id,
            },
        };
    }
}

